Drop certificate files here (PDF or image).

Then point to them from `src/content/site.config.js`, in the
`certificates.items[].file` field, e.g.:

  file: "/certificates/ielts.pdf"

The path is relative to this `public/` folder's `certificates/`
subfolder — whatever you name the file, use that same name here.
Leave `file: null` for a credential that doesn't have a file yet
(its card just won't show a "View certificate" link).
