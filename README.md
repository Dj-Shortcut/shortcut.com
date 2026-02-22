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

## Vercel deploy notes

- Framework preset: **Next.js**
- Root route `/` is served by `app/page.tsx`.
- Build command: `npm run build`
- Start command: `npm run start`

## QA checklist

- [ ] Mobile viewport sanity check (e.g. 390×844): hero, navigation anchors, and cards remain readable without horizontal scrolling.
- [ ] Lighthouse basic check on `/` (Performance, Accessibility, Best Practices, SEO) to verify no major regressions.
- [ ] Vercel-compatible build passes (`npm run build`) and root route (`/`) renders correctly in production (`npm run start`).
- [ ] Content missing cases:
  - [ ] Empty gigs array shows placeholder card/message.
  - [ ] Missing contact email shows DM-only copy.
