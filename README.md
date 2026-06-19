# alviKRON

Official website for **alviKRON** (ALVIKRON) — the ALVINA and creator-economy themed KRON Family memecoin on Base.

- **Site:** https://www.alvikron.com
- **Contact:** team@alvikron.com
- **Primary KRON gateway:** https://www.ekron.network
- **Phase:** II satellite (queued for fair launch)
- **Tokenomics:** 10B fixed supply · 80/10/5/5 · fair launch only · no presale

## Structure

Mirrors the [eKRON](https://github.com/tvk-group/eKRON) site architecture:

| Path | Purpose |
|------|---------|
| `/` | Homepage with consent gate, i18n, SEO, FAQs |
| `/verify/` | On-chain registry (TBD until deployment) |
| `/standard/` | KRON Fair Launch Standard |
| `/family/` | Full 7-token roster with www links |
| `/program/` | Fair Launch Program docs |
| `/legal/` | Terms, privacy, cookies, risk |
| `/404.html` | Custom 404 |

## Features

- 12-language i18n (`/assets/i18n/`)
- Shared design system (`/assets/css/kron.css`) — alviKRON pink theme
- On-chain registry via `kron-data.js` (addresses TBD/queued)
- Legal + cookie consent gate
- SEO: robots.txt, sitemap.xml, hreflang, JSON-LD, 10 FAQs
- Mobile navigation

## Brand assets

Official logos live in [`assets/brand/`](assets/brand/README.md).

**32×32 SVG icon (direct download):**

https://github.com/tvk-group/AlviKRON/raw/main/assets/brand/icon-32.svg

| File | Purpose |
|------|---------|
| `assets/brand/icon-32.svg` | Favicon, BaseScan token icon, wallets |
| `assets/brand/icon.svg` | Navbar / UI |
| `assets/brand/logo-full.svg` | Vector wordmark |
| `assets/brand/logo-full.png` | Social / OG image |

## Deploy

Static site — deploy to Vercel or any static host. `vercel.json` included.

```bash
# Local preview
python3 -m http.server 8080
```

## KRON Family

| Token | Site | Phase |
|-------|------|-------|
| eKRON | www.ekron.network | I (gateway) |
| soviKRON | www.sovikron.com | II |
| mineKRON | www.minekron.com | II |
| **alviKRON** | **www.alvikron.com** | **II** |
| puriKRON | www.purikron.com | III |
| puppyKRON | www.puppykron.com | III |
| warpKRON | www.warpkron.com | III |

Contract addresses for alviKRON publish on `/verify/` after fair-launch deployment on Base.
