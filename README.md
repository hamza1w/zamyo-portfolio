# ZAMYO — Portfolio

A single-page portfolio built with React + Vite. Plain CSS, no UI framework or animation library — small bundle, fast load, easy to read.

## 1. Run it locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. `npm run build` outputs a static site to `dist/`.

## 2. Edit content

Everything text/links/projects lives in **`src/content/site.config.js`** — one file, plain JavaScript objects. You should never need to touch a component's `.jsx` file just to change wording, a link, or a project.

To add/remove a portfolio project, add/remove an entry in the `projects` array in that file — the grid and lightbox update automatically. Same idea for `skills.tools` (the software marquee) and `clients.names` (the "worked with" marquee) — just add or remove names in the array.

## 3. Replace media

Nothing is hardcoded to stock imagery — every image/video is a placeholder that shows a designed empty state until you drop in the real file at the same path. Replace these in `/public`:

| What | Path | Notes |
|---|---|---|
| Hero portrait(s) | `public/media/portrait-1.jpg`, `-2`, `-3`… | ~1200×1500, JPG/WEBP. Add/remove entries in `hero.portraits` in the config — hovering the frame cycles through them, tapping does the same on touch devices. This is the only photo spot on the site. |
| Showreel video | `public/media/showreel.mp4` | H.264 mp4, keep under ~15MB |
| Showreel poster frame | `public/media/showreel-poster.jpg` | A still from the video |
| Project thumbnails | `public/portfolio/project-1.jpg` … `project-5.jpg` | Match each project's `ratio` in the config (9/16 or 16/9) |
| Project clips | `public/portfolio/project-1.mp4` … `project-5.mp4` | Played in the lightbox on click |
| Social preview image | `public/media/og-cover.jpg` | 1200×630, shown when the link is shared |
| Favicon | `public/favicon.svg` | Currently a placeholder "Z" mark |

Compress video before adding it — large files will hurt load time on mobile.

## 4. Wire up the contact form

The form posts to `contact.form.action` in `site.config.js`. Two easy options:

- **Netlify Forms** (if hosting on Netlify): add `data-netlify="true"` and `name="contact"` to the `<form>` in `src/components/Contact.jsx`, and set the action to `/` or remove it — Netlify detects the form at build time. See Netlify's forms docs.
- **Formspree** (works anywhere): create a form at formspree.io, then paste your endpoint into `contact.form.action`.

Email and WhatsApp links work immediately from the config — no setup needed.

## 5. Deploy (Netlify)

1. Push this project to a GitHub repo.
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Build command `npm run build`, publish directory `dist` — already set in `netlify.toml`, so Netlify should detect these automatically.
4. Deploy. Connect a custom domain from Netlify's Domain settings whenever you're ready.

Drag-and-drop works too: run `npm run build` locally and drag the `dist` folder into Netlify's dashboard.

## 6. Project structure

```
src/
  content/site.config.js   ← all editable content
  components/              ← one component + one .css file per section
  hooks/useReveal.js        ← scroll-reveal (IntersectionObserver)
  styles/                   ← variables.css (design tokens) + global.css
public/
  media/                    ← portrait, about photo, showreel
  portfolio/                ← project thumbnails + clips
```

Colors, type scale, and spacing are all CSS custom properties in `src/styles/variables.css` — change the palette or fonts there without touching component files.
