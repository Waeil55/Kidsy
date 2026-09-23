import React, { useRef, useState } from 'react';
import { LuDownload, LuLockKeyhole, LuUpload, LuPlus, LuPencil, LuTrash2 } from 'react-icons/lu';
import { useStore, THEMES, AVATARS, exportBackup, parseBackup, listProfiles } from '../store/store.js';
import { GRADES } from '../data/grades.js';
import { micSupported, ttsSupported, speak, ONLINE_VOICES } from '../lib/speech.js';
import { Modal, Notice, toast } from '../ui/ui.jsx';

const Toggle = ({ on, onChange, label, hint }) => (
  <label className="row" style={{ cursor: 'pointer', padding: '8px 0' }}>
    <span className="grow"><b>{label}</b>{hint && <div className="tiny muted">{hint}</div>}</span>
    <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} style={{ width: 26, height: 26, accentColor: 'var(--a)' }} />
  </label>
);

export default function Me() {
  const { state, dispatch } = useStore();
  const fileRef = useRef(null);
  const [err, setErr] = useState('');
  const [wipe, setWipe] = useState(false);
  const [editProfile, setEditProfile] = useState(null); // null | 'new' | {id,name,avatar,gradeKey}
  const [delProfile, setDelProfile] = useState(null);
  const set = (patch) => dispatch({ type: 'settings', patch });
  const c = state.custom;
  const profiles = listProfiles();
  const download = () => {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([exportBackup(state)], { type: 'application/json' })); a.download = `kidsy-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
  };
  const restore = async (f) => {
    setErr('');
    try { const st = parseBackup(await f.text()); dispatch({ type: 'import', state: st }); toast('Backup restored', '✅'); } catch (e) { setErr(e.message || 'That file could not be read.'); }
  };
  return (
    <>
      <h1>Me &amp; settings</h1>
      <section className="card col">
        <h3>Family profiles</h3>
        <p className="muted tiny">Each child gets their own scores, progress and stickers. Tap a buddy to switch.</p>
        <div className="row wrap gap8">
          {profiles.map((p) => (
            <div key={p.id} className={`profile-chip ${p.id === state.profile.id ? 'on' : ''}`}>
              <button className="profile-chip-hit" onClick={() => p.id !== state.profile.id && dispatch({ type: 'profile-switch', id: p.id })}>
                <span className="profile-chip-av">{p.avatar}</span><b>{p.name}</b><small>{p.gradeKey}</small>
              </button>
              <button className="profile-chip-edit" onClick={() => setEditProfile(p)} aria-label={`Edit ${p.name}`}><LuPencil /></button>
              {profiles.length > 1 && <button className="profile-chip-edit" onClick={() => setDelProfile(p)} aria-label={`Remove ${p.name}`}><LuTrash2 /></button>}
            </div>
          ))}
          <button className="profile-chip add" onClick={() => setEditProfile('new')}><LuPlus /> Add child</button>
        </div>
      </section>
      <section className="grid g2">
        <div className="card col">
          <h3>My profile</h3>
          <label className="f">My name<input value={state.profile.name} maxLength={18} onChange={(e) => dispatch({ type: 'profile', patch: { name: e.target.value } })} /></label>
          <label className="f">My grade<select value={state.profile.gradeKey || state.gradeKey} onChange={(e) => dispatch({ type: 'profile', patch: { gradeKey: e.target.value } })}>{GRADES.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}</select></label>
          <div className="grade-lock-note"><LuLockKeyhole /><span><b>This profile is locked to {GRADES.find((g) => g.key === (state.profile.gradeKey || state.gradeKey))?.label}.</b><small>Only this grade's lessons, stories, practice and study breaks appear for this child.</small></span></div>
          <div><div className="tiny muted" style={{ fontWeight: 800, marginBottom: 6 }}>My buddy</div>
            <div className="row wrap gap8">{AVATARS.map((a) => <button key={a} className={`iconbtn ${state.profile.avatar === a ? 'on' : ''}`} style={{ fontSize: 24, width: 52, height: 52 }} onClick={() => dispatch({ type: 'profile', patch: { avatar: a } })} aria-label={`Buddy ${a}`}>{a}</button>)}</div></div>
          <div><div className="tiny muted" style={{ fontWeight: 800, marginBottom: 6 }}>Colours</div>
            <div className="row wrap">{THEMES.map((t) => <button key={t.key} className="btn sm" style={{ background: `linear-gradient(135deg,${t.a},${t.b})`, outline: state.theme === t.key ? '4px solid var(--ink)' : 'none' }} onClick={() => dispatch({ type: 'set', patch: { theme: t.key } })}>{t.label}</button>)}</div></div>
        </div>
        <div className="card col">
          <h3>Reading, sound &amp; microphone</h3>
          <Toggle on={state.settings.autoRead} onChange={(v) => set({ autoRead: v })} label="Read every question to me" hint="Human-sounding voice" />
          <Toggle on={state.settings.praise !== false} onChange={(v) => set({ praise: v })} label="Cheer me on with a voice" hint="Says Great job! after answers" />
          <Toggle on={state.settings.sounds} onChange={(v) => set({ sounds: v })} label="Sound effects" />
          <Toggle on={state.settings.bigText} onChange={(v) => set({ bigText: v })} label="Bigger story text" />
          <Toggle on={state.settings.openLevels} onChange={(v) => set({ openLevels: v })} label="Open all 50 levels" hint="For grown-ups: skip the unlock steps" />
          <label className="f">Reading voice<select value={state.settings.voiceMode || 'auto'} onChange={(e) => set({ voiceMode: e.target.value })}><option value="auto">AI voice (online, free)</option><option value="device">This device's own voice</option></select></label>
          <label className="f">AI voice<select value={state.settings.onlineVoice || 'auto'} onChange={(e) => set({ onlineVoice: e.target.value })}>{ONLINE_VOICES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
          <label className="f">Accent<select value={state.settings.accent || 'en'} onChange={(e) => set({ accent: e.target.value })}>{[['en', 'American'], ['en-GB', 'British'], ['en-AU', 'Australian'], ['en-IN', 'Indian']].map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
          <button className="btn sm soft" onClick={() => speak('Hello my friend! I will read your stories to you. Let us have fun and learn together.', { rate: state.settings.rate })}>🔊 Test the voice</button>
          <label className="f">Reading speed: {state.settings.rate.toFixed(1)}x<input type="range" min="0.6" max="1.3" step="0.1" value={state.settings.rate} onChange={(e) => set({ rate: +e.target.value })} /></label>
          <label className="f">Microphone language<select value={state.settings.micLang} onChange={(e) => set({ micLang: e.target.value })}>{[['en-US', 'English (US)'], ['en-GB', 'English (UK)'], ['en-AU', 'English (Australia)'], ['en-IN', 'English (India)'], ['en-CA', 'English (Canada)']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
          {!micSupported() && <Notice kind="warn">This browser cannot listen. Chrome, Edge and Safari can. Everything else still works with taps.</Notice>}
        </div>
      </section>
      <section className="card col">
        <h3>My content</h3>
        <p className="muted">{c.packs.length} saved lessons · {c.words.length} words · {c.flashcards.length} flashcards · {c.qa.length} questions · {c.math.length} math · {c.fill.length} fill-ins · {c.stories.length} stories</p>
        <div className="row wrap"><button className="btn danger sm" onClick={() => setWipe(true)}>Delete all my uploaded &amp; created content</button></div>
      </section>
      <section className="card col">
        <h3>Backup</h3>
        <p className="muted">Everything is saved on this device. A backup file lets you move to another device or keep a copy.</p>
        <div className="row wrap"><button className="btn" onClick={download}><LuDownload /> Save backup</button><button className="btn soft" onClick={() => fileRef.current.click()}><LuUpload /> Restore backup</button><input ref={fileRef} type="file" accept=".json" className="hide" onChange={(e) => e.target.files[0] && restore(e.target.files[0])} /></div>
        {err && <Notice kind="err">{err}</Notice>}
      </section>
      {editProfile && <ProfileEditor value={editProfile} onClose={() => setEditProfile(null)} onSave={(patch) => { if (editProfile === 'new') dispatch({ type: 'profile-add', ...patch }); else dispatch({ type: 'profile-edit', id: editProfile.id, patch }); setEditProfile(null); }} />}
      {delProfile && <Modal title={`Remove ${delProfile.name}?`} onClose={() => setDelProfile(null)} actions={<><button className="btn ghost" onClick={() => setDelProfile(null)}>No</button><button className="btn danger" onClick={() => { dispatch({ type: 'profile-delete', id: delProfile.id }); setDelProfile(null); toast('Profile removed', '🗑️'); }}>Yes, remove</button></>}><p>{delProfile.name}'s scores, progress and stickers will be deleted from this device. This cannot be undone.</p></Modal>}
      {wipe && <Modal title="Delete my content?" onClose={() => setWipe(false)} actions={<><button className="btn ghost" onClick={() => setWipe(false)}>No</button><button className="btn danger" onClick={() => { dispatch({ type: 'wipe-custom' }); setWipe(false); toast('Content deleted', '🗑️'); }}>Yes, delete</button></>}><p>All lessons you uploaded and everything you made in the Studio will be removed. Scores and stickers are not touched.</p></Modal>}
    </>
  );
}

function ProfileEditor({ value, onClose, onSave }) {
  const isNew = value === 'new';
  const [name, setName] = useState(isNew ? '' : value.name);
  const [avatar, setAvatar] = useState(isNew ? AVATARS[Math.floor(Math.random() * AVATARS.length)] : value.avatar);
  const [gradeKey, setGradeKey] = useState(isNew ? 'G3' : value.gradeKey);
  const save = () => onSave({ name: name.trim() || 'Explorer', avatar, gradeKey });
  return (
    <Modal title={isNew ? 'Add a child' : `Edit ${value.name}`} onClose={onClose} actions={<><button className="btn ghost" onClick={onClose}>Cancel</button><button className="btn" onClick={save}>{isNew ? 'Add' : 'Save'}</button></>}>
      <label className="f">Name<input value={name} maxLength={18} autoFocus onChange={(e) => setName(e.target.value)} /></label>
      <label className="f">Grade<select value={gradeKey} onChange={(e) => setGradeKey(e.target.value)}>{GRADES.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}</select></label>
      <div><div className="tiny muted" style={{ fontWeight: 800, marginBottom: 6 }}>Buddy</div>
        <div className="row wrap gap8">{AVATARS.map((a) => <button key={a} className={`iconbtn ${avatar === a ? 'on' : ''}`} style={{ fontSize: 24, width: 52, height: 52 }} onClick={() => setAvatar(a)} aria-label={`Buddy ${a}`}>{a}</button>)}</div></div>
    </Modal>
  );
}
