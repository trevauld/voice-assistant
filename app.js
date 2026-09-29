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
      'qwen/qwen3.8-27b'
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

// Speech providers in fallback order, and their display names (Groq only listens)
const STT_PROVIDERS = ['deepgram', 'elevenlabs', 'cartesia', 'groq'];
const TTS_PROVIDERS = ['deepgram', 'elevenlabs', 'cartesia'];
const PROVIDER_NAMES = { deepgram: 'Deepgram', elevenlabs: 'ElevenLabs', cartesia: 'Cartesia', groq: 'Groq' };

SUPPORTED_LANGUAGES.cartesia = SUPPORTED_LANGUAGES.elevenlabs;
SUPPORTED_LANGUAGES.groq = SUPPORTED_LANGUAGES.elevenlabs; // Whisper covers all 32

let currentAudio = null;
let pipelineAbortController = null;
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let conversationHistory = [];

const DEFAULT_SYSTEM_PROMPT = `You are a friend in a real-time spoken voice conversation.
Never complete the user's sentences or guess what they were about to say. Reply to what they actually said.
Formatting Rules:
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
// (Groq's speech-to-text uses the same key as the Groq AI Engine)
const SHARED_KEY_NAMES = { deepgram: 'dg_key', elevenlabs: 'xi_key', cartesia: 'ct_key', groq: 'llm_key_groq' };

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
  // A saved provider that is no longer offered falls back to the default
  const offered = (id, value) => [...document.getElementById(id).options].some(o => o.value === value);
  const savedLlm = localStorage.getItem('llm_provider');
  const llmProvider = offered('llmProvider', savedLlm) ? savedLlm : 'mistral';
  localStorage.setItem('llm_provider', llmProvider);

  document.getElementById('sttProvider').value = sttProvider;
  document.getElementById('ttsProvider').value = ttsProvider;
  document.getElementById('llmProvider').value = llmProvider;

  document.getElementById('systemPrompt').value = localStorage.getItem('system_prompt') || DEFAULT_SYSTEM_PROMPT;
  document.getElementById('ttsSpeed').value = localStorage.getItem('tts_speed') || '1';
  document.getElementById('themeSelect').value = localStorage.getItem('theme') || 'system';
  applyTheme();

  updateSttKeyField();
  updateTtsKeyField();
  updateLlmKeyField();
  populateLanguages();

  checkSttCredits();
  checkTtsCredits();
  checkLlmCredits();
  populateUiLanguages();
  applyUILanguage();

  restoreSections();

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
  on('ttsSpeed', 'change', onSpeedChange);
  on('btn-send-typed', 'click', sendTypedMessage);
  on('typedMessage', 'keydown', event => { if (event.key === 'Enter') { event.preventDefault(); sendTypedMessage(); } });
  on('themeSelect', 'change', onThemeChange);

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
  if (provider === 'groq' && document.getElementById('sttProvider').value === 'groq' && !localStorage.getItem('stt_key_groq')) {
    updateSttKeyField();
    scheduleKeyCheck('stt', checkSttCredits);
  }
}

function providerSupports(provider, lang) {
  return (SUPPORTED_LANGUAGES[provider] || SUPPORTED_LANGUAGES.deepgram).some(l => l.code === lang);
}

// Prefer the provider the other side already uses, then one with a saved key, then the first that fits
function pickProviderFor(type, lang, otherProvider) {
  const candidates = (type === 'stt' ? STT_PROVIDERS : TTS_PROVIDERS).filter(p => providerSupports(p, lang));
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
  // Every provider that handles the language, speaking or listening (Groq only listens)
  const allProviders = [...new Set([...TTS_PROVIDERS, ...STT_PROVIDERS])];
  const providersFor = code => allProviders.filter(p => providerSupports(p, code));
  const [universal, partial] = [true, false].map(all =>
    SUPPORTED_LANGUAGES.elevenlabs.filter(l => (providersFor(l.code).length === allProviders.length) === all));
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
  badge.style.color = state === 'req' ? 'var(--faint)' : state === 'nocred' ? 'var(--bad)' : 'var(--ok)';
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
    } else if (provider === 'groq') {
      const res = await fetch('https://api.groq.com/openai/v1/models', { headers: { 'Authorization': `Bearer ${key}` } });
      setBadge(badge, checkId, res.ok ? 'avail' : 'nocred');
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

// Tidy leftover stuttering out of a transcript before the AI sees it, so the AI never has to
// know about (or comment on) the user's speech
function cleanDisfluencies(text) {
  return text
    // Blocks: long runs of dots or ellipses become a single space
    .replace(/\s*(?:\.{3,}|…+)\s*/g, ' ')
    // Sound repetitions: "w-w-w-want" -> "want" (keeping a capital: "H-h-hey" -> "Hey")
    .replace(/(^|[^\p{L}])(\p{L}{1,3})(?:-\2)*-(\2\p{L}*)/giu, (m, before, sound, word) =>
      before + (sound[0] !== sound[0].toLowerCase() ? word[0].toUpperCase() + word.slice(1) : word))
    // Prolongations: a letter held 4+ times -> once ("Ssssssee" -> "See"); real words have at most 3
    .replace(/(\p{L})\1{3,}/giu, '$1')
    // Word repetitions: "put, put, put that" -> "put that"
    .replace(/(^|[^\p{L}])(\p{L}+)(?:[\s,.;:!?-]+\2)+(?![\p{L}])/giu, '$1$2')
    .replace(/\s+/g, ' ')
    .trim();
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
    openSettings();
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
  keepScreenAwake();
  updateStatus("statusRec", "statusSubRec", "status-recording");
}

async function streamSelectedLLM(systemPrompt, history, signal, onDelta = () => {}) {
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
            for (const p of parts) if (p.text && !p.thought) { text += p.text; onDelta(p.text); }
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
    let streamed = false;
    try {
      const response = await fetch(preset.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: targetModel, messages, stream: true, max_tokens: 450, temperature: 0.7,
          // Qwen on Groq is a reasoning model; keep its thinking out of the reply that gets spoken
          ...(provider === 'groq' && targetModel.startsWith('qwen/') && { reasoning_format: 'hidden' })
        }),
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
              if (delta) { text += delta; streamed = true; onDelta(delta); }
            } catch (e) {}
          }
        }
      }

      return { text, model: targetModel, status, ttft, totalTime: (performance.now() - tStart).toFixed(0), chunkCount };

    } catch (err) {
      // Once part of a reply has been spoken, switching models would repeat or contradict it
      if (err.name === 'AbortError' || streamed) throw err;
      lastError = err;
      console.warn(`[${preset.name}] ${targetModel} failed: ${err.message}. Trying next model...`);
    }
  }

  throw lastError || new Error(`[${preset.name}] All candidate models failed or exceeded rate limits.`);
}

// Reasoning models may wrap their thinking in <think> tags; it is never shown or spoken
function stripThinking(text) {
  return text.replace(/<think>[\s\S]*?(<\/think>|$)/g, '');
}

// Split streamed text into sentences so speech can start before the whole reply is written.
// The first sentence goes out immediately; later ones are grouped to avoid many tiny requests.
function createSentenceSplitter(onChunk) {
  const boundary = /^[\s\S]*?(?:[.!?…]+["'”’)\]]*\s+|[。！？]+)/;
  let pending = '', chunk = '', count = 0;
  const emit = text => { if (text.trim()) { count++; onChunk(text.trim()); } };
  return {
    push(text) {
      pending += text;
      let match;
      while ((match = pending.match(boundary))) {
        chunk += match[0];
        pending = pending.slice(match[0].length);
        if (count === 0 || chunk.trim().length >= 40) { emit(chunk); chunk = ''; }
      }
    },
    flush() { emit(chunk + pending); chunk = pending = ''; }
  };
}

// One audio element is reused for every sentence, so mobile browsers keep allowing playback
const speechAudio = new Audio();

function getSpeakingSpeed() {
  return parseFloat(document.getElementById('ttsSpeed').value) || 1;
}

function playAudioBlob(blob, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return resolve();
    const url = URL.createObjectURL(blob);
    const finish = err => {
      speechAudio.onended = speechAudio.onerror = null;
      signal.removeEventListener('abort', onAbort);
      URL.revokeObjectURL(url);
      if (currentAudio === speechAudio) currentAudio = null;
      err ? reject(err) : resolve();
    };
    const onAbort = () => finish();
    signal.addEventListener('abort', onAbort);
    speechAudio.onended = () => finish();
    speechAudio.onerror = () => finish(new Error('Audio playback failed.'));
    speechAudio.src = url;
    speechAudio.defaultPlaybackRate = speechAudio.playbackRate = getSpeakingSpeed();
    speechAudio.preservesPitch = true;
    currentAudio = speechAudio;
    speechAudio.play().catch(finish);
  });
}

// Sentences are synthesized one request at a time (the next is fetched while the current one plays)
// and played strictly in order
function createSpeechQueue(synthesize, signal, onFirstAudio) {
  let fetchChain = Promise.resolve();
  let playChain = Promise.resolve();
  let started = false;
  return {
    add(text) {
      const clean = sanitizeTextForTTS(text);
      if (!clean) return;
      const audio = fetchChain.then(() => synthesize(clean, signal));
      fetchChain = audio.catch(() => {});
      playChain = playChain.then(async () => {
        const blob = await audio;
        if (signal.aborted) return;
        if (!started) { started = true; onFirstAudio(); }
        await playAudioBlob(blob, signal);
      });
      playChain.catch(() => {});
    },
    finished: () => playChain
  };
}

async function transcribeAudio(audioBlob, { provider, key, lang, mime }, signal) {
  const extension = mime.includes('mp4') ? 'mp4' : 'webm';

  if (provider === 'elevenlabs') {
    const formData = new FormData();
    formData.append('file', audioBlob, `speech.${extension}`);
    formData.append('model_id', 'scribe_v2');
    formData.append('language_code', lang);
    // Clean transcript: drop filler words, false starts, repetitions and sound tags like "(laughter)"
    formData.append('no_verbatim', 'true');
    formData.append('tag_audio_events', 'false');
    const res = await elevenLabsFetch('/v1/speech-to-text', { method: 'POST', headers: { 'xi-api-key': key }, body: formData, signal });
    if (!res.ok) throw new Error(`ElevenLabs STT Failed (HTTP ${res.status}): ${await res.text()}`);
    const data = await res.json();
    return data.text || data.transcript || "";
  }

  if (provider === 'cartesia') {
    const formData = new FormData();
    formData.append('file', audioBlob, `speech.${extension}`);
    formData.append('model', 'ink-whisper');
    formData.append('language', lang);
    const res = await fetch(`${CARTESIA_API}/stt`, { method: 'POST', headers: cartesiaHeaders(key), body: formData, signal });
    if (!res.ok) throw new Error(`Cartesia STT Failed (HTTP ${res.status}): ${await res.text()}`);
    return (await res.json()).text || "";
  }

  if (provider === 'groq') {
    const formData = new FormData();
    formData.append('file', audioBlob, `speech.${extension}`);
    formData.append('model', 'whisper-large-v3-turbo');
    formData.append('language', lang);
    formData.append('response_format', 'json');
    const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', { method: 'POST', headers: { 'Authorization': `Bearer ${key}` }, body: formData, signal });
    if (!res.ok) throw new Error(`Groq STT Failed (HTTP ${res.status}): ${await res.text()}`);
    return (await res.json()).text || "";
  }

  const res = await fetch(`https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&language=${lang}`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${key}`, 'Content-Type': mime },
    body: audioBlob,
    signal
  });
  if (!res.ok) throw new Error(`Deepgram STT Failed (HTTP ${res.status}): ${await res.text()}`);
  const data = await res.json();
  return data.results?.channels[0]?.alternatives[0]?.transcript || "";
}

