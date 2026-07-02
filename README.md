# Matos Distribution — Marketing Site

Static one-page marketing site for Matos Distribution: smart, cashless vending
machines for nightlife venues in Puerto Rico. Plain HTML/CSS/vanilla JS — no
build step, no dependencies.

## Structure

| File | Purpose |
|---|---|
| `index.html` | English site (all sections, meta tags, JSON-LD) |
| `es/index.html` | Spanish site — keep content in sync with the English page |
| `styles.css` | Monochrome theme, responsive layout, scroll reveals |
| `script.js` | Mobile nav, reveals, contact form, WhatsApp buttons (shared by both languages) |
| `og-image.png` | Social share image (1200×630) |
| `robots.txt` / `sitemap.xml` | Crawler directives (sitemap lists both language versions) |

## Local preview

Any static server works:

```sh
python3 -m http.server 4173
# → http://localhost:4173
```

## Configuration

- **Contact form**: submissions post to Formspree
  (`FORM_ENDPOINT` in `script.js`) and are delivered to
  `ematos@matosdistribution.com`.
- **WhatsApp**: set `WHATSAPP_NUMBER` in `script.js` (digits only, with
  country code, e.g. `17875551234`). While empty, all WhatsApp buttons stay
  hidden on both language versions.
- **Domain**: `index.html`, `robots.txt`, and `sitemap.xml` reference
  `https://www.matosdistribution.com`.

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
