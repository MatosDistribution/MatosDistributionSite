# Matos Distribution — Marketing Site

Static one-page marketing site for Matos Distribution: smart, cashless vending
machines for nightlife venues in Puerto Rico. Plain HTML/CSS/vanilla JS — no
build step, no dependencies.

## Structure

| File | Purpose |
|---|---|
| `index.html` | The entire site (all sections, meta tags, JSON-LD) |
| `styles.css` | Monochrome theme, responsive layout, scroll reveals |
| `script.js` | Mobile nav, reveal animations, contact form handling |
| `og-image.png` | Social share image (1200×630) |
| `robots.txt` / `sitemap.xml` | Crawler directives |

## Local preview

Any static server works:

```sh
python3 -m http.server 4173
# → http://localhost:4173
```

## Before launch — TODOs

1. **Contact form**: create a free form at [formspree.io](https://formspree.io)
   (point it at `ematos@matosdistribution.com`), then paste the endpoint into
   `FORM_ENDPOINT` at the top of `script.js`. Until then the form falls back to
   opening the visitor's mail app.
2. **Social links**: replace the two `href="#"` placeholders in the contact
   section of `index.html` with the real Instagram and LinkedIn URLs
   (search for `TODO`).
3. **Domain**: `index.html`, `robots.txt`, and `sitemap.xml` assume
   `https://www.matosdistribution.com` — update if the domain differs.

## Deploy (Vercel)

```sh
git init && git add -A && git commit -m "Initial site"
gh repo create matos-distribution-site --private --source=. --push
```

Then at [vercel.com/new](https://vercel.com/new): import the repo, framework
preset "Other", no build command, output directory `./` — deploy. Every push to
`main` redeploys automatically.

### Custom domain DNS

In Vercel → Project → Settings → Domains, add the domain, then at the
registrar:

| Type | Name | Value |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Vercel provisions HTTPS automatically once DNS propagates.