async function synthesizeSpeech(text, { voiceTag, key, lang }, signal) {
  if (voiceTag.startsWith('xi:')) {
    if (!key) throw new Error("ElevenLabs API Key is required for TTS synthesis.");
    const res = await elevenLabsFetch(`/v1/text-to-speech/${voiceTag.replace('xi:', '')}?output_format=mp3_22050_32`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'xi-api-key': key },
      body: JSON.stringify({ text, model_id: "eleven_flash_v2_5", voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
      signal
    });
    if (!res.ok) throw new Error(`ElevenLabs TTS Failed (HTTP ${res.status}): ${await res.text()}`);
    return res.blob();
  }

  if (voiceTag.startsWith('ct:')) {
    if (!key) throw new Error("Cartesia API Key is required for TTS synthesis.");
    const res = await fetch(`${CARTESIA_API}/tts/bytes`, {
      method: 'POST',
      headers: { ...cartesiaHeaders(key), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model_id: 'sonic-3',
        transcript: text,
        voice: voiceTag.replace('ct:', ''),
        language: lang,
        output_format: { container: 'mp3', sample_rate: 44100, bit_rate: 128000 }
      }),
      signal
    });
    if (!res.ok) throw new Error(`Cartesia TTS Failed (HTTP ${res.status}): ${await res.text()}`);
    return res.blob();
  }

  const voiceId = voiceTag.replace('dg:', '');
  const ttsApiVersion = voiceId.startsWith('flux') ? 'v2' : 'v1';
  const res = await fetch(`https://api.deepgram.com/${ttsApiVersion}/speak?model=${voiceId}`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
    signal
  });
  if (!res.ok) throw new Error(`Deepgram TTS Failed (HTTP ${res.status}): ${await res.text()}`);
  return res.blob();
}

