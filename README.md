# Rajan Tarakhala — Portfolio (v2)

A from-scratch rebuild: dark theme (indigo / lavender / ember — no green), a
real component architecture, cleaned & compressed media, and a few genuinely
interactive pieces (an editable easing curve in the hero, a scrubbable logo
transformation on the SCTDA case study, a ⌘K command menu).

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

Requires Node 18+.

## Before you publish — personalize these

1. **Email address** — `src/data/site.ts` → `email`. Currently a placeholder
   (`hello@rajantarakhala.com`).
2. **Social links** — `src/data/site.ts` → `socials`. Empty by default; add
   `{ label: "Instagram", href: "https://instagram.com/…" }` entries and they
   appear automatically in the footer and contact section.
3. **Fonts** — the display typeface (NeueMachina) ships in `public/fonts/`.
   Confirm your license covers the way it's used here before you publish
   publicly; swap the `@font-face` block in `src/styles/theme.css` if needed.

## Where things live

- `src/data/site.ts` — your name, bio, skills, software list.
- `src/data/projects.ts` — every case study's copy, chapters (year tabs),
  sections, and which media files each section shows. Add a new project by
  adding one object to the `projects` array.
- `src/assets/` — every image, already optimized to WebP, with a typed
  `img("key")` helper so you get autocomplete and can't typo a path.
- `src/components/` — organized by area: `layout/` (nav, footer, command
  menu), `home/` (hero, about, toolkit, etc.), `work/` (project-page pieces),
  `ui/` (buttons, chips, the lightbox, toasts).
- `src/styles/theme.css` — every color and easing curve as a CSS variable.
  Change a value here and the whole site updates.

## Adding a new project

Open `src/data/projects.ts`, copy the shape of an existing entry in the
`projects` array (e.g. `sctda`), and fill in your own copy, images (add them
to `src/assets/` first — see `index.ts` in that folder for the pattern), and
chapters. The Works index, home page grid, and routing all pick it up
automatically — nothing else to touch.
