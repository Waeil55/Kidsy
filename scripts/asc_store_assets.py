"""Uploads Kidsy's App Store screenshots (and optional review contact) through the App Store
Connect API. Runs in GitHub Actions (.github/workflows/store-assets.yml) with the same API key
secrets as the iOS build, so the key never leaves GitHub.

Env: ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_PATH, APP_ID, SHOTS_DIR
Optional: REVIEW_FIRST_NAME, REVIEW_LAST_NAME, REVIEW_PHONE, REVIEW_EMAIL
"""
import glob
import hashlib
import json
import os
import sys
import time
import urllib.error
import urllib.request

import jwt  # PyJWT with cryptography

API = 'https://api.appstoreconnect.apple.com/v1'
APP_ID = os.environ['APP_ID']
SHOTS = os.environ.get('SHOTS_DIR', 'store/screenshots')
# File prefix -> App Store display type (sizes: iPhone 1290x2796, iPad 2048x2732).
TYPES = {'iphone': 'APP_IPHONE_67', 'ipad': 'APP_IPAD_PRO_3GEN_129'}


def token():
    key = open(os.environ['ASC_KEY_PATH']).read()
    now = int(time.time())
    return jwt.encode({'iss': os.environ['ASC_ISSUER_ID'], 'iat': now, 'exp': now + 1100, 'aud': 'appstoreconnect-v1'},
                      key, algorithm='ES256', headers={'kid': os.environ['ASC_KEY_ID'], 'typ': 'JWT'})


def call(method, url, body=None, headers=None, raw=None):
    if not url.startswith('http'):
        url = API + url
    h = {'Authorization': 'Bearer ' + token()} if 'appstoreconnect.apple.com' in url else {}
    data = raw
    if body is not None:
        data = json.dumps(body).encode()
        h['Content-Type'] = 'application/json'
    h.update(headers or {})
    req = urllib.request.Request(url, data=data, method=method, headers=h)
    try:
        with urllib.request.urlopen(req) as r:
            txt = r.read()
            return json.loads(txt) if txt and r.headers.get('Content-Type', '').startswith('application/json') else {}
    except urllib.error.HTTPError as e:
        print(f'{method} {url} -> {e.code}: {e.read().decode()[:800]}')
        raise


def editable_version():
    res = call('GET', f'/apps/{APP_ID}/appStoreVersions?filter[platform]=IOS&limit=10')
    for v in res['data']:
        if v['attributes']['appStoreState'] in ('PREPARE_FOR_SUBMISSION', 'DEVELOPER_REJECTED', 'REJECTED', 'METADATA_REJECTED'):
            return v
    sys.exit('No editable iOS version found')


def upload_screenshots(version_id):
    locs = call('GET', f'/appStoreVersions/{version_id}/appStoreVersionLocalizations')['data']
    loc = next((l for l in locs if l['attributes']['locale'] == 'en-US'), locs[0])
    sets = call('GET', f"/appStoreVersionLocalizations/{loc['id']}/appScreenshotSets?include=appScreenshots")
    by_type = {s['attributes']['screenshotDisplayType']: s for s in sets['data']}
    for prefix, dtype in TYPES.items():
        files = sorted(glob.glob(os.path.join(SHOTS, f'{prefix}-*.png')))
        if not files:
            continue
        s = by_type.get(dtype)
        if s:
            # Replace what is there so re-running gives the same result.
            for ref in s.get('relationships', {}).get('appScreenshots', {}).get('data', []):
                call('DELETE', f"/appScreenshots/{ref['id']}")
        else:
            s = call('POST', '/appScreenshotSets', {'data': {'type': 'appScreenshotSets', 'attributes': {'screenshotDisplayType': dtype},
                     'relationships': {'appStoreVersionLocalization': {'data': {'type': 'appStoreVersionLocalizations', 'id': loc['id']}}}}})['data']
        for f in files:
            blob = open(f, 'rb').read()
            shot = call('POST', '/appScreenshots', {'data': {'type': 'appScreenshots', 'attributes': {'fileName': os.path.basename(f), 'fileSize': len(blob)},
                        'relationships': {'appScreenshotSet': {'data': {'type': 'appScreenshotSets', 'id': s['id']}}}}})['data']
            for op in shot['attributes']['uploadOperations']:
                part = blob[op['offset']:op['offset'] + op['length']]
                call(op['method'], op['url'], raw=part, headers={h['name']: h['value'] for h in op['requestHeaders']})
            call('PATCH', f"/appScreenshots/{shot['id']}", {'data': {'type': 'appScreenshots', 'id': shot['id'],
                 'attributes': {'uploaded': True, 'sourceFileChecksum': hashlib.md5(blob).hexdigest()}}})
            print(f'uploaded {os.path.basename(f)} -> {dtype}')
    # Wait for Apple to finish processing and report any rejected images.
    for _ in range(20):
        time.sleep(6)
        sets = call('GET', f"/appStoreVersionLocalizations/{loc['id']}/appScreenshotSets?include=appScreenshots")
        shots = [i for i in sets.get('included', []) if i['type'] == 'appScreenshots']
        states = [(i['attributes']['fileName'], (i['attributes'].get('assetDeliveryState') or {}).get('state')) for i in shots]
        if all(st in ('COMPLETE', 'FAILED') for _, st in states):
            break
    for name, st in states:
        print(f'{name}: {st}')
    if any(st == 'FAILED' for _, st in states):
        sys.exit('Some screenshots failed processing')


def set_review_contact(version_id):
    fields = {k: os.environ.get(e, '').strip() for k, e in [('contactFirstName', 'REVIEW_FIRST_NAME'), ('contactLastName', 'REVIEW_LAST_NAME'),
                                                         ('contactPhone', 'REVIEW_PHONE'), ('contactEmail', 'REVIEW_EMAIL')]}
    fields = {k: v for k, v in fields.items() if v}
    if not fields:
        return
    try:
        det = call('GET', f'/appStoreVersions/{version_id}/appStoreReviewDetail').get('data')
    except urllib.error.HTTPError:
        det = None
    if det:
        call('PATCH', f"/appStoreReviewDetails/{det['id']}", {'data': {'type': 'appStoreReviewDetails', 'id': det['id'], 'attributes': fields}})
    else:
        call('POST', '/appStoreReviewDetails', {'data': {'type': 'appStoreReviewDetails', 'attributes': fields,
             'relationships': {'appStoreVersion': {'data': {'type': 'appStoreVersions', 'id': version_id}}}}})
    print('review contact saved:', ', '.join(fields))


if __name__ == '__main__':
    v = editable_version()
    print('version', v['attributes']['versionString'], v['attributes']['appStoreState'])
    if os.environ.get('DO_SCREENSHOTS', 'true') == 'true':
        upload_screenshots(v['id'])
    set_review_contact(v['id'])
