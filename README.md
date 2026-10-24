# Jayavardhan — Website

Static site: no build step, no framework. Just HTML/CSS/JS.

## Editing content without touching HTML (Decap CMS)

This site has a visual content editor at `/admin` for two things: **Blog Posts** and **Monthly Horoscope** predictions. You log in, fill out a form, hit publish — no code, no new HTML files.

### One-time setup (do this once)

1. Push this site to a GitHub repo (if you haven't already).
2. Create a free account at [netlify.com](https://netlify.com) and deploy this repo there too (Netlify is only being used here to power the login/editing — your live site can still be Cloudflare Pages or GitHub Pages; see "Which site is 'live'?" below).
3. In the Netlify dashboard for that site: **Site settings → Identity → Enable Identity**.
4. **Site settings → Identity → Services → Git Gateway → Enable Git Gateway.**
5. **Site settings → Identity → Invite users** → invite your own email address.
6. Check your email, accept the invite, set a password. ****asdpol**
7. Go to `https://YOUR-SITE-NAME.netlify.app/admin`, log in with that email/password.

### Using it day-to-day

- **New blog post**: Admin → Blog Posts → All Blog Posts → "Posts" → Add item. Fill in title, slug (used in the URL — lowercase with hyphens), tag, excerpt, date, and the body (this supports rich text formatting). Hit Publish.
- **Update Monthly Horoscope**: Admin → Monthly Horoscope → Monthly Predictions. Update the Month Label at the top, then edit each nakshatra's date range and prediction text directly.
- Every "Publish" commits the change to your GitHub repo automatically, which triggers your host (Cloudflare Pages / GitHub Pages) to redeploy the live site within a minute or two.

### Which site is "live"?

You can either (a) make Netlify your actual live site too — simplest, one less thing to manage — or (b) keep deploying the *public* site to Cloudflare Pages/GitHub Pages as before, and only use the Netlify URL privately for `/admin` editing. Either way, both pull from the same GitHub repo, so content edited via `/admin` shows up wherever the public site is actually hosted once it redeploys.

### If you'd rather not use Netlify at all

`admin/config.yml` has a commented-out alternative using a direct GitHub backend. This avoids Netlify entirely but requires you to create a GitHub OAuth App and deploy a small OAuth proxy (e.g. a Cloudflare Worker) yourself — more setup, but keeps everything on GitHub/Cloudflare only. Ask if you want help setting that path up instead.

## File structure
```
index.html          Home / Services
blog.html            Blog index (search + tag filter)
horoscope.html       Monthly Horoscope (27 nakshatras)
book-reading.html    Booking form (Web3Forms)
terms.html            Terms & Conditions
privacy.html          Privacy Policy
consent.html          Informed Consent & Liability Waiver
admin/               Decap CMS — visual editor for blog posts & horoscope
blog/post.html        Single template that renders any blog post from data/posts.json
css/style.css        All styles
js/nav.js            Mobile nav toggle
js/blog.js           Loads data/posts.json, powers search/filter + home preview
js/horoscope.js      Loads data/horoscope.json, renders the horoscope page
data/posts.json      Blog post data — edit via /admin, or by hand
data/horoscope.json  Monthly horoscope data — edit via /admin, or by hand
images/              All images (add your own — see below)
```

## Before you deploy, you need to:

1. **Replace `[Your Astrology Brand]`** — find/replace across every HTML file (nav, footer, page titles).
2. **Add your Web3Forms access key** — in `book-reading.html`, replace `YOUR_ACCESS_KEY_HERE` with your real key from https://web3forms.com (free, just needs an email to sign up).
3. **Add real images** to `images/` and update the `<img src="...">` paths in `index.html` and in each blog post's Cover Image field (editable via `/admin`, or by hand in `data/posts.json`). Referenced placeholders:
   - `images/blog-rising-sign.jpg`, `images/blog-saturn-return.jpg`, `images/blog-muhurta.jpg`
   - Add a real hero image/graphic if you don't want to keep the SVG chart illustration in the hero.
4. **Fill in placeholder content**: pricing (`₹X,XXX`), years of experience (`[X]+`), languages, testimonial names/quotes, social links in the footer, contact email.
5. **Update `<meta name="description">` tags** per page for SEO.
6. **Fill in real Monthly Horoscope transit dates** — the date ranges in `data/horoscope.json` are placeholders (see the Notes below).

## Adding a new blog post

Easiest: use `/admin` (see above) — Blog Posts → Add item, fill in the form, hit Publish.

By hand instead: add a new entry to the `posts` array in `data/posts.json` (title, slug, image, tag, excerpt, date, date_display, body). No new HTML file needed — `blog/post.html` is a single template that renders any post based on its slug.

## Deploying

### GitHub Pages
1. Push this folder to a GitHub repo.
2. Repo Settings → Pages → set source to your main branch, root folder.
3. Site will be live at `https://<username>.github.io/<repo>/`.

### Cloudflare Pages
1. Push to a GitHub repo (or drag-and-drop the folder in the Cloudflare Pages dashboard under "Direct Upload").
2. No build command needed — leave build settings blank / output directory as `/`.

## Notes
- The blog and horoscope pages `fetch()` `data/posts.json` and `data/horoscope.json`. This requires the site to be served over `http(s)://`, not opened directly as a local `file://` path — use a local server (e.g. `npx serve`) to preview on your machine, or just test after deploying. This is also a requirement for `/admin` (Decap CMS) to work at all.
- The Monthly Horoscope date ranges in `data/horoscope.json` are placeholders (`[Day 1–2 — update with real transit dates]`) — I wasn't able to calculate real nakshatra transit dates without a real ephemeris/panchang source, so these need to be filled in monthly (via `/admin` or by hand) rather than left as guessed dates.
- `terms.html`, `privacy.html`, and `consent.html` are placeholder legal text, not real legal advice — have an actual lawyer review and finalize this language, especially the consent/waiver page, before relying on it.
- No analytics are wired in — let me know if you want Google Analytics / Plausible / Cloudflare Web Analytics added.



##How to add more data tags for blog, do not code anything
config.yml

1. Tagging a post (already no-code)
Each blog post has a tag field — that's what shows as the little colored label on its card ("Basics," "Transits," "Timing"). You can set this to anything you want:

Via /admin (Decap CMS): open the post, there's a "Tag" field — just type whatever tag name you want.
Or by hand in data/posts.json: change the "tag": "Basics" line for that post.

Nothing stops you from typing a brand-new tag name here today — it'll show up on the card immediately.

2. The filter buttons at the top of the Blog page (not yet no-code)
Those "All / Basics / Transits / Timing" pill buttons near the search box are currently hard-coded directly into blog.html — they don't automatically know about new tags you add to posts. So right now, if you tag a post "Career," it'll show correctly on that post's card, but there won't be a "Career" filter button unless one is added to the HTML.

So practically: you can already tag posts with anything, no code needed. But to get a matching filter button for a brand-new tag, that currently needs one small HTML edit.

==============================================================

Word → manual edit of data/posts.json
Only do this if you're not using the CMS for some reason — it's fiddly because JSON has strict formatting rules.

In Word, write the post using plain paragraphs (blank line between paragraphs), and if you want bold/italic/headings, manually add Markdown syntax around them (**bold**, *italic*, ## Subheading) since Word's own formatting won't survive a copy into plain text.
Copy the text into a plain text editor first (Notepad, TextEdit in plain-text mode, or VS Code) — this strips Word's hidden formatting/smart quotes, which otherwise cause invisible errors in JSON.
Replace any curly/smart quotes (" " ' ') with straight quotes, or better, leave them — but if you do use straight double quotes " inside your text, they must be escaped as \" in JSON, or the file will break.
Join every paragraph with \n\n (literally the two characters backslash-n, twice) — that's how the body field represents paragraph breaks; the site's Markdown renderer turns that into separate <p> tags.
Open data/posts.json, find the posts array, and add a new object in the same shape as the existing ones:
   {
     "title": "Your Title",
     "slug": "your-title-slug",
     "tag": "Basics",
     "excerpt": "One-sentence summary.",
     "date": "2026-09-15",
     "date_display": "September 15, 2026",
     "image": "images/your-image.jpg",
     "body": "First paragraph.\n\nSecond paragraph with **bold** text.\n\nThird paragraph."
   }

Validate the JSON before saving — a single missing comma or unescaped quote will break the entire blog, not just this post. Paste it into a free JSON validator (e.g. jsonlint.com) if you're not sure.  

**Adding an image inside the body of a post**
The body field is Markdown, and Markdown's image syntax works directly inside it:
![Alt text describing the image](images/your-image.jpg)
======================================