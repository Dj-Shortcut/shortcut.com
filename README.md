# DJ-Shortcut Next.js site

This project is a deploy-ready Next.js App Router website with mobile-first sections for `#mixes`, `#gigs`, and `#contact`.

## Local development

```bash
npm install
npm run dev
```

## Production run

```bash
npm run build
npm run start
```

## Vercel first-deploy checklist

Use Next.js defaults unless there is a project-specific reason to override.

1. **Import / project setup**
   - Add New → Project → Import `Dj-Shortcut/shortcut.com`
   - Keep `main` as production branch
2. **Framework preset**
   - Framework: **Next.js** (auto-detected)
   - Root directory: `.`
3. **Build settings**
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: leave default/empty for Next.js
4. **Node runtime**
   - Use Vercel default runtime (recommended)
   - This repo also declares `"engines": { "node": ">=20" }`
5. **Environment variables**
   - None required for current feature set
6. **Domain strategy**
   - Validate first on `*.vercel.app`
   - Add `dj-shortcut.com` only after the initial deployment is stable
7. **Post-deploy smoke test**
   - `/` loads
   - `/cover.jpg` loads
   - browser console is clean

## QA checklist

- [ ] Mobile viewport sanity check (e.g. 390×844): hero, navigation anchors, and cards remain readable without horizontal scrolling.
- [ ] Lighthouse basic check on `/` (Performance, Accessibility, Best Practices, SEO) to verify no major regressions.
- [ ] Vercel-compatible build passes (`npm run build`) and root route (`/`) renders correctly in production (`npm run start`).
- [ ] Content missing cases:
  - [ ] Empty gigs array shows placeholder card/message.
  - [ ] Missing contact email shows DM-only copy.


## Preflight checklist

```bash
npm ci
npm run check:content
npm run lint
npm run build
```
