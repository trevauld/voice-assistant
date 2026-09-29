# Push to Chat

A real-time voice chat app that's patient with stuttering. You speak, it transcribes you, an AI replies like a friend, and the reply is read back to you, sentence by sentence.

**Live:** https://push-to-chat.keremk.workers.dev · **User guide:** https://push-to-chat.keremk.workers.dev/help

- **Bring your own key.** Users paste their own API keys. Keys are stored only in the user's browser (`localStorage`) and sent only to the provider they belong to. There is no backend and no account.
- **Free providers only.** Every provider in the app has a free tier or free credits that don't require a credit card. Please keep it that way when adding providers.
- **Installable web app (PWA).** It runs in any modern browser and can be added to the home screen.
- **32 languages** for both the interface and the conversation.

## How a conversation turn works

```
microphone ──► Speech-to-Text ──► app cleanup ──► AI Engine (streamed) ──► sentence splitter ──► Text-to-Speech ──► playback
               Deepgram           removes          Mistral / Gemini /       first sentence       Deepgram /          one reused
               ElevenLabs         leftover         Groq                     goes out at once      ElevenLabs /        <audio> element,
               Cartesia           stutters                                                        Cartesia            in order
               Groq
```

Typed messages skip Speech-to-Text. The entry point for a turn is `runTurn()` in `app.js`.

## Running it locally

There is no build step and no dependencies. Serve the folder over HTTP:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Browsers only allow microphone access on `https://` or `localhost`, so don't open `index.html` as a file.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole UI, including its CSS (with light/dark theme variables) and the Content-Security-Policy `<meta>` tag |
| `app.js` | All app logic: providers, languages, the conversation pipeline, settings, key checks |
| `translations.js` | Interface text for all 32 UI languages (`UI_TRANSLATIONS`) |
| `theme.js` | Applies the saved theme before first paint (loaded in `<head>`) |
| `help.html` | The user guide (English), linked from the Help button |
| `sw.js` | Service worker: offline cache for the app's own files |
| `manifest.json` | Web app manifest (name, icons, start URL) |
| `_headers` | Security headers for Cloudflare (CSP, framing, referrer, permissions) |
| `.assetsignore` | Files Cloudflare must not publish as part of the site |
| `proxy/` | The ElevenLabs fallback proxy (a Cloudflare Worker), see below |

### Where things live in `app.js`

- **Providers:** `PROVIDER_PRESETS` (AI Engines and their fallback model lists), `STT_PROVIDERS` / `TTS_PROVIDERS`, `SUPPORTED_LANGUAGES`, and the voice lists (`DEEPGRAM_VOICES`, `ELEVENLABS_FEMALE_VOICES`, Cartesia voices loaded per language)
- **Pipeline:** `runTurn()` → `transcribeAudio()` → `cleanDisfluencies()` → `streamSelectedLLM()` → `createSentenceSplitter()` → `createSpeechQueue()` → `synthesizeSpeech()` → `playAudioBlob()`
- **Key checks:** `probeKeyCredits()` (speech providers) and `checkLlmCredits()` (AI Engines)
- **Assistant behaviour:** `DEFAULT_SYSTEM_PROMPT`. The reply-language rule is not in there: `runTurn()` always appends it, naming the selected Chat Language, so users can't override it.

## Adding a provider

Checklist for a new Speech-to-Text, Text-to-Speech or AI Engine provider:

1. **Confirm it's free without a credit card**, and that its API accepts direct browser requests (CORS). No proxy should be needed.
2. **Add it to `app.js`:**
   - the relevant list (`PROVIDER_PRESETS`, `STT_PROVIDERS` and/or `TTS_PROVIDERS`)
   - `PROVIDER_NAMES`
   - `SUPPORTED_LANGUAGES`
   - its request in `transcribeAudio()`, `synthesizeSpeech()` or `streamSelectedLLM()`
   - its key check in `probeKeyCredits()` or `checkLlmCredits()`
3. **Add an `<option>`** to the provider's `<select>` in `index.html`.
4. **Allow its API host in the Content-Security-Policy**, in both `index.html` (`<meta>`) and `_headers`. The two must stay identical.
5. **Update `help.html`:** provider lists, the free-credit table, the key instructions and a speed badge.

## Rules worth knowing

- **Keep the two CSPs in sync.** The policy exists twice: the `<meta>` tag in `index.html` and `_headers`. A host missing from either blocks requests.
- **Scripts must be external files.** The CSP forbids inline scripts and inline event handlers (`onclick=` etc.). Wire events in `app.js`.
- **Translate every new interface string.** Add each new key to all 32 languages in `translations.js`, and map element IDs in `applyUILanguage()`.
- **Never pre-cache a URL that redirects.** Cloudflare redirects `/index.html` to `/` and `/help.html` to `/help`. Safari refuses pages served from a redirected response, so don't add such URLs to `urlsToCache` in `sw.js`. The fetch handler already turns redirected responses into plain copies.
- **Bump the cache name in `sw.js`** (`voice-assistant-cache-vN`) when you change what it caches.
- **Don't send keys anywhere else.** Never put keys in URLs, never log them, and only send each one to its own provider.

## Deployment

The site is hosted on **Cloudflare** (Workers static assets). Every push to `main` is deployed automatically. There's nothing to build, and the repository root is the site. `.assetsignore` keeps non-site files (like `proxy/` and `package.json`) from being published.

### The ElevenLabs proxy

Some ad and tracker blockers block `api.elevenlabs.io`. When a direct ElevenLabs request fails with a network error, the app retries through `proxy/worker.js`, a pass-through Cloudflare Worker, for the rest of the session. The proxy:

- only accepts requests from the app's own origin
- only allows the three endpoints the app uses
- only forwards the API key and content-type headers
- has request logging disabled

It is not deployed automatically. After changing it:

```bash
cd proxy && npx wrangler deploy
```

If you run your own copy of the app, change `ALLOWED_ORIGINS` in `proxy/worker.js` and `ELEVENLABS_PROXY` in `app.js` to your own addresses.

## License

[GNU AGPL v3](LICENSE). If you run a modified version of this app for others to use over a network, you must make your modified source code available to those users under the same license.
