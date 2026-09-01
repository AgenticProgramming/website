# agenticprogrammingbook.com

Landing page for the book *Agentic Programming* by Jerod W. Wilkerson.

Static site (plain HTML/CSS, no build step) hosted on GitHub Pages with a custom domain.

© 2026 Jerod W. Wilkerson. All rights reserved. Site code and content are not licensed for reuse.

## Files

- `index.html` — the page
- `styles.css` — styles
- `feedback/` — reader-feedback form (see below)
- `errata/` — errata page (pre-release notice now; post-print corrections later)
- `whats-new/` — unlisted release-notes page (see below)
- `examples/` — book examples page, rendered from `examples/book-examples/manifest.json`
- `favicon.svg` — favicon (AI Fluency Ladder motif)
- `CNAME` — custom domain for GitHub Pages (`agenticprogrammingbook.com`)
- `.nojekyll` — tells Pages to serve files as-is (no Jekyll processing)

## Deploy (GitHub Pages)

1. Push this folder to `AgenticProgramming/website` (public repo, no license).
2. Repo **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main` / `/ (root)`.
3. The custom domain is picked up automatically from `CNAME`.
4. Configure DNS at your registrar (see below).
5. Once DNS resolves, tick **Enforce HTTPS** (cert provisioning can take a few minutes up to ~an hour).

## DNS records

Apex domain `agenticprogrammingbook.com` — four A records and four AAAA records pointing at GitHub Pages:

    A     @   185.199.108.153
    A     @   185.199.109.153
    A     @   185.199.110.153
    A     @   185.199.111.153
    AAAA  @   2606:50c0:8000::153
    AAAA  @   2606:50c0:8001::153
    AAAA  @   2606:50c0:8002::153
    AAAA  @   2606:50c0:8003::153

`www` subdomain — CNAME to the org's Pages host:

    CNAME  www   agenticprogramming.github.io.

## TODO (placeholders to wire up later)

- **Buy link:** replace the `href="#"` on the *Get the Book on Leanpub* button in `index.html` with the real Leanpub URL once the book exists.
- **Email signup:** done — MailerLite embedded form (account `2457989`, form `4Bu8OJ`) in the `#notify` section; the hero *Get Notified* button scrolls to it. The MailerLite Universal loader is just before `</body>`. Before the first send, authenticate the sending domain (DKIM/SPF) in MailerLite.
- **Social image:** add a cover image and uncomment the `og:image` meta tag in `index.html`.

## Feedback form (`/feedback`)

Reader-feedback form at `feedback/index.html`. Submissions POST to a Google Apps
Script web app that appends one row per submission to a Google Sheet
(columns: Timestamp, Edition, Chapter, Section, Quoted text, Type, Comment, Name, Email).
A hidden honeypot field is checked client- and server-side; bot submissions are
dropped without being written to the Sheet.

One-time setup (in your Google account):

1. Create a Google Sheet named **Agentic Programming Feedback**. In row 1 of the
   first tab, enter the headers: `Timestamp`, `Edition`, `Chapter`, `Section`,
   `Quoted text`, `Type`, `Comment`, `Name`, `Email`.
2. In the Sheet: **Extensions → Apps Script**. Delete the placeholder code and
   paste the contents of `feedback/apps-script.gs`. Save.
3. **Deploy → New deployment → Select type: Web app.**
   - Description: anything (e.g. "feedback form").
   - Execute as: **Me**.
   - Who has access: **Anyone**. (Required so the form can POST without a
     Google login. The URL is unguessable and the script can only append to
     this Sheet.)
4. Click **Deploy**, authorize when prompted (you'll see an "unverified app"
   warning for your own script — Advanced → Go to project), and copy the
   **Web app URL** (ends in `/exec`).
5. Paste that URL into the `ENDPOINT` constant near the bottom of
   `feedback/index.html`, replacing `PASTE_APPS_SCRIPT_WEB_APP_URL_HERE`.
   Commit and push.

If you later edit the script, use **Deploy → Manage deployments → Edit →
New version** so the same `/exec` URL keeps working.

### Email notification on each submission

The script emails `author@agenticprogrammingbook.com` on every submission
(`MailApp.sendEmail`, wrapped in try/catch so a mail failure never loses the
row). Two non-obvious things are required for this to actually reach your inbox:

1. **Declare the mail scope in the manifest.** In **Project Settings**, enable
   *Show "appsscript.json" manifest file in editor*, then add an `oauthScopes`
   array:

   ```json
   "oauthScopes": [
     "https://www.googleapis.com/auth/script.send_mail",
     "https://www.googleapis.com/auth/spreadsheets.currentonly"
   ]
   ```

   Without this, Apps Script never prompts for the mail permission, so
   `MailApp.sendEmail` throws "no permission" at runtime — and the try/catch
   swallows it silently (nothing sends, no visible error). After adding the
   scopes, Run `doPost` once from the editor and complete the authorization
   prompt (Advanced → Go to project → Allow), then redeploy a new version.

2. **Add a Gmail filter so the notification reaches your Inbox.** Because the
   mail is sent from your own Google account to `author@…` (which forwards back
   to that same Gmail), Gmail dedups it out of the Inbox and auto-marks it read.
   Create a filter — matches `to:author@agenticprogrammingbook.com` +
   subject `New book feedback`; actions: star, apply label **Book Feedback**,
   mark important, never send to spam — to surface new feedback. (Self-sent mail
   is auto-read, so it won't appear in Priority Inbox's "important and unread"
   section; a Multiple Inboxes panel on the *Book Feedback* label keeps it
   visible at the top.)

## Errata page (`/errata`)

Static page. While the book is pre-release it shows a notice; once the book is in
print, unhide the `#errata-list` div in `errata/index.html` and add one `.erratum`
entry per correction (date, location, description — a commented template is in the
file), newest first.

## What's New page (`/whats-new`)

Unlisted release-notes page for readers who are mid-book when a large Leanpub
update lands. It answers one question: *what do I have to go back and read?*
Three tiers — new sections, sections whose conclusions moved, everything else.

**It is deliberately unlisted.** It is not in the site nav, the footer nav on
other pages, or the home page, and it carries
`<meta name="robots" content="noindex, nofollow">`. It is reached only from the
Leanpub release email. (Unlisted is not private — anyone with the link can read
it, and links get forwarded.)

To add the next release: copy the `<section class="release">` block, put the new
one **above** the existing one, and change the older one's wrapper to
`<details class="release release-past">` with the `<h2 class="release-date">`
becoming `<summary class="release-date">`. It then collapses. A comment in the
file spells this out. Older releases stay on the page rather than being deleted.

Styles live in the `/* What's New */` block at the end of `styles.css`. Prose
runs at the narrow width inside the wide container; the Tier 1/2 tables use the
full width and stack into labeled blocks below 700px.

## Book examples page (`/examples`)

Renders every book example from `examples/book-examples/manifest.json` at page load —
no build step. Each example gets a copy button, a download link to its standalone
file at `examples/book-examples/<dir>/<filename>`, and a stable anchor (the filename
without extension). Per-chapter and all-examples ZIPs are generated client-side from
the manifest, so they can never drift from the page.

To add or update examples: regenerate or edit `examples/book-examples/`
(`manifest.json` **and** the matching standalone file — the file must be the
manifest `content` plus a trailing newline). No markup changes needed.

## Preview locally

Just open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000
    # then visit http://localhost:8000