function stopAndSendRecording() {
  if (!mediaRecorder || mediaRecorder.state === "inactive") return;

  mediaRecorder.onstop = () => {
    runTurn({ audioBlob: new Blob(audioChunks, { type: window.currentRecordingMime || 'audio/webm' }) });
  };
  mediaRecorder.stop();
  if (mediaRecorder.stream) {
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
  }

  isRecording = false;
  updateStatus("statusProc", "statusSubProc", "status-processing");
}

// Stop a recording without sending it
function cancelRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.onstop = null;
    mediaRecorder.stop();
    if (mediaRecorder.stream) mediaRecorder.stream.getTracks().forEach(track => track.stop());
  }
  isRecording = false;
}

function sendTypedMessage() {
  const input = document.getElementById('typedMessage');
  const text = input.value.trim();
  if (!text) return;
  if (!document.getElementById('llmKey').value.trim()) {
    const t = UI_TRANSLATIONS[document.getElementById('uiLanguage').value] || UI_TRANSLATIONS.en;
    openSettings();
    alert(t.reqKey);
    return;
  }
  cancelRecording();
  stopAssistant();
  keepScreenAwake();
  input.value = '';
  runTurn({ typedText: text });
}

// One conversation turn: (transcribe) -> stream the AI reply -> speak it sentence by sentence
async function runTurn({ audioBlob = null, typedText = '' }) {
  const sttProvider = document.getElementById('sttProvider').value;
  const ttsProvider = document.getElementById('ttsProvider').value;
  const sttKey = document.getElementById('sttKey').value.trim();
  const ttsKey = document.getElementById('ttsKey').value.trim();
  const selectedLang = document.getElementById('selectedLanguage').value || 'en';
  const selectedVoiceTag = document.getElementById('ttsVoice').value;
  const rawSystemPrompt = document.getElementById('systemPrompt').value;
  // The reply language is fixed by the app, not the editable instructions: the Chat Language is known
  // (speech-to-text only listens for it), so it's named explicitly and overrides anything the user wrote
  const languageName = (SUPPORTED_LANGUAGES.elevenlabs.find(l => l.code === selectedLang) || { name: 'English' }).name;
  const effectiveSystemPrompt = `${rawSystemPrompt}\n\nCRITICAL LANGUAGE DIRECTIVE (this overrides any other instruction about language): The user is speaking ${languageName}. Always reply in ${languageName} only, even if earlier messages in the conversation were in another language.`;

  const logs = document.getElementById('debugLogs');
  const rawLogEl = document.getElementById('geminiRawLog');
  const userBox = document.getElementById('userPromptBox');
  const assistantBox = document.getElementById('assistantResponseBox');

  pipelineAbortController = new AbortController();
  const signal = pipelineAbortController.signal;
  updateStatus("statusProc", "statusSubProc", "status-processing");

  try {
    const t0 = performance.now();

    // 1. Speech-to-text (skipped for typed messages)
    let userText = typedText;
    let sttLabel = 'Typed message';
    if (audioBlob) {
      if (logs) logs.innerHTML = `Uploading audio to ${sttProvider.toUpperCase()} STT...`;
      userText = cleanDisfluencies(await transcribeAudio(audioBlob, { provider: sttProvider, key: sttKey, lang: selectedLang, mime: window.currentRecordingMime || 'audio/webm' }, signal));
      if (!userText.trim()) throw new Error(`No speech detected. Make sure the Chat Language (${selectedLang.toUpperCase()}) matches the language you're speaking.`);
      sttLabel = `STT (${sttProvider.toUpperCase()} ${selectedLang.toUpperCase()}): ${(performance.now() - t0).toFixed(0)} ms`;
      if (sttProvider === 'elevenlabs') checkSttCredits();
    }

    if (userBox) {
      userBox.innerText = userText;
      userBox.classList.remove('placeholder');
    }
    if (logs) logs.innerHTML = `${sttLabel}<br>Calling LLM Engine...`;

    conversationHistory.push({ role: "user", content: userText });
    if (conversationHistory.length > 8) conversationHistory = conversationHistory.slice(-8);

    // 2. Stream the reply; each finished sentence is handed to speech right away
    let firstAudioAt = null;
    const speech = createSpeechQueue(
      (text, sig) => synthesizeSpeech(text, { voiceTag: selectedVoiceTag, key: ttsKey, lang: selectedLang }, sig),
      signal,
      () => { firstAudioAt = performance.now(); updateStatus("statusSpeak", "statusSubSpeak", "status-speaking"); }
    );
    const splitter = createSentenceSplitter(sentence => speech.add(sentence));
    let raw = '', fed = '';
    const llm = await streamSelectedLLM(effectiveSystemPrompt, conversationHistory, signal, delta => {
      raw += delta;
      // Hold back a half-received tag so partial "<think" markup is never spoken
      const visible = stripThinking(raw).replace(/<[^>]*$/, '');
      if (visible.length > fed.length) { splitter.push(visible.slice(fed.length)); fed = visible; }
      if (assistantBox) {
        assistantBox.innerText = sanitizeTextForTTS(visible) || '…';
        assistantBox.classList.remove('placeholder');
      }
    });
    splitter.flush();

    const aiText = stripThinking(llm.text);
    const cleanAiText = sanitizeTextForTTS(aiText);
    if (!cleanAiText) speech.add("I understand.");
    if (assistantBox) {
      assistantBox.innerText = cleanAiText || "I understand.";
      assistantBox.classList.remove('placeholder');
    }
    conversationHistory.push({ role: "assistant", content: aiText });

    if (rawLogEl) {
      const providerName = PROVIDER_PRESETS[document.getElementById('llmProvider').value].name;
      rawLogEl.innerText = `[DEBUG INSPECTOR]\nProvider: ${providerName}\nModel ID: ${llm.model}\nHTTP Status: ${llm.status} OK\nReply Language: ${languageName}\nUser Prompt: "${userText}"\nTime to First Token (TTFT): ${llm.ttft} ms\nTotal LLM Latency: ${llm.totalTime} ms\nVoice Tag: ${selectedVoiceTag}\n\n--- RAW AI RESPONSE ---\n"${llm.text}"\n\n--- SANITIZED FOR TTS ---\n"${cleanAiText}"`;
    }
    if (logs) logs.innerHTML = `${sttLabel}<br>LLM (${llm.model}): ${llm.totalTime} ms (TTFT: ${llm.ttft} ms)<br>Speaking...`;

    // 3. Wait until every sentence has been spoken
    await speech.finished();
    if (signal.aborted) return;
    if (ttsProvider === 'elevenlabs') checkTtsCredits();

    if (logs) {
      const firstAudio = firstAudioAt ? `${(firstAudioAt - t0).toFixed(0)} ms` : 'n/a';
      logs.innerHTML = `${sttLabel}<br>LLM (${llm.model}): ${llm.totalTime} ms (TTFT: ${llm.ttft} ms)<br><strong style="color: var(--text);">Time to first audio: ${firstAudio}</strong><br>Total until speech finished: ${(performance.now() - t0).toFixed(0)} ms`;
    }
    updateStatus("statusReady", "statusSubReady", "status-idle");

  } catch (error) {
    if (error.name === 'AbortError' || signal.aborted) {
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
}

// Collapsible sections remember whether they were open. Settings always opens while a key is
// missing, since the app can't be used until the keys are in.
const SECTION_IDS = ['settingsSection', 'instSection', 'userSection', 'aiSection'];
function allKeysEntered() {
  return ['sttKey', 'ttsKey', 'llmKey'].every(id => document.getElementById(id).value.trim());
}
function restoreSections() {
  for (const id of SECTION_IDS) {
    const section = document.getElementById(id);
    const saved = localStorage.getItem(`section_${id}`);
    if (saved) section.open = saved === 'open';
    if (id === 'settingsSection' && !allKeysEntered()) section.open = true;
    section.addEventListener('toggle', () => localStorage.setItem(`section_${id}`, section.open ? 'open' : 'closed'));
  }
}
function openSettings() {
  document.getElementById('settingsSection').open = true;
}

function onSpeedChange() {
  localStorage.setItem('tts_speed', document.getElementById('ttsSpeed').value);
  if (currentAudio) currentAudio.playbackRate = getSpeakingSpeed();
}

// Keep the screen on once a conversation has started (re-acquired when the app comes back to the front)
let wakeLock = null;
let wantWakeLock = false;
async function keepScreenAwake() {
  wantWakeLock = true;
  if (wakeLock || !('wakeLock' in navigator) || document.visibilityState !== 'visible') return;
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => { wakeLock = null; });
  } catch (e) {
    wakeLock = null;
  }
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && wantWakeLock) keepScreenAwake();
});

