// Provider Configurations
const PROVIDER_PRESETS = {
  mistral: {
    name: 'Mistral AI',
    baseUrl: 'https://api.mistral.ai/v1/chat/completions',
    models: [
      'ministral-3b-2512',
      'ministral-8b-2512',
      'ministral-14b-2512',
      'mistral-large-2512',
      'mistral-small-2603'
    ]
  },
  gemini: {
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    model: 'gemini-3.5-flash'
  },
  groq: {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
    models: [
      'openai/gpt-oss-120b',
      'openai/gpt-oss-20b',
      'llama-3.1-8b-instant',
      'llama-3.3-70b-versatile'
    ]
  }
};

// Languages each provider supports (Deepgram: 5 for STT and TTS; ElevenLabs and Cartesia: 32 for both)
const SUPPORTED_LANGUAGES = {
  deepgram: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish (Español)' },
    { code: 'fr', name: 'French (Français)' },
    { code: 'de', name: 'German (Deutsch)' },
    { code: 'it', name: 'Italian (Italiano)' }
  ],
  elevenlabs: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish (Español)' },
    { code: 'fr', name: 'French (Français)' },
    { code: 'de', name: 'German (Deutsch)' },
    { code: 'it', name: 'Italian (Italiano)' },
    { code: 'ja', name: 'Japanese (日本語)' },
    { code: 'zh', name: 'Mandarin (中文)' },
    { code: 'ko', name: 'Korean (한국어)' },
    { code: 'pt', name: 'Portuguese (Português)' },
    { code: 'nl', name: 'Dutch (Nederlands)' },
    { code: 'hi', name: 'Hindi (हिन्दी)' },
    { code: 'tr', name: 'Turkish (Türkçe)' },
    { code: 'pl', name: 'Polish (Polski)' },
    { code: 'sv', name: 'Swedish (Svenska)' },
    { code: 'bg', name: 'Bulgarian (Български)' },
    { code: 'ro', name: 'Romanian (Română)' },
    { code: 'ar', name: 'Arabic (العربية)' },
    { code: 'cs', name: 'Czech (Čeština)' },
    { code: 'el', name: 'Greek (Ελληνικά)' },
    { code: 'fi', name: 'Finnish (Suomi)' },
    { code: 'hr', name: 'Croatian (Hrvatski)' },
    { code: 'ms', name: 'Malay (Bahasa Melayu)' },
    { code: 'sk', name: 'Slovak (Slovenčina)' },
    { code: 'da', name: 'Danish (Dansk)' },
    { code: 'ta', name: 'Tamil (தமிழ்)' },
    { code: 'uk', name: 'Ukrainian (Українська)' },
    { code: 'ru', name: 'Russian (Русский)' },
    { code: 'hu', name: 'Hungarian (Magyar)' },
    { code: 'no', name: 'Norwegian (Norsk)' },
    { code: 'vi', name: 'Vietnamese (Tiếng Việt)' },
    { code: 'id', name: 'Indonesian (Bahasa Indonesia)' },
    { code: 'tl', name: 'Tagalog / Filipino' }
  ]
};

// Deepgram Working Female Voice Catalog (Luna set as default for English)
const DEEPGRAM_VOICES = {
  en: [
    { id: 'dg:aura-luna-en', name: 'Luna (Basic, Fast)' },
    { id: 'dg:aura-asteria-en', name: 'Asteria (Basic, Fast)' },
    { id: 'dg:aura-2-thalia-en', name: 'Thalia (Expressive, Slow)' },
    { id: 'dg:flux-haley-en', name: 'Haley (Conversational, Slow)' }
  ],
  es: [{ id: 'dg:aura-2-carina-es', name: 'Carina (Aura 2 - Spanish)' }],
  fr: [{ id: 'dg:aura-2-agathe-fr', name: 'Agathe (Aura 2 - French)' }],
  de: [{ id: 'dg:aura-2-lara-de', name: 'Lara (Aura 2 - German)' }],
  it: [{ id: 'dg:aura-2-livia-it', name: 'Livia (Aura 2 - Italian)' }]
};

// ElevenLabs Universal Multilingual Voices Formatted with Fast Qualifiers
const ELEVENLABS_FEMALE_VOICES = [
  { id: 'xi:EXAVITQu4vr4xnSDxMaL', name: 'Sarah (Soft, Fast)' },
  { id: 'xi:Xb7hH8MSUJpSbSDYk0k2', name: 'Alice (Confident, Fast)' },
  { id: 'xi:cgSgspJ2msm6clMCkdW9', name: 'Jessica (Playful, Fast)' },
  { id: 'xi:pFZP5JQG7iQjIQuC4Bku', name: 'Lily (Warm, Fast)' }
];

// Cartesia: native female voices for the chat language are loaded with the user's key; until then these
// recommended voices are used (they speak every language, but keep their own accent)
const CARTESIA_API = 'https://api.cartesia.ai';
const CARTESIA_VERSION = '2026-08-14';
const CARTESIA_DEFAULT_VOICES = [
  { id: 'ct:db6b0ed5-d5d3-463d-ae85-518a07d3c2b4', name: 'Skylar' },
  { id: 'ct:9626c31c-bec5-4cca-baa8-f8ba9e84c8bc', name: 'Jacqueline' },
  { id: 'ct:62ae83ad-4f6a-430b-af41-a9bede9286ca', name: 'Gemma' }
];
const cartesiaVoiceCache = {};

function cartesiaHeaders(key) {
  return { 'Authorization': `Bearer ${key}`, 'Cartesia-Version': CARTESIA_VERSION };
}

// Speech providers in fallback order, and their display names
const SPEECH_PROVIDERS = ['deepgram', 'elevenlabs', 'cartesia'];
const PROVIDER_NAMES = { deepgram: 'Deepgram', elevenlabs: 'ElevenLabs', cartesia: 'Cartesia' };

SUPPORTED_LANGUAGES.cartesia = SUPPORTED_LANGUAGES.elevenlabs;

let currentAudio = null;
let pipelineAbortController = null;
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let conversationHistory = [];

const DEFAULT_SYSTEM_PROMPT = `You are a friend in a real-time spoken voice conversation. The user has a speech impediment, which may occur through repeating words, stretching out a sound longer than needed, or difficulty getting sounds and words out. 
Repetitions are when a person repeats the first sound or syllable of a word at least three times more than is needed. It may sound like this: “I w-w-w-want a snack” or “Put, put, put, put that away.”
Prolongations in stuttering are when a person holds out a sound for too long, to where the speech sounds abnormal. It may sound like: “Ssssssssee the airplane?” or “Wwwwwwhere are you?”
Blocks are when a person is unable to move their mouth and use their voice to continue speaking. No voice or sound comes out during a block. Here’s an example of a block: “I am...............so tired.” or “I am. so. tired.”
There can also be a combination of any of these modes. With three modes (R = repetition, P = prolongation, B = block), the combinations come out as follows.
R + P: "I w-w-w-want the ssssssnack." The first word repeats and the second is stretched.
R + B: "Put, put, put............... that away." or "Put, put, put. That away." The word repeats, then the speaker gets stuck with no sound.
P + B: "Wwwwwwhere............... are you?" or "Wwwwwwhere. Are you?" The sound is held, then the speaker locks up.
R + P + B: "I w-w-w-want............... ssssssee the airplane." or "I w-w-w-want. Ssssssee the airplane." It contains a repetition, a block, and a prolongation.
Listen fully, never complete the users’ thoughts, analyze their prompts for repetitions, prolongations and blocks, and reply naturally.
Formatting Rules:
- Always respond in the language the user had last used.
- You must speak clearly and fluently. Do not simulate stuttering, speech blocks, repeated syllables, and elongated sounds (e.g., "s-s-sip" or "sssssip") in your own responses.
- Absolutely no tables, no bulleted lists, no numbered lists, no markdown, no em or short dashes (—), no hyphens, no emojis, no asterisks, and no stage directions.
- You're chatting with a friend, not writing an essay. Reply the way a relaxed, smart person would text or talk.
- Keep replies short by default: a few sentences, and only go longer if I ask for detail.
- Use contractions and everyday words. Skip stiff phrases like "certainly," "it's worth noting," "in conclusion," or "I hope this helps."
- Don't open by restating my question or praising it, and don't end with a summary or a list of follow-up offers. Just answer.
- Don't add disclaimers or caveats unless they really matter.
- Match my tone. If I'm joking around, joke back. If I'm serious, be straightforward.
- Ask a quick question back if something's unclear, instead of guessing at length.`;

// Key Management Helpers
// A key entered for STT is also offered for TTS on the same provider (and vice versa)
const SHARED_KEY_NAMES = { deepgram: 'dg_key', elevenlabs: 'xi_key', cartesia: 'ct_key' };

function getSavedKey(type, provider) {
  const stored = localStorage.getItem(`${type}_key_${provider}`);
  if (stored) return stored;
  return SHARED_KEY_NAMES[provider] ? localStorage.getItem(SHARED_KEY_NAMES[provider]) || '' : '';
}

function setSavedKey(type, provider, val) {
  const cleanVal = val.trim();
  localStorage.setItem(`${type}_key_${provider}`, cleanVal);
  if (SHARED_KEY_NAMES[provider]) localStorage.setItem(SHARED_KEY_NAMES[provider], cleanVal);
}

// Master Safe Startup Sequence
document.addEventListener('DOMContentLoaded', () => {
  const sttProvider = localStorage.getItem('stt_provider') || 'deepgram';
  const ttsProvider = localStorage.getItem('tts_provider') || 'deepgram';
  const llmProvider = localStorage.getItem('llm_provider') || 'mistral';

  document.getElementById('sttProvider').value = sttProvider;
  document.getElementById('ttsProvider').value = ttsProvider;
  document.getElementById('llmProvider').value = llmProvider;

  document.getElementById('systemPrompt').value = localStorage.getItem('system_prompt') || DEFAULT_SYSTEM_PROMPT;

  updateSttKeyField();
  updateTtsKeyField();
  updateLlmKeyField();
  populateLanguages();

  checkSttCredits();
  checkTtsCredits();
  checkLlmCredits();
  populateUiLanguages();
  applyUILanguage();

  // UI event wiring (kept out of HTML attributes so the CSP can forbid inline scripts)
  const on = (id, event, handler) => document.getElementById(id).addEventListener(event, handler);
  on('uiLanguage', 'change', applyUILanguage);
  on('sttProvider', 'change', onSttProviderChange);
  on('sttKey', 'input', onSttKeyChange);
  on('ttsProvider', 'change', onTtsEngineChange);
  on('ttsKey', 'input', onTtsKeyChange);
  on('selectedLanguage', 'change', onLanguageChange);
  on('ttsVoice', 'change', saveSettings);
  on('llmProvider', 'change', onLlmProviderChange);
  on('llmKey', 'input', onLlmKeyChange);
  on('systemPrompt', 'change', saveSettings);
  on('statusCard', 'click', handleStatusCardClick);
  on('btn-clear', 'click', (event) => { event.stopPropagation(); clearMemory(); });
  on('debugToggle', 'change', toggleDebug);
  on('btn-copy-debug', 'click', copyDebugText);

  // Global Keyboard Hotkeys
  document.addEventListener('keydown', async (event) => {
    if (event.code === 'Escape') {
      clearMemory();
      return;
    }

    const isTyping = event.target.tagName === 'TEXTAREA' || 
                     (event.target.tagName === 'INPUT' && ['text', 'password'].includes(event.target.type));

    if (event.code === 'Space' && !isTyping) {
      event.preventDefault();
      stopAssistant();
      if (!isRecording) startRecording();
    }

    if (event.code === 'Enter' && isRecording && !isTyping) {
      event.preventDefault();
      stopAndSendRecording();
    }
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => console.error('SW Registration failed:', err));
  });
}

