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

## Preview locally

Just open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000
    # then visit http://localhost:8000
