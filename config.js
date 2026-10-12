// Site settings. Nothing secret goes in this file: the repo is public.
window.AKT_CONFIG = {
  owner: 'cakesnturbos',
  publicRepo: 'arleneskitchentable',        // approved cards live here (data/recipes.json + images/)
  inboxRepo: 'arleneskitchentable-inbox',   // PRIVATE repo: cards waiting for approval
  submitUrl: '',                            // the Cloudflare Worker address, e.g. https://arlene-intake.YOURNAME.workers.dev
  turnstileSiteKey: ''                      // optional: Cloudflare Turnstile site key (public) to block bots
};
