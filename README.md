# Arlene's Kitchen Table

> "Are you hungry?" That wasn't a question.

A place to share handwritten recipes. No ads, no pop-ups, no life stories before the recipe, and no one selling anything. Just old (and newer) recipe cards, exchanged the way they used to be.

Made in memory of Arlene Petriella, who kept every glass topped off and laughed the whole time.

**Live site:** https://arleneskitchentable.com
**GitHub Pages address:** https://cakesnturbos.github.io/arleneskitchentable/

(Once the custom domain is connected, the GitHub Pages address forwards to arleneskitchentable.com.)

## What it does

- **Handwritten cards come first.** Each recipe is shown as it was written: index cards, notebook pages, scraps of paper. Some have no instructions at all, and that's fine.
- **Browse like a recipe box.** A category tree (Meals, Dessert, Breads, Holiday, Ethnic) plus filters for decade and "little or no instructions," and a search box.
- **Interpret.** A button beside each card reads the handwriting and writes it out as a typed recipe. Words that were hard to read are underlined. If the card has no method, a clearly marked "suggested, not on the original card" method can be added.
- **Clear handwriting copy.** The typed words rewritten in an easy-to-read handwriting font.
- **Print.** Print the card as is, the typed recipe, the clear handwriting copy, or both on one page.
- **Add a card.** Upload a photo and turn, flip or crop it, or skip the photo and type the recipe in. A **Speak** button lets someone say the ingredients and method out loud (it uses the browser's built-in voice typing, so it works in Chrome, Edge and Safari). Add a name, who wrote it, where and when, and pick categories.
- **Little touches.** An "Arlene says" line and a photo of Arlene in the footer, and a squirrel that shows up now and then.

## How cards get on the site

GitHub is the database. There is no outside database service.

1. **Someone adds a card** on the site. The form sends it to a tiny free Cloudflare Worker ([`worker/worker.js`](worker/worker.js)).
2. The Worker saves it in a **private inbox repo** (`arleneskitchentable-inbox`). Nothing is public yet.
3. **Arlene's owner approves it** on [`admin.html`](admin.html): fix any words, pick categories, then Approve.
4. Approving copies the card into this public repo: the record goes into [`data/recipes.json`](data/recipes.json) and the photo into `images/`. The site shows it a minute or two later.

Until the first real card is approved, the site shows made-up sample cards.

## Status

- Working: browsing, the category tree, filters, the print previews, adding a card by photo, typing or voice, the admin page.
- Not built yet: Interpret reading real photos (the admin types the words in while approving), real print and PDF export, and a way for people to ask for a card to be removed.
- The Worker, the private inbox repo and the access tokens are set up by the owner. See the setup steps below.

## Setup (one time)

1. Create a **private** repo named `arleneskitchentable-inbox`.
2. Create a free Cloudflare account, then Workers & Pages, Create, "Hello World". Paste in `worker/worker.js` and deploy.
3. In the Worker's Settings, add the variables and secrets listed at the top of `worker/worker.js`. The `GH_TOKEN` secret is a GitHub fine-grained token for the **inbox repo only** (Contents: read and write).
4. Put the Worker's address in `config.js` as `submitUrl`.
5. For the admin page, create a fine-grained token for **both repos** (Contents: read and write). Paste it in on `admin.html`. It is saved only in that browser.

Optional: add Cloudflare Turnstile (free) to block bots. Put its secret in the Worker and its site key in `config.js`.

## How it's built

One file: [`index.html`](index.html). No build step, no framework, no ads, no trackers. Fonts come from Google Fonts. Settings live in [`config.js`](config.js) (nothing secret: the repo is public).

To view it on your computer, open `index.html` in a browser.

## Making changes

Things you're most likely to edit are near the top of the script in `index.html`:

- `SAYINGS` is the list of things Arlene said. Add a line and it can show up in the footer.
- `PHOTOS` is the list of photos of Arlene for the footer (image addresses).
- `RECIPES` holds the sample cards.
- `TREE` is the category tree.

## Hosting

Hosted free on GitHub Pages from the `main` branch. The domain `arleneskitchentable.com` points to GitHub through DNS records at the domain registrar.

## License

Not yet chosen. Recipe cards submitted by family and friends stay theirs.