function updateSttKeyField() {
  const provider = document.getElementById('sttProvider').value;
  document.getElementById('sttKey').value = getSavedKey('stt', provider);
  const t = typeof UI_TRANSLATIONS !== 'undefined' ? (UI_TRANSLATIONS[document.getElementById('uiLanguage').value] || UI_TRANSLATIONS.en) : {pasteKey: 'Paste {provider} Key'};
  document.getElementById('sttKey').placeholder = t.pasteKey.replace('{provider}', PROVIDER_NAMES[provider]);
}

function updateTtsKeyField() {
  const provider = document.getElementById('ttsProvider').value;
  document.getElementById('ttsKey').value = getSavedKey('tts', provider);
  const t = typeof UI_TRANSLATIONS !== 'undefined' ? (UI_TRANSLATIONS[document.getElementById('uiLanguage').value] || UI_TRANSLATIONS.en) : {pasteKey: 'Paste {provider} Key'};
  document.getElementById('ttsKey').placeholder = t.pasteKey.replace('{provider}', PROVIDER_NAMES[provider]);
}

function updateLlmKeyField() {
  const provider = document.getElementById('llmProvider').value;
  const preset = PROVIDER_PRESETS[provider];
  document.getElementById('llmKey').value = localStorage.getItem(`llm_key_${provider}`) || '';
  const t = typeof UI_TRANSLATIONS !== 'undefined' ? (UI_TRANSLATIONS[document.getElementById('uiLanguage').value] || UI_TRANSLATIONS.en) : {pasteKey: 'Paste {provider} Key'};
  document.getElementById('llmKey').placeholder = t.pasteKey.replace('{provider}', preset.name);
}

function onSttProviderChange() {
  const provider = document.getElementById('sttProvider').value;
  localStorage.setItem('stt_provider', provider);
  updateSttKeyField();
  populateLanguages();
  checkSttCredits();
}

function onTtsEngineChange() {
  const provider = document.getElementById('ttsProvider').value;
  localStorage.setItem('tts_provider', provider);
  updateTtsKeyField();
  populateLanguages();
  checkTtsCredits();
}

function onLlmProviderChange() {
  const provider = document.getElementById('llmProvider').value;
  localStorage.setItem('llm_provider', provider);
  updateLlmKeyField();
  checkLlmCredits();
}

function onSttKeyChange() {
  const provider = document.getElementById('sttProvider').value;
  const val = document.getElementById('sttKey').value;
  setSavedKey('stt', provider, val);
  scheduleKeyCheck('stt', checkSttCredits);
}

function onTtsKeyChange() {
  const provider = document.getElementById('ttsProvider').value;
  const val = document.getElementById('ttsKey').value;
  setSavedKey('tts', provider, val);
  scheduleKeyCheck('tts', () => { checkTtsCredits(); populateVoices(); });
}

function onLlmKeyChange() {
  const provider = document.getElementById('llmProvider').value;
  const val = document.getElementById('llmKey').value;
  localStorage.setItem(`llm_key_${provider}`, val.trim());
  scheduleKeyCheck('llm', checkLlmCredits);
}

function providerSupports(provider, lang) {
  return (SUPPORTED_LANGUAGES[provider] || SUPPORTED_LANGUAGES.deepgram).some(l => l.code === lang);
}

// Prefer the provider the other side already uses, then one with a saved key, then the first that fits
function pickProviderFor(type, lang, otherProvider) {
  const candidates = SPEECH_PROVIDERS.filter(p => providerSupports(p, lang));
  return candidates.find(p => p === otherProvider)
    || candidates.find(p => getSavedKey(type, p))
    || candidates[0];
}

function onLanguageChange() {
  const lang = document.getElementById('selectedLanguage').value;
  localStorage.setItem('selected_language', lang);

  // Picking a language a provider can't handle switches that side to one that can
  // (set both selects before running either handler, so the language isn't reset in between)
  const stt = document.getElementById('sttProvider');
  const tts = document.getElementById('ttsProvider');
  const switchStt = !providerSupports(stt.value, lang);
  const switchTts = !providerSupports(tts.value, lang);
  if (switchStt) stt.value = pickProviderFor('stt', lang, tts.value);
  if (switchTts) tts.value = pickProviderFor('tts', lang, stt.value);
  if (switchStt) onSttProviderChange();
  if (switchTts) onTtsEngineChange();

  populateVoices();
  saveSettings();
}

function populateLanguages() {
  const langSelect = document.getElementById('selectedLanguage');
  const savedLang = localStorage.getItem('selected_language') || 'en';

  langSelect.innerHTML = '';

  // Always list every language; ones not every provider can handle are tagged with the providers that can
  const addOption = (value, text, disabled = false) => {
    const opt = document.createElement('option');
    opt.value = value;
    opt.innerText = text;
    opt.disabled = disabled;
    langSelect.appendChild(opt);
  };
  const providersFor = code => SPEECH_PROVIDERS.filter(p => providerSupports(p, code));
  const [universal, partial] = [true, false].map(all =>
    SUPPORTED_LANGUAGES.elevenlabs.filter(l => (providersFor(l.code).length === SPEECH_PROVIDERS.length) === all));
  universal.forEach(l => addOption(l.code, l.name));
  addOption('', '──────────', true);
  partial.forEach(l => addOption(l.code, `${l.name} · ${providersFor(l.code).map(p => PROVIDER_NAMES[p]).join(', ')}`));

  // Switching a provider to one that can't handle the selected language falls back to English
  const sttP = document.getElementById('sttProvider').value;
  const ttsP = document.getElementById('ttsProvider').value;
  const lang = providerSupports(sttP, savedLang) && providerSupports(ttsP, savedLang) ? savedLang : 'en';
  langSelect.value = lang;
  localStorage.setItem('selected_language', lang);

  populateVoices();
}

