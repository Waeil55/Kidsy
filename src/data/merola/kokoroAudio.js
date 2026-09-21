/**
 * Kokoro AI Audio Engine for Merola's Lab
 * Pure AI audio integration using pre-generated Kokoro-82M human voice files.
 * Machine SpeechSynthesis (robotic voices) has been completely removed.
 */
(function() {
    let manifest = new Map();
    let textToHash = new Map();
    let currentAudio = null;
    let audioBaseUrl = '/public/audio/';

    // MD5 helper for hash lookup
    function md5(string) {
        function md5cycle(x, k) {
            var a = x[0], b = x[1], c = x[2], d = x[3];
            a = ff(a, b, c, d, k[0], 7, -680876936);
            d = ff(d, a, b, c, k[1], 12, -389564586);
            c = ff(c, d, a, b, k[2], 17, 606105819);
            b = ff(b, c, d, a, k[3], 22, -1044525330);
            a = ff(a, b, c, d, k[4], 7, -176418897);
            d = ff(d, a, b, c, k[5], 12, 1200080426);
            c = ff(c, d, a, b, k[6], 17, -1473231341);
            b = ff(b, c, d, a, k[7], 22, -45705983);
            a = ff(a, b, c, d, k[8], 7, 1770035416);
            d = ff(d, a, b, c, k[9], 12, -1958414417);
            c = ff(c, d, a, b, k[10], 17, -42063);
            b = ff(b, c, d, a, k[11], 22, -1990404162);
            a = ff(a, b, c, d, k[12], 7, 1804603682);
            d = ff(d, a, b, c, k[13], 12, -40341101);
            c = ff(c, d, a, b, k[14], 17, -1502002290);
            b = ff(b, c, d, a, k[15], 22, 1236535329);
            a = gg(a, b, c, d, k[1], 5, -165796510);
            d = gg(d, a, b, c, k[6], 9, -1069501632);
            c = gg(c, d, a, b, k[11], 14, 643717713);
            b = gg(b, c, d, a, k[0], 20, -373897302);
            a = gg(a, b, c, d, k[5], 5, -701558691);
            d = gg(d, a, b, c, k[10], 9, 38016083);
            c = gg(c, d, a, b, k[15], 14, -660478335);
            b = gg(b, c, d, a, k[4], 20, -405537848);
            a = gg(a, b, c, d, k[9], 5, 568446438);
            d = gg(d, a, b, c, k[14], 9, -1019803690);
            c = gg(c, d, a, b, k[3], 14, -187363961);
            b = gg(b, c, d, a, k[8], 20, 1163531501);
            a = gg(a, b, c, d, k[13], 5, -1444681467);
            d = gg(d, a, b, c, k[2], 9, -51403784);
            c = gg(c, d, a, b, k[7], 14, 1735328473);
            b = gg(b, c, d, a, k[12], 20, -1926607734);
            a = hh(a, b, c, d, k[5], 4, -378558);
            d = hh(d, a, b, c, k[8], 11, -2022574463);
            c = hh(c, d, a, b, k[11], 16, 1839030562);
            b = hh(b, c, d, a, k[14], 23, -35309556);
            a = hh(a, b, c, d, k[1], 4, -1530992060);
            d = hh(d, a, b, c, k[4], 11, 1272893353);
            c = hh(c, d, a, b, k[7], 16, -155497632);
            b = hh(b, c, d, a, k[10], 23, -1094730640);
            a = hh(a, b, c, d, k[13], 4, 681279174);
            d = hh(d, a, b, c, k[0], 11, -358537222);
            c = hh(c, d, a, b, k[3], 16, -722521979);
            b = hh(b, c, d, a, k[6], 23, 76029189);
            a = hh(a, b, c, d, k[9], 4, -640364487);
            d = hh(d, a, b, c, k[12], 11, -421815835);
            c = hh(c, d, a, b, k[15], 16, 530742520);
            b = hh(b, c, d, a, k[2], 23, -995338651);
            a = ii(a, b, c, d, k[0], 6, -198630844);
            d = ii(d, a, b, c, k[7], 10, 1126891415);
            c = ii(c, d, a, b, k[14], 15, -1416354905);
            b = ii(b, c, d, a, k[5], 21, -57434055);
            a = ii(a, b, c, d, k[12], 6, 1700485571);
            d = ii(d, a, b, c, k[3], 10, -1894986606);
            c = ii(c, d, a, b, k[10], 15, -1051523);
            b = ii(b, c, d, a, k[1], 21, -2054922799);
            a = ii(a, b, c, d, k[8], 6, 1873313359);
            d = ii(d, a, b, c, k[15], 10, -30611744);
            c = ii(c, d, a, b, k[6], 15, -1560198380);
            b = ii(b, c, d, a, k[13], 21, 1309151649);
            a = ii(a, b, c, d, k[4], 6, -145523070);
            d = ii(d, a, b, c, k[11], 10, -1120210379);
            c = ii(c, d, a, b, k[2], 15, 718787259);
            b = ii(b, c, d, a, k[9], 21, -343485551);
            x[0] = add32(a, x[0]);
            x[1] = add32(b, x[1]);
            x[2] = add32(c, x[2]);
            x[3] = add32(d, x[3]);
        }
        function cmn(q, a, b, x, s, t) {
            a = add32(add32(a, q), add32(x, t));
            return add32((a << s) | (a >>> (32 - s)), b);
        }
        function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
        function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
        function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
        function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
        function md51(s) {
            var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
            for (i = 64; i <= n; i += 64) md5cycle(state, md5blk(s.substring(i - 64, i)));
            s = s.substring(i - 64);
            var tail = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
            tail[i >> 2] |= 0x80 << ((i % 4) << 3);
            if (i > 55) { md5cycle(state, tail); for (i = 0; i < 16; i++) tail[i] = 0; }
            tail[14] = n * 8;
            md5cycle(state, tail);
            return state;
        }
        function md5blk(s) {
            var md5blks = [], i;
            for (i = 0; i < 64; i += 4) md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
            return md5blks;
        }
        var hex_chr = '0123456789abcdef'.split('');
        function rhex(n) {
            var s = '', j = 0;
            for (; j < 4; j++) s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
            return s;
        }
        function hex(x) {
            for (var i = 0; i < x.length; i++) x[i] = rhex(x[i]);
            return x.join('');
        }
        function add32(a, b) { return (a + b) & 0xFFFFFFFF; }
        function utf8Encode(str) { return unescape(encodeURIComponent(str)); }
        return hex(md51(utf8Encode(string)));
    }

    function simpleHash(text) {
        return md5(text).slice(0, 12);
    }

    function normalizeText(text) {
        if (!text || typeof text !== 'string') return '';
        return text
            .toLowerCase()
            .replace(/<[^>]*>?/gm, '')
            .replace(/\*+/g, '')
            .replace(/_+/g, '')
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Load both texts.json and manifest.json to cover all 4,000+ Kokoro AI voice entries
    function initDatabase() {
        const tryFetch = (url) => fetch(url).then(res => res.ok ? res.json() : Promise.reject());

        // 1. Fetch texts.json (2,996 Kokoro AI entries)
        const textPaths = ['/texts.json', 'texts.json'];
        const tryNextText = (idx) => {
            if (idx >= textPaths.length) return;
            tryFetch(textPaths[idx])
                .then(data => {
                    for (const [hash, text] of Object.entries(data)) {
                        if (text && typeof text === 'string') {
                            const norm = normalizeText(text);
                            if (norm) textToHash.set(norm, hash);
                        }
                    }
                    console.log('⚡ Kokoro AI texts.json loaded: ' + textToHash.size + ' entries.');
                })
                .catch(() => tryNextText(idx + 1));
        };
        tryNextText(0);

        // 2. Fetch manifest.json (1,071 Kokoro AI entries)
        const manifestPaths = ['/public/audio/manifest.json', 'public/audio/manifest.json', '/audio/manifest.json', 'audio/manifest.json'];
        const tryNextManifest = (idx) => {
            if (idx >= manifestPaths.length) return;
            const path = manifestPaths[idx];
            tryFetch(path)
                .then(data => {
                    audioBaseUrl = path.replace('manifest.json', '');
                    for (const [hash, info] of Object.entries(data)) {
                        manifest.set(hash, info);
                        if (info && info.text) {
                            const norm = normalizeText(info.text);
                            if (norm) textToHash.set(norm, hash);
                        }
                    }
                    console.log('⚡ Kokoro AI manifest loaded from ' + audioBaseUrl + ' (Total entries: ' + textToHash.size + ')');
                })
                .catch(() => tryNextManifest(idx + 1));
        };
        tryNextManifest(0);
    }

    function stopAudio() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }
    }

    function findAudioHash(cleanText, rawText) {
        if (!cleanText) return null;

        // 1. Direct MD5 hash lookup
        const directHash = simpleHash(cleanText);
        if (manifest && manifest.has(directHash)) return directHash;

        // 2. Exact normalized text lookup
        const norm = normalizeText(cleanText);
        if (textToHash && textToHash.has(norm)) return textToHash.get(norm);

        // 3. Extract target word from HTML tags like <u>hot</u> or <b>word</b>
        if (rawText && typeof rawText === 'string') {
            const uMatch = rawText.match(/<u>(.*?)<\/u>/i) || rawText.match(/<b>(.*?)<\/b>/i);
            if (uMatch && uMatch[1]) {
                const targetNorm = normalizeText(uMatch[1]);
                if (textToHash.has(targetNorm)) return textToHash.get(targetNorm);
            }
        }

        // 4. Sub-word lookup for key vocabulary words
        const words = norm.split(' ').filter(w => w.length > 2);
        for (const w of words) {
            if (textToHash.has(w)) return textToHash.get(w);
        }

        return null;
    }

    let audioCache = new Map();
    let speechSpeed = 1.0;

    function setSpeed(speed) {
        speechSpeed = Math.max(0.5, Math.min(2.0, parseFloat(speed) || 1.0));
        console.log('⚡ Kokoro AI speech speed set to:', speechSpeed + 'x');
    }

    function createAudioInstance(hash) {
        if (audioCache.has(hash)) {
            const cached = audioCache.get(hash);
            cached.currentTime = 0;
            return cached;
        }
        const primaryPath = audioBaseUrl + hash + '.wav';
        const audio = new Audio(primaryPath);
        audioCache.set(hash, audio);
        return audio;
    }

    function speakKokoro(text, onEnd = null, onWordHighlight = null) {
        stopAudio();

        if (!text) return;
        const clean = text.replace(/<[^>]*>?/gm, '').trim();
        if (!clean) return;

        const hash = findAudioHash(clean, text);

        if (hash) {
            const audio = createAudioInstance(hash);
            currentAudio = audio;
            audio.playbackRate = speechSpeed;
            if ('preservesPitch' in audio) audio.preservesPitch = true;

            if (onEnd) {
                audio.onended = () => {
                    onEnd();
                    audio.onended = null;
                };
            }

            // Word-by-word highlight timer estimation during speech playback
            if (onWordHighlight) {
                const words = clean.split(/\s+/);
                audio.onloadedmetadata = () => {
                    const duration = audio.duration || 2.0;
                    const timePerWord = (duration / words.length) * 1000;
                    words.forEach((w, idx) => {
                        setTimeout(() => {
                            if (currentAudio === audio) onWordHighlight(idx, w);
                        }, idx * timePerWord);
                    });
                };
                if (audio.duration) {
                    const duration = audio.duration;
                    const timePerWord = (duration / words.length) * 1000;
                    words.forEach((w, idx) => {
                        setTimeout(() => {
                            if (currentAudio === audio) onWordHighlight(idx, w);
                        }, idx * timePerWord);
                    });
                }
            }

            audio.play().catch(() => {
                const altPath = (audioBaseUrl.includes('public') ? '/audio/' : '/public/audio/') + hash + '.wav';
                const altAudio = new Audio(altPath);
                currentAudio = altAudio;
                altAudio.playbackRate = speechSpeed;
                if (onEnd) altAudio.onended = onEnd;
                altAudio.play().catch((err) => {
                    console.warn('Could not play Kokoro AI audio file:', err);
                });
            });
        } else {
            // Sequential Word Playback Fallback for multi-word sentences/passages
            const rawWords = clean.split(/\s+/);
            if (rawWords.length > 0) {
                let currentWordIndex = 0;

                const playNextWord = () => {
                    if (currentWordIndex >= rawWords.length) {
                        if (onEnd) onEnd();
                        return;
                    }
                    const word = rawWords[currentWordIndex];
                    const cleanW = word.replace(/[^a-zA-Z0-9]/g, '');
                    const wordHash = findAudioHash(cleanW, word);
                    
                    if (onWordHighlight) onWordHighlight(currentWordIndex, word);

                    if (wordHash) {
                        const wordAudio = createAudioInstance(wordHash);
                        currentAudio = wordAudio;
                        wordAudio.playbackRate = speechSpeed;
                        wordAudio.onended = () => {
                            wordAudio.onended = null;
                            currentWordIndex++;
                            setTimeout(playNextWord, 100);
                        };
                        wordAudio.play().catch(() => {
                            currentWordIndex++;
                            setTimeout(playNextWord, 200);
                        });
                    } else {
                        currentWordIndex++;
                        setTimeout(playNextWord, 350);
                    }
                };

                playNextWord();
            } else {
                if (onEnd) setTimeout(onEnd, 300);
            }
        }
    }

    function pauseAudio() {
        if (currentAudio) currentAudio.pause();
    }

    function resumeAudio() {
        if (currentAudio) currentAudio.play();
    }

    function preloadAudio(textArray) {
        if (!Array.isArray(textArray)) return;
        textArray.forEach(t => {
            const hash = findAudioHash(t, t);
            if (hash && !audioCache.has(hash)) {
                createAudioInstance(hash);
            }
        });
    }

    // Initialize database on script load
    initDatabase();

    // Export global functions (SpeechSynthesis machine speakers completely eliminated)
    window.speak = speakKokoro;
    window.stopAudio = stopAudio;
    window.KokoroAudio = {
        speak: speakKokoro,
        speakWord: (word, onEnd) => speakKokoro(word, onEnd),
        speakPhrase: (phrase, onEnd) => speakKokoro(phrase, onEnd),
        speakSentence: (sentence, onEnd) => speakKokoro(sentence, onEnd),
        speakParagraph: (paragraph, onWordHighlight, onEnd) => speakKokoro(paragraph, onEnd, onWordHighlight),
        speakStory: (passage, onWordHighlight, onEnd) => speakKokoro(passage, onEnd, onWordHighlight),
        stop: stopAudio,
        pause: pauseAudio,
        resume: resumeAudio,
        preloadAudio: preloadAudio,
        cacheAudio: (text) => { const h = findAudioHash(text, text); if (h) createAudioInstance(h); },
        setSpeed: setSpeed,
        getSpeed: () => speechSpeed,
        setVoice: (voice) => console.log('⚡ Kokoro AI Voice Profile active: af_heart'),
        hasAudio: (text) => !!findAudioHash(text, text)
    };

})();


