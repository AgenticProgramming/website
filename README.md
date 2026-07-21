# agenticprogrammingbook.com

Landing page for the book *Agentic Programming* by Jerod W. Wilkerson.

Static site (plain HTML/CSS, no build step) hosted on GitHub Pages with a custom domain.

© 2026 Jerod W. Wilkerson. All rights reserved. Site code and content are not licensed for reuse.

## Files

- `index.html` — the page
- `styles.css` — styles
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
(columns: Timestamp, Edition, Chapter, Quoted text, Type, Comment, Email).
A hidden honeypot field is checked client- and server-side; bot submissions are
dropped without being written to the Sheet.

One-time setup (in your Google account):

1. Create a Google Sheet named **Agentic Programming Feedback**. In row 1 of the
   first tab, enter the headers: `Timestamp`, `Edition`, `Chapter`,
   `Quoted text`, `Type`, `Comment`, `Email`.
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

## Preview locally

Just open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000
    # then visit http://localhost:8000