function populateVoices() {
  const provider = document.getElementById('ttsProvider').value;
  const lang = document.getElementById('selectedLanguage').value;
  const voiceSelect = document.getElementById('ttsVoice');
  
  voiceSelect.innerHTML = '';
  let voices = [];

  if (provider === 'elevenlabs') {
    voices = ELEVENLABS_FEMALE_VOICES;
  } else if (provider === 'cartesia') {
    const key = document.getElementById('ttsKey').value.trim();
    const cached = cartesiaVoiceCache[`${key}|${lang}`];
    voices = cached && cached.length ? cached : CARTESIA_DEFAULT_VOICES;
    if (key && !cached) {
      loadCartesiaVoices(key, lang).then(() => {
        const still = document.getElementById('ttsProvider').value === 'cartesia'
          && document.getElementById('selectedLanguage').value === lang
          && document.getElementById('ttsKey').value.trim() === key;
        if (still) populateVoices();
      });
    }
  } else {
    voices = DEEPGRAM_VOICES[lang] || DEEPGRAM_VOICES['en'];
  }

  voices.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.id;
    const t = typeof UI_TRANSLATIONS !== 'undefined' ? (UI_TRANSLATIONS[document.getElementById('uiLanguage').value] || UI_TRANSLATIONS.en) : {};
    opt.innerText = v.name.replace('Basic', t.basic||'Basic').replace('Fast', t.fast||'Fast').replace('Expressive', t.expressive||'Expressive').replace('Slow', t.slow||'Slow').replace('Conversational', t.conversational||'Conversational').replace('Soft', t.soft||'Soft').replace('Confident', t.confident||'Confident').replace('Playful', t.playful||'Playful').replace('Warm', t.warm||'Warm');
    voiceSelect.appendChild(opt);
  });

  const savedVoice = localStorage.getItem('tts_voice');
  if (savedVoice && Array.from(voiceSelect.options).some(o => o.value === savedVoice)) {
    voiceSelect.value = savedVoice;
  } else if (voiceSelect.options.length > 0) {
    voiceSelect.selectedIndex = 0;
  }
}

// Native female voices for a language; an empty list (e.g. bad key) falls back to the defaults
async function loadCartesiaVoices(key, lang) {
  const cacheKey = `${key}|${lang}`;
  try {
    const res = await fetch(`${CARTESIA_API}/voices?language=${encodeURIComponent(lang)}&gender=feminine&limit=6`, { headers: cartesiaHeaders(key) });
    const data = res.ok ? (await res.json()).data || [] : [];
    cartesiaVoiceCache[cacheKey] = data.map(v => ({ id: `ct:${v.id}`, name: v.name }));
  } catch (e) {
    cartesiaVoiceCache[cacheKey] = [];
  }
}

function saveSettings() {
  localStorage.setItem('selected_language', document.getElementById('selectedLanguage').value);
  localStorage.setItem('tts_voice', document.getElementById('ttsVoice').value);
  // Only persist customized instructions, so users on the default keep receiving updates to it;
  // an emptied box goes back to the default instead of leaving the assistant with no instructions
  const promptBox = document.getElementById('systemPrompt');
  if (!promptBox.value.trim()) promptBox.value = DEFAULT_SYSTEM_PROMPT;
  const prompt = promptBox.value;
  if (prompt.trim() && prompt !== DEFAULT_SYSTEM_PROMPT) {
    localStorage.setItem('system_prompt', prompt);
  } else {
    localStorage.removeItem('system_prompt');
  }
}

// ElevenLabs is called directly; if a browser extension blocks api.elevenlabs.io, fall back to
// our pass-through proxy (proxy/worker.js) for the rest of the session
const ELEVENLABS_DIRECT = 'https://api.elevenlabs.io';
const ELEVENLABS_PROXY = 'https://elevenlabs-proxy.keremk.workers.dev';
let elevenLabsBase = ELEVENLABS_DIRECT;

async function elevenLabsFetch(path, init) {
  // Decide per request: concurrent requests may all fail direct before any of them switches the base
  const base = elevenLabsBase;
  try {
    return await fetch(base + path, init);
  } catch (err) {
    if (err.name === 'AbortError' || base === ELEVENLABS_PROXY) throw err;
    console.warn('Direct ElevenLabs request blocked, switching to proxy:', err.message);
    elevenLabsBase = ELEVENLABS_PROXY;
    return fetch(ELEVENLABS_PROXY + path, init);
  }
}

// Credit Probe Implementations
async function checkSttCredits() {
  const provider = document.getElementById('sttProvider').value;
  const key = document.getElementById('sttKey').value.trim();
  await probeKeyCredits(provider, key, document.getElementById('sttCredits'));
}

async function checkTtsCredits() {
  const provider = document.getElementById('ttsProvider').value;
  const key = document.getElementById('ttsKey').value.trim();
  await probeKeyCredits(provider, key, document.getElementById('ttsCredits'));
}

// Wait for typing/pasting to settle before checking a key, so partial keys aren't probed
const keyCheckTimers = {};
function scheduleKeyCheck(name, check) {
  clearTimeout(keyCheckTimers[name]);
  keyCheckTimers[name] = setTimeout(check, 400);
}

// Checks can finish out of order; only the most recent one for a badge may update it
function startBadgeCheck(badge) {
  badge.dataset.check = String(Number(badge.dataset.check || 0) + 1);
  return badge.dataset.check;
}

