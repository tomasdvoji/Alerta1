// Cloudflare Worker: posila e-maily pres Resend (tajny klic zustava na serveru).
// POST /send  { site, to, reply_to, subject, html }
// Secrets/vars (wrangler secret put): RESEND_API_KEY, FROM_ALERTA, FROM_ASISTEL
// Nasazeni: cd mail-worker && npx wrangler deploy

const ORIGINS = [
  'https://tomasdvoji.github.io',
  'https://alerta.cz', 'https://www.alerta.cz',
  'https://asistel.cz', 'https://www.asistel.cz',
];

function cors(origin) {
  const ok = ORIGINS.includes(origin) || /^http:\/\/localhost(:\d+)?$/.test(origin || '');
  return {
    'Access-Control-Allow-Origin': ok ? origin : 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const headers = { ...cors(origin), 'Content-Type': 'application/json' };
    if (request.method === 'OPTIONS') return new Response(null, { headers });
    if (request.method !== 'POST' || new URL(request.url).pathname !== '/send') {
      return new Response('{"error":"not found"}', { status: 404, headers });
    }
    // ponytail: ochrana jen pres Origin (curl ho podvrhne); pokud zacne spam, pridat Turnstile
    if (headers['Access-Control-Allow-Origin'] === 'null') {
      return new Response('{"error":"forbidden"}', { status: 403, headers });
    }

    const b = await request.json().catch(() => ({}));
    const from = env['FROM_' + String(b.site || '').toUpperCase()];
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!from || !email.test(b.to || '') || !b.subject || !b.html) {
      return new Response('{"error":"bad request"}', { status: 400, headers });
    }

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + (env.RESEND_API_KEY || env['RESEND_API_KEY¨']), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [b.to],
        reply_to: email.test(b.reply_to || '') ? b.reply_to : undefined,
        subject: String(b.subject).slice(0, 200),
        html: String(b.html),
      }),
    });
    const text = await r.text();
    return new Response(r.ok ? '{"ok":true}' : JSON.stringify({ error: text }), { status: r.ok ? 200 : 502, headers });
  },
};
