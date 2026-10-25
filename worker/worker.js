// Arlene's Kitchen Table: intake Worker (Cloudflare Workers, free plan).
// Accepts a submitted card from the website and saves it to the PRIVATE inbox repo.
// Nothing becomes public until the owner approves it on admin.html.
//
// Settings (Cloudflare dashboard -> your Worker -> Settings -> Variables and Secrets):
//   OWNER            text    cakesnturbos
//   INBOX_REPO       text    arleneskitchentable-inbox
//   ALLOWED_ORIGINS  text    https://cakesnturbos.github.io,https://arleneskitchentable.com,https://www.arleneskitchentable.com
//   GH_TOKEN         SECRET  fine-grained GitHub token, ONLY the inbox repo, Contents: read and write
//   TURNSTILE_SECRET SECRET  (optional) Cloudflare Turnstile secret key

const CATS = new Set(['breakfast','lunch','dinner','cakes','cookies','pies','puddings','breads',
  'thanksgiving','christmas','german','italian','mexican','polish','dogtreats','casseroles','nobake','pasta','noodles','sides']);

const utf8ToB64 = s => btoa(unescape(encodeURIComponent(s)));
const clip = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

async function putFile(env, path, contentB64, message) {
  const r = await fetch(`https://api.github.com/repos/${env.OWNER}/${env.INBOX_REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${env.GH_TOKEN}`,
      'User-Agent': 'arlene-intake',
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ message, content: contentB64 }),
  });
  if (!r.ok) throw new Error('GitHub ' + r.status);
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    const okOrigin = allowed.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': okOrigin ? origin : 'null',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
    };
    const send = (status, obj) =>
      new Response(JSON.stringify(obj), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST') return send(405, { error: 'POST only.' });
    if (!okOrigin) return send(403, { error: 'Not allowed from this site.' });
    if ((+req.headers.get('content-length') || 0) > 5_000_000) return send(413, { error: 'That photo is too large.' });

    let b;
    try { b = await req.json(); } catch { return send(400, { error: 'Bad request.' }); }

    if (b.website) return send(200, { ok: true }); // hidden field filled in: a bot. Pretend it worked.

    if (env.TURNSTILE_SECRET) {
      const form = new FormData();
      form.append('secret', env.TURNSTILE_SECRET);
      form.append('response', clip(b.turnstile, 2048));
      const v = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
      const vj = await v.json().catch(() => ({}));
      if (!vj.success) return send(400, { error: 'The check box did not pass. Please try again.' });
    }

    const title = clip(b.title, 120);
    const ingredients = Array.isArray(b.ingredients)
      ? b.ingredients.slice(0, 80).map(x => clip(x, 300)).filter(Boolean) : [];
    const cats = Array.isArray(b.cats) ? [...new Set(b.cats.filter(c => CATS.has(c)))] : [];
    const year = Number.isInteger(b.year) && b.year >= 1700 && b.year <= 2100 ? b.year : null;
    const image = typeof b.image === 'string' && b.image.length ? b.image : null;

    if (!title) return send(400, { error: 'Give the recipe a name.' });
    if (!cats.length) return send(400, { error: 'Pick at least one category.' });
    if (!image && !ingredients.length) return send(400, { error: 'Add a photo, or type in the ingredients.' });
    if (image) {
      if (image.length > 4_000_000) return send(413, { error: 'That photo is too large.' });
      let head = '';
      try { head = atob(image.slice(0, 8)); } catch { return send(400, { error: 'That photo could not be read.' }); }
      if (!head.startsWith('\xff\xd8\xff')) return send(400, { error: 'Photos must be JPEG.' });
    }

    const id = Date.now().toString(36) + '-' + crypto.randomUUID().slice(0, 8);
    const record = {
      id, created: new Date().toISOString(), title,
      by: clip(b.by, 80), where: clip(b.where, 80), year, cats, ingredients,
      method: clip(b.method, 5000) || null, manual: !image,
      contact: clip(b.contact, 120) || null,
      image: image ? `${id}.jpg` : null,
    };

    try {
      if (image) await putFile(env, `submissions/${id}.jpg`, image, `Photo for ${title}`);
      await putFile(env, `submissions/${id}.json`, utf8ToB64(JSON.stringify(record, null, 2) + '\n'), `New card: ${title}`);
    } catch (e) {
      return send(502, { error: 'Could not save the card right now. Please try again in a minute.' });
    }
    return send(200, { ok: true });
  },
};