function setBadge(badge, checkId, state, rem, limit) {
  if (!badge || badge.dataset.check !== checkId) return;
  badge.dataset.state = state;
  if (rem !== undefined) { badge.dataset.rem = rem; badge.dataset.limit = limit; }
  renderBadge(badge);
}

function renderBadge(badge) {
  const t = UI_TRANSLATIONS[document.getElementById('uiLanguage').value] || UI_TRANSLATIONS.en;
  const state = badge.dataset.state;
  if (!state) return;
  badge.style.color = state === 'req' ? '#888' : state === 'nocred' ? '#ff4d4d' : '#00ff66';
  badge.innerText = state === 'req' ? t.reqKey
    : state === 'avail' ? t.credAvail
    : state === 'nocred' ? t.noCred
    : t.credLeft.replace('{rem}', badge.dataset.rem).replace('{limit}', badge.dataset.limit);
}

async function probeKeyCredits(provider, key, badge) {
  const checkId = startBadgeCheck(badge);
  if (!key) return setBadge(badge, checkId, 'req');

  try {
    if (provider === 'elevenlabs') {
      const res = await elevenLabsFetch('/v1/user/subscription', { headers: { 'xi-api-key': key } });
      if (!res.ok) return setBadge(badge, checkId, 'nocred');
      const data = await res.json();
      const remaining = data.character_limit - data.character_count;
      setBadge(badge, checkId, 'limit', remaining.toLocaleString(), data.character_limit.toLocaleString());
    } else if (provider === 'deepgram') {
      // An authenticated request without audio returns 400; a bad key returns 401/403
      const res = await fetch('https://api.deepgram.com/v1/listen', {
        method: 'POST',
        headers: { 'Authorization': `Token ${key}` }
      });
      setBadge(badge, checkId, res.status === 400 || res.ok ? 'avail' : 'nocred');
    } else if (provider === 'cartesia') {
      // Cartesia has no credits endpoint; a successful authenticated request means the key works
      const res = await fetch(`${CARTESIA_API}/voices?limit=1`, { headers: cartesiaHeaders(key) });
      setBadge(badge, checkId, res.ok ? 'avail' : 'nocred');
    }
  } catch (e) {
    setBadge(badge, checkId, 'nocred');
  }
}

async function checkLlmCredits() {
  const provider = document.getElementById('llmProvider').value;
  const llmKey = document.getElementById('llmKey').value.trim();
  const badge = document.getElementById('llmCredits');
  const checkId = startBadgeCheck(badge);
  if (!llmKey) return setBadge(badge, checkId, 'req');

  try {
    let url = '', headers = {};
    if (provider === 'gemini') {
      url = 'https://generativelanguage.googleapis.com/v1beta/models';
      headers = { 'x-goog-api-key': llmKey };
    } else if (provider === 'groq') {
      url = 'https://api.groq.com/openai/v1/models';
      headers = { 'Authorization': `Bearer ${llmKey}` };
    } else if (provider === 'mistral') {
      url = 'https://api.mistral.ai/v1/models';
      headers = { 'Authorization': `Bearer ${llmKey}` };
    }

    const res = await fetch(url, { headers });
    setBadge(badge, checkId, res.ok ? 'avail' : 'nocred');
  } catch (e) {
    setBadge(badge, checkId, 'nocred');
  }
}

