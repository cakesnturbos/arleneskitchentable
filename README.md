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
- **Add a card.** Upload a photo, then turn, flip or crop it. Add a name, who wrote it, where and when, and pick categories.
- **Little touches.** An "Arlene says" line and a photo of Arlene in the footer, and a squirrel that shows up now and then.

## Status: prototype

This is a working demo, not the finished site.

- The cards you see are made-up samples.
- Nothing added through "Add a card" is saved. It disappears when the page is closed.
- Interpret shows pre-written readings for the sample cards. It does not read real photos yet.
- The Print button opens a preview only.

## What a real version needs

- A place to store uploaded card photos and recipes.
- A handwriting-reading service for Interpret, with a way for people to check and fix what it read.
- A real print and PDF export.
- Sign-up or review for uploads to keep spam out, and a simple way to remove a card on request.
- A "family or personal card, not a published cookbook page" check on every upload.

## How it's built

One file: [`index.html`](index.html). No build step, no framework, no ads, no trackers. Fonts come from Google Fonts. The `CNAME` file tells GitHub Pages which domain the site belongs to.

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
