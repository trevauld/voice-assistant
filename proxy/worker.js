// ElevenLabs fallback proxy, used only when a browser extension blocks api.elevenlabs.io.
// It never stores or logs anything: it forwards the request and streams the response back.

const ALLOWED_ORIGINS = [
  'https://push-to-chat.keremk.workers.dev',
];

// Only the endpoints the app actually uses
const ALLOWED_PATHS = [
  /^\/v1\/user\/subscription$/,
  /^\/v1\/speech-to-text$/,
  /^\/v1\/text-to-speech\/[A-Za-z0-9]+$/,
];

// Only these request headers are forwarded to ElevenLabs
const FORWARDED_HEADERS = ['xi-api-key', 'content-type'];

export default {
  async fetch(request) {
    const origin = request.headers.get('Origin');
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response('Forbidden', { status: 403 });
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, xi-api-key',
      'Access-Control-Max-Age': '600',
      'Vary': 'Origin',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    if (!['GET', 'POST'].includes(request.method) || !ALLOWED_PATHS.some(re => re.test(url.pathname))) {
      return new Response('Not found', { status: 404, headers: corsHeaders });
    }

    const headers = new Headers();
    for (const name of FORWARDED_HEADERS) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }

    const response = await fetch(`https://api.elevenlabs.io${url.pathname}${url.search}`, {
      method: request.method,
      headers,
      body: request.method === 'POST' ? request.body : null,
    });

    const proxied = new Response(response.body, response);
    for (const [name, value] of Object.entries(corsHeaders)) proxied.headers.set(name, value);
    // Responses carry account data and generated audio; never let a browser or cache keep them
    proxied.headers.set('Cache-Control', 'no-store');
    proxied.headers.delete('Set-Cookie');
    return proxied;
  },
};