function toggleDebug() {
  const panel = document.getElementById('debugPanel');
  const isChecked = document.getElementById('debugToggle').checked;
  panel.style.display = isChecked ? 'block' : 'none';
  if (isChecked) {
    setTimeout(() => {
      panel.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  }
}

function copyDebugText() {
  const rawLog = document.getElementById('geminiRawLog').innerText;
  const statusLog = document.getElementById('debugLogs').innerText;
  const fullText = `--- TIMING LOGS ---\n${statusLog}\n\n${rawLog}`;
  navigator.clipboard.writeText(fullText).then(() => {
    alert("Debug logs copied to clipboard!");
  }).catch(() => {
    alert("Failed to copy logs.");
  });
}

function sanitizeTextForTTS(text) {
  if (!text) return "";
  return text
    .replace(/\|? *[-:]+ *\| *[-:]+ *\|?/g, '')
    .replace(/\|/g, ', ')
    .replace(/[—–]/g, ', ')
    .replace(/[\*\_`\#\~\>\=\+]/g, '')
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F800}-\u{1F8FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function stopAssistant() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (pipelineAbortController) {
    pipelineAbortController.abort();
    pipelineAbortController = null;
  }
}

function clearMemory() {
  stopAssistant();
  conversationHistory = [];
  
  const userBox = document.getElementById('userPromptBox');
  if (userBox) { const t = UI_TRANSLATIONS[document.getElementById('uiLanguage').value] || UI_TRANSLATIONS.en; userBox.innerText = t.userPlaceholder; userBox.classList.add('placeholder'); }

  const assistantBox = document.getElementById('assistantResponseBox');
  if (assistantBox) { const t = UI_TRANSLATIONS[document.getElementById('uiLanguage').value] || UI_TRANSLATIONS.en; assistantBox.innerText = t.aiPlaceholder; assistantBox.classList.add('placeholder'); }

  const logs = document.getElementById('debugLogs');
  if (logs) logs.innerHTML = "Memory cleared.";
  const rawLog = document.getElementById('geminiRawLog');
  if (rawLog) rawLog.innerText = "Memory cleared.";
  updateStatus("statusReady", "statusSubReady", "status-idle");
}

function handleStatusCardClick() {
  const card = document.getElementById('statusCard');
  if (card.classList.contains('status-idle')) {
    stopAssistant();
    if (!isRecording) startRecording();
  } else if (card.classList.contains('status-recording')) {
    if (isRecording) stopAndSendRecording();
  } else if (card.classList.contains('status-speaking')) {
    stopAssistant();
    updateStatus("statusReady", "statusSubReady", "status-idle");
  }
}

async function startRecording() {
  const sttProvider = document.getElementById('sttProvider').value;
  const llmProvider = document.getElementById('llmProvider').value;
  
  const sttKey = document.getElementById('sttKey').value.trim();
  const llmKey = document.getElementById('llmKey').value.trim();

  if (!sttKey || !llmKey) {
    const t = typeof UI_TRANSLATIONS !== "undefined" ? (UI_TRANSLATIONS[document.getElementById("uiLanguage").value] || UI_TRANSLATIONS.en) : {errKeys: "Please enter both Speech-to-Text and AI Engine API Keys."};
    alert(t.errKeys);
    return;
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  let options = {};
  let selectedMime = '';
  if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
    selectedMime = 'audio/webm;codecs=opus';
  } else if (MediaRecorder.isTypeSupported('audio/webm')) {
    selectedMime = 'audio/webm';
  } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
    selectedMime = 'audio/mp4';
  } else if (MediaRecorder.isTypeSupported('audio/aac')) {
    selectedMime = 'audio/aac';
  }
  if (selectedMime) {
    options.mimeType = selectedMime;
    window.currentRecordingMime = selectedMime;
  }

  mediaRecorder = new MediaRecorder(stream, options);
  audioChunks = [];

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) audioChunks.push(event.data);
  };

  mediaRecorder.start();
  isRecording = true;
  updateStatus("statusRec", "statusSubRec", "status-recording");
}

async function streamSelectedLLM(systemPrompt, history, signal) {
  const provider = document.getElementById('llmProvider').value;
  const apiKey = document.getElementById('llmKey').value.trim();
  const preset = PROVIDER_PRESETS[provider];
  const tStart = performance.now();

  if (!apiKey) throw new Error(`Missing API Key for ${preset.name}.`);

  if (provider === 'gemini') {
    const payload = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: history.map(h => ({
        role: h.role === 'assistant' ? 'model' : h.role,
        parts: [{ text: h.content }]
      })),
      generationConfig: { maxOutputTokens: 450, temperature: 0.7, thinkingConfig: { thinkingLevel: "LOW" } }
    };

    const response = await fetch(`${preset.baseUrl}/${preset.model}:streamGenerateContent?alt=sse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify(payload),
      signal
    });

    const status = response.status;
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`[${preset.name}] HTTP ${status}:\n${errText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let text = "", buffer = "", ttft = null, chunkCount = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!ttft) ttft = (performance.now() - tStart).toFixed(0);

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          chunkCount++;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const data = JSON.parse(jsonStr);
            const parts = data.candidates?.[0]?.content?.parts || [];
            for (const p of parts) if (p.text && !p.thought) text += p.text;
          } catch (e) {}
        }
      }
    }
    return { text, model: preset.model, status, ttft, totalTime: (performance.now() - tStart).toFixed(0), chunkCount };
  }

  const modelList = preset.models ? preset.models : [preset.model];
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map(h => ({ role: h.role === 'model' ? 'assistant' : h.role, content: h.content }))
  ];

  let lastError = null;

  for (const targetModel of modelList) {
    try {
      const response = await fetch(preset.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ model: targetModel, messages, stream: true, max_tokens: 450, temperature: 0.7 }),
        signal
      });

      if (response.status === 429) {
        console.warn(`[${preset.name}] ${targetModel} hit 429 rate limit. Falling back to next model...`);
        lastError = new Error(`Rate Limit Exceeded (HTTP 429) on ${targetModel}`);
        continue;
      }

      const status = response.status;
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`[${preset.name}] HTTP ${status}:\n${errText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let text = "", buffer = "", ttft = null, chunkCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!ttft) ttft = (performance.now() - tStart).toFixed(0);

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            chunkCount++;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === '[DONE]') continue;
            try {
              const data = JSON.parse(jsonStr);
              const delta = data.choices?.[0]?.delta?.content || "";
              text += delta;
            } catch (e) {}
          }
        }
      }

      return { text, model: targetModel, status, ttft, totalTime: (performance.now() - tStart).toFixed(0), chunkCount };

    } catch (err) {
      if (err.name === 'AbortError') throw err;
      lastError = err;
      console.warn(`[${preset.name}] ${targetModel} failed: ${err.message}. Trying next model...`);
    }
  }

  throw lastError || new Error(`[${preset.name}] All candidate models failed or exceeded rate limits.`);
}

