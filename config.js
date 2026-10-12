// Site settings. Nothing secret goes in this file: the repo is public.
window.AKT_CONFIG = {
  owner: 'cakesnturbos',
  publicRepo: 'arleneskitchentable',        // approved cards live here (data/recipes.json + images/)
  inboxRepo: 'arleneskitchentable-inbox',   // PRIVATE repo: cards waiting for approval
  submitUrl: 'https://arlene-intake.hausofdub.workers.dev',  // the Cloudflare Worker that receives new cards
  turnstileSiteKey: ''                      // optional: Cloudflare Turnstile site key (public) to block bots
};