// Theme: 'system' follows the device; 'light' / 'dark' override it (theme.js applies it before first paint)
function applyTheme() {
  const theme = localStorage.getItem('theme') || 'system';
  if (theme === 'system') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  const dark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.querySelector('meta[name="theme-color"]').setAttribute('content', dark ? '#181818' : '#ffffff');
}

function onThemeChange() {
  const theme = document.getElementById('themeSelect').value;
  if (theme === 'system') localStorage.removeItem('theme');
  else localStorage.setItem('theme', theme);
  applyTheme();
}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

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
    'lbl-help': t.helpText || 'Help',
    'lbl-speed': t.speed,
    'sum-settings': t.settings,
    'btn-send-typed': t.send,
    'lbl-theme': t.theme,
    'opt-theme-system': t.themeSystem,
    'opt-theme-light': t.themeLight,
    'opt-theme-dark': t.themeDark
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
  document.getElementById('typedMessage').placeholder = t.typePh;
  const ctrls = document.getElementById('lbl-ctrls');
  if (ctrls && t.ctrls) ctrls.innerHTML = t.ctrls;
  updateSttKeyField();
  updateTtsKeyField();
  updateLlmKeyField();
  populateVoices();
  ['sttCredits', 'ttsCredits', 'llmCredits'].forEach(id => renderBadge(document.getElementById(id)));
}
