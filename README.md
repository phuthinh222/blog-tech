# Zero Technology

Zero Technology is a multilingual consumer technology review site built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, `next-intl`, and Supabase. English is the default locale; Vietnamese and Chinese use `/vi` and `/zh` prefixes. Product content is authored in Vietnamese and translated into `content/translations/products/`.

## Project structure

- `app/[locale]/` — localized pages, reviews, guides, policies, and author pages.
- `components/` — shared layout and review UI.
- `content/posts/` — Vietnamese source product records.
- `content/translations/products/` — English and Chinese product translations.
- `content/guides/` — localized guide JSON files.
- `lib/content.ts` — Supabase content queries and mapping.
- `lib/authors.ts` — disclosed editorial pseudonyms and category bios.
- `supabase/migrations/` — database schema and policy changes.
- `scripts/` — content import, translation import, and slug migration helpers.
- `seo-keywords.md` — keyword map and editorial SEO plan.
- `todo.md` — implementation status and remaining work.

## Local development

Use Node.js and pnpm. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local` for public content reads. Import scripts also require the service key documented in `supabase/README.md`; never commit secrets.

```bash
pnpm install
pnpm dev
```

## Content workflow

Follow [CLAUDE.md](CLAUDE.md) when adding or updating reviews. Keep claims traceable to sources, label compiled research as compiled, and never imply hands-on testing unless it happened. Editorial author names are English pseudonyms for category desks; the author pages and editorial policy identify them as pseudonyms rather than real individual reviewers.

## Affiliate status

Affiliate links are currently disabled in `lib/constants.ts` while the site builds readership. Amazon readiness requirements and the activation checklist are tracked in [todo.md](todo.md) and [supabase/README.md](supabase/README.md). Do not add live Amazon links, product prices, or Amazon-sourced images while the feature is disabled.

## Database setup

See [supabase/README.md](supabase/README.md) for migration order, content imports, and Amazon-related data guidance. Apply migrations through the Supabase Dashboard SQL Editor unless the project has been linked to the Supabase CLI.
