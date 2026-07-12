# Nexbyte — Public Website (User-Side Frontend)

React (Vite) + Tailwind CSS build of the public-facing site described in the PRD (Section 8.1).
Currently wired to **mock data** (`src/data/mockData.js`) so every page renders without a backend.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## What's included

- **Pages:** Home, About, Services (list + detail), Portfolio (list + detail, filterable by tech),
  Blog (list + detail, searchable + paginated), Careers (list + apply form), Contact (form + map),
  Testimonials, Privacy Policy, Terms & Conditions, 404.
- **Shared component library** (`src/components/ui`): Button, Card, Badge, Input/Textarea,
  SectionHeading, Pagination, Spinner, EmptyState, ErrorState, Seo.
- **Every data-driven page handles four states:** loading (spinner), empty, error (with retry), and loaded —
  via the `useAsync` hook in `src/lib/useAsync.js`.
- **Forms:** Contact and Job Application forms use `react-hook-form` + `zod` for client-side validation
  that mirrors the backend's required fields (see Database-Schema.md).
- **Dark mode:** toggle in the navbar, persisted to `localStorage`, using the exact light/dark color
  tokens you provided (mapped in `tailwind.config.js`).
- **Design system:** colors, type scale (Space Grotesk / Inter / JetBrains Mono), and spacing are all
  defined once in `tailwind.config.js` and `src/index.css` — no ad-hoc inline styles.

## Connecting to the real backend

Swap the function bodies in `src/lib/api.js` from mock/in-memory data to real Axios calls, e.g.:

```js
import axios from 'axios'
export const getServices = () => axios.get('/api/services').then(r => r.data)
```

Nothing in the pages needs to change — they all consume `src/lib/api.js` through the `useAsync` hook,
so this is the only file that needs to change when the backend is ready.

## Notes

- Image URLs currently point to Unsplash/Pravatar placeholders — swap for real assets (or Cloudinary/S3
  URLs from the backend) before launch.
- `npm install` requires network access, which wasn't available in the environment this was generated in,
  so dependencies haven't been installed or build-verified here — run `npm install` locally first.