function stopAndSendRecording() {
  if (!mediaRecorder || mediaRecorder.state === "inactive") return;

  mediaRecorder.stop();
  if (mediaRecorder.stream) {
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
  }

  isRecording = false;
  updateStatus("statusProc", "statusSubProc", "status-processing");

  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: window.currentRecordingMime || 'audio/webm' });
    const sttProvider = document.getElementById('sttProvider').value;
    const ttsProvider = document.getElementById('ttsProvider').value;
    
    const sttKey = document.getElementById('sttKey').value.trim();
    const ttsKey = document.getElementById('ttsKey').value.trim();

    const selectedLang = document.getElementById('selectedLanguage').value || 'en';
    const selectedVoiceTag = document.getElementById('ttsVoice').value;
    const rawSystemPrompt = document.getElementById('systemPrompt').value;

    const effectiveSystemPrompt = `${rawSystemPrompt}\n\nCRITICAL LANGUAGE DIRECTIVE: Detect the language of the user's LATEST message and respond strictly in that exact same language, regardless of any earlier conversation history.`;

    const logs = document.getElementById('debugLogs');
    const rawLogEl = document.getElementById('geminiRawLog');

    const userBox = document.getElementById('userPromptBox');
    const assistantBox = document.getElementById('assistantResponseBox');

    pipelineAbortController = new AbortController();
    const signal = pipelineAbortController.signal;

    try {
      if (logs) logs.innerHTML = `Uploading audio to ${sttProvider.toUpperCase()} STT...`;
      const t0 = performance.now();

      // 1. STT Transcribe
      let userText = "";
      if (sttProvider === 'elevenlabs') {
        const formData = new FormData();
        formData.append('file', audioBlob, 'speech.webm');
        formData.append('model_id', 'scribe_v2');
        if (selectedLang) formData.append('language_code', selectedLang);

        const sttResponse = await elevenLabsFetch('/v1/speech-to-text', {
          method: 'POST',
          headers: { 'xi-api-key': sttKey },
          body: formData,
          signal
        });

        if (!sttResponse.ok) {
          const errText = await sttResponse.text();
          throw new Error(`ElevenLabs STT Failed (HTTP ${sttResponse.status}): ${errText}`);
        }
        const sttData = await sttResponse.json();
        userText = sttData.text || sttData.transcript || "";
        checkSttCredits();
      } else if (sttProvider === 'cartesia') {
        const extension = (window.currentRecordingMime || 'audio/webm').includes('mp4') ? 'mp4' : 'webm';
        const formData = new FormData();
        formData.append('file', audioBlob, `speech.${extension}`);
        formData.append('model', 'ink-whisper');
        formData.append('language', selectedLang);

        const sttResponse = await fetch(`${CARTESIA_API}/stt`, {
          method: 'POST',
          headers: cartesiaHeaders(sttKey),
          body: formData,
          signal
        });

        if (!sttResponse.ok) {
          const errText = await sttResponse.text();
          throw new Error(`Cartesia STT Failed (HTTP ${sttResponse.status}): ${errText}`);
        }
        const sttData = await sttResponse.json();
        userText = sttData.text || "";
      } else {
        const sttResponse = await fetch(`https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&language=${selectedLang}`, {
          method: 'POST',
          headers: { 
            'Authorization': `Token ${sttKey}`, 
            'Content-Type': window.currentRecordingMime || 'audio/webm' 
          },
          body: audioBlob,
          signal
        });

        if (!sttResponse.ok) {
          const sttErr = await sttResponse.text();
          throw new Error(`Deepgram STT Failed (HTTP ${sttResponse.status}): ${sttErr}`);
        }
        const sttData = await sttResponse.json();
        userText = sttData.results?.channels[0]?.alternatives[0]?.transcript || "";
      }

      if (!userText.trim()) throw new Error("No speech detected.");

      if (userBox) {
        userBox.innerText = userText;
        userBox.classList.remove('placeholder');
      }

      const t1 = performance.now();
      const sttTime = (t1 - t0).toFixed(0);
      if (logs) logs.innerHTML = `STT (${sttProvider.toUpperCase()} ${selectedLang.toUpperCase()}): ${sttTime} ms<br>Calling LLM Engine...`;

      conversationHistory.push({ role: "user", content: userText });
      if (conversationHistory.length > 8) conversationHistory = conversationHistory.slice(-8);

      // 2. LLM Stream Call
      const { text: aiText, model: modelUsed, status, ttft, totalTime: llmTime, chunkCount } = await streamSelectedLLM(effectiveSystemPrompt, conversationHistory, signal);

      const cleanAiText = sanitizeTextForTTS(aiText);

      if (assistantBox) {
        assistantBox.innerText = cleanAiText || "I understand.";
        assistantBox.classList.remove('placeholder');
      }

      if (rawLogEl) {
        const providerName = PROVIDER_PRESETS[document.getElementById('llmProvider').value].name;
        rawLogEl.innerText = `[DEBUG INSPECTOR]\nProvider: ${providerName}\nModel ID: ${modelUsed}\nHTTP Status: ${status} OK\nLanguage Directive: Dynamic (Matches Latest User Prompt)\nTime to First Token (TTFT): ${ttft} ms\nTotal LLM Latency: ${llmTime} ms\nVoice Tag: ${selectedVoiceTag}\n\n--- RAW AI RESPONSE ---\n"${aiText}"\n\n--- SANITIZED FOR TTS ---\n"${cleanAiText}"`;
      }

      conversationHistory.push({ role: "assistant", content: aiText });

      if (logs) logs.innerHTML = `STT (${sttProvider.toUpperCase()} ${selectedLang.toUpperCase()}): ${sttTime} ms<br>LLM (${modelUsed}): ${llmTime} ms (TTFT: ${ttft} ms)<br>Generating TTS...`;

      // 3. TTS Generation Dispatcher
      const ttsStart = performance.now();
      let audioBlobResponse;

      if (selectedVoiceTag.startsWith('xi:')) {
        const voiceId = selectedVoiceTag.replace('xi:', '');
        if (!ttsKey) throw new Error("ElevenLabs API Key is required for TTS synthesis.");

        const ttsResponse = await elevenLabsFetch(`/v1/text-to-speech/${voiceId}?output_format=mp3_22050_32`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': ttsKey
          },
          body: JSON.stringify({
            text: cleanAiText || "I understand.",
            model_id: "eleven_flash_v2_5",
            voice_settings: { stability: 0.5, similarity_boost: 0.75 }
          }),
          signal
        });

        if (!ttsResponse.ok) {
          const xiErr = await ttsResponse.text();
          throw new Error(`ElevenLabs TTS Failed (HTTP ${ttsResponse.status}): ${xiErr}`);
        }
        audioBlobResponse = await ttsResponse.blob();
        checkTtsCredits();

      } else if (selectedVoiceTag.startsWith('ct:')) {
        if (!ttsKey) throw new Error("Cartesia API Key is required for TTS synthesis.");

        const ttsResponse = await fetch(`${CARTESIA_API}/tts/bytes`, {
          method: 'POST',
          headers: { ...cartesiaHeaders(ttsKey), 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model_id: 'sonic-3',
            transcript: cleanAiText || "I understand.",
            voice: selectedVoiceTag.replace('ct:', ''),
            language: selectedLang,
            output_format: { container: 'mp3', sample_rate: 44100, bit_rate: 128000 }
          }),
          signal
        });

        if (!ttsResponse.ok) {
          const ctErr = await ttsResponse.text();
          throw new Error(`Cartesia TTS Failed (HTTP ${ttsResponse.status}): ${ctErr}`);
        }
        audioBlobResponse = await ttsResponse.blob();

      } else {
        const voiceId = selectedVoiceTag.replace('dg:', '');
        const ttsApiVersion = voiceId.startsWith('flux') ? 'v2' : 'v1';

        const ttsResponse = await fetch(`https://api.deepgram.com/${ttsApiVersion}/speak?model=${voiceId}`, {
          method: 'POST',
          headers: { 'Authorization': `Token ${ttsKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: cleanAiText || "I understand." }),
          signal
        });

        if (!ttsResponse.ok) {
          const dgErr = await ttsResponse.text();
          throw new Error(`Deepgram TTS Failed (HTTP ${ttsResponse.status}): ${dgErr}`);
        }
        audioBlobResponse = await ttsResponse.blob();
      }

      const ttsTime = (performance.now() - ttsStart).toFixed(0);
      const totalTime = (performance.now() - t0).toFixed(0);

      if (logs) {
        logs.innerHTML = `STT (${sttProvider.toUpperCase()} ${selectedLang.toUpperCase()}): ${sttTime} ms<br>LLM (${modelUsed}): ${llmTime} ms<br>TTS: ${ttsTime} ms<br><br><strong style="color:#fff;">Total Round Trip: ${totalTime} ms</strong>`;
      }

      // 4. Audio Playback
      const audioUrl = URL.createObjectURL(audioBlobResponse);
      currentAudio = new Audio(audioUrl);
      
      updateStatus("statusSpeak", "statusSubSpeak", "status-speaking");
      currentAudio.play();

      currentAudio.onended = () => {
        currentAudio = null;
        updateStatus("statusReady", "statusSubReady", "status-idle");
      };

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log("Pipeline aborted by user interruption.");
        return;
      }
      console.error("Pipeline Error:", error);
      if (rawLogEl) {
        rawLogEl.innerText = `[DEBUG INSPECTOR ERROR TRACE]\n${error.message}`;
      }
      updateStatus("statusErr", "statusSubErr", "status-recording");
      setTimeout(() => updateStatus("statusReady", "statusSubReady", "status-idle"), 3000);
    }
  };
}

function updateStatus(titleKey, subtitleKey, className) {
  const lang = document.getElementById('uiLanguage') ? document.getElementById('uiLanguage').value : 'en';
  const t = typeof UI_TRANSLATIONS !== 'undefined' ? (UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en) : {};
  const card = document.getElementById('statusCard');
  if(card) card.className = `status-card ${className}`;
  const st = document.getElementById('statusText');
  if(st) st.innerText = t[titleKey] || titleKey;
  const sst = document.getElementById('subStatusText');
  if(sst) sst.innerText = t[subtitleKey] || subtitleKey;
}

function populateUiLanguages() {
  const uiLangSelect = document.getElementById('uiLanguage');
  if(!uiLangSelect) return;
  uiLangSelect.innerHTML = '';
  SUPPORTED_LANGUAGES.elevenlabs.forEach(l => {
    const opt = document.createElement('option');
    opt.value = l.code;
    opt.innerText = l.name;
    uiLangSelect.appendChild(opt);
  });
  const savedUiLang = localStorage.getItem('ui_language') || 'en';
  if (Array.from(uiLangSelect.options).some(o => o.value === savedUiLang)) {
    uiLangSelect.value = savedUiLang;
  } else {
    uiLangSelect.value = 'en';
  }
}

function applyUILanguage() {
  const lang = document.getElementById('uiLanguage').value;
  localStorage.setItem('ui_language', lang);
  const t = typeof UI_TRANSLATIONS !== 'undefined' ? (UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en) : null;
  if (!t) return;
  const map = { 
    'lbl-ui-lang': t.uiLang, 
    'lbl-stt': t.stt, 
    'lbl-tts': t.tts, 
    'lbl-lang': t.lang, 
    'lbl-voice': t.voice, 
    'lbl-llm': t.llm, 
    'sum-inst': t.inst, 
    'sum-user': t.user, 
    'sum-ai': t.ai, 
    'btn-clear': t.clear, 
    'lbl-debug': t.debug,
    'lbl-license': t.licenseText || 'AGPLv3 License',
    'lbl-help': t.helpText || 'Help'
  };
  for (const [id, text] of Object.entries(map)) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
  }
  const card = document.getElementById('statusCard');
  if (card && card.classList.contains('status-idle')) updateStatus("statusReady", "statusSubReady", "status-idle");
  const userBox = document.getElementById('userPromptBox');
  if (userBox && userBox.classList.contains('placeholder')) userBox.innerText = t.userPlaceholder;
  const assistantBox = document.getElementById('assistantResponseBox');
  if (assistantBox && assistantBox.classList.contains('placeholder')) assistantBox.innerText = t.aiPlaceholder;
  const ctrls = document.getElementById('lbl-ctrls');
  if (ctrls && t.ctrls) ctrls.innerHTML = t.ctrls;
  updateSttKeyField();
  updateTtsKeyField();
  updateLlmKeyField();
  populateVoices();
  ['sttCredits', 'ttsCredits', 'llmCredits'].forEach(id => renderBadge(document.getElementById(id)));
}
