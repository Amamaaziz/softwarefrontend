# Admin Panel Frontend — Software House Website

React + Tailwind CSS admin dashboard built from the PRD (Section 8.2) and the MongoDB schema.
This is the **admin frontend only** — it expects the Node/Express/MongoDB backend (Section 8.3) to be running separately and expects the public site (Section 8.1) to consume the same backend independently.

---

## 1. Getting Started

```bash
npm install
cp .env.example .env      # adjust VITE_API_URL if your backend isn't proxied
npm run dev                # http://localhost:5174
```

The dev server proxies `/api/*` to `http://localhost:5000` (see `vite.config.js`) — update the `target` there to match wherever the backend team runs their server.

```bash
npm run build      # production build to /dist
npm run preview    # preview the production build locally
npm run lint
```

---

## 2. Folder Structure

```
src/
  api/                  # axios client + all REST calls (one file per concern)
    axiosClient.js       # base instance, auth header injection, silent token refresh
    authApi.js            # login / logout / me / forgot / reset
    resourceApi.js        # generic CRUD factory + one instance per module
  components/
    common/               # shared building blocks used across every module
      Button, Card, Badge, FormField (Input/Textarea/Select), DataTable,
      ConfirmDialog, Drawer, EmptyState, ImageUploader, RichTextEditor,
      TagInput, ToggleSwitch, Spinner, PageHeader
    layout/               # AdminLayout, Sidebar, Topbar
  context/
    AuthContext.jsx       # session state, role checks, auto-logout on token expiry
    ThemeContext.jsx       # light/dark mode (persisted)
  pages/
    auth/                 # Login, ForgotPassword, ResetPassword
    dashboard/             # Dashboard + StatCard
    services/ portfolio/ blog/ testimonials/   # Content Editor modules
    careers/               # Jobs + Applications (HR Manager)
    leads/                 # Contact/Quote submissions
    users/                 # Users & Roles (Super Admin)
    settings/              # Site Settings (Super Admin)
    logs/                  # Activity Logs (Super Admin)
    NotFound.jsx, Forbidden.jsx
  routes/
    ProtectedRoute.jsx     # requires authentication
    RoleRoute.jsx           # requires one of an allowed role list
  App.jsx                 # full route table
  main.jsx                # providers: Router, QueryClient, Theme, Auth, Toaster
  index.css               # Tailwind entry + design-token-aware base styles
```

**Why this shape:** every content module (Services/Portfolio/Blog/Testimonials/Jobs/Users/Logs) follows the exact same pattern —
a `List.jsx` built on the shared `DataTable` (search + sort + paginate) and a `Form.jsx` built on shared `FormField`/`ImageUploader`/`RichTextEditor`/`TagInput`. The pattern was solved once in `DataTable.jsx` and the module forms, then reused, per PRD 8.2.

---

## 3. Design Tokens (from your color scheme)

`tailwind.config.js` encodes your provided light/dark palette as semantic tokens so components never hardcode hex values:

| Token | Light | Dark | Used for |
|---|---|---|---|
| `canvas` | `#FFFFFF` | `#0F172A` | Page background |
| `surface` | `#F8FAFC` | `#1E293B` | Cards, containers |
| `heading` | `#0F172A` | `#F8FAFC` | Headings |
| `body` | `#475569` | `#94A3B8` | Body text |
| `cta` | `#00D2C4` | `#00E6D7` | Primary buttons, active nav |
| `cta-hover` | `#00B3A6` | `#00D2C4` | Hover state |

Dark mode toggles via a `dark` class on `<html>`, managed by `ThemeContext` and persisted to `localStorage`. Use classes like `bg-surface dark:bg-surface-dark` throughout — this is already done in every shared component.

---

## 4. Roles & Route Protection

Matches PRD 8.2 exactly:

| Role | Access |
|---|---|
| `super_admin` | Everything, including Users & Roles, Site Settings, Activity Logs |
| `content_editor` | Services, Portfolio, Blog, Testimonials, Leads |
| `hr_manager` | Job Postings, Applications, Leads |

- `ProtectedRoute` — redirects to `/login` if not authenticated.
- `RoleRoute` — wraps route groups in `App.jsx`; renders a 403 `Forbidden` page if the user's role isn't allowed.
- `Sidebar.jsx` hides nav items the current role can't access.

**This is a UI convenience only.** The backend must enforce the same rules independently (PRD Section 9) — never rely on the frontend check alone.

---

## 5. Auth Flow

- Access token kept in `sessionStorage` (cleared on tab close); refresh token expected as an `httpOnly` cookie the backend sets on login (`withCredentials: true` in `axiosClient.js`).
- A 401 response triggers one silent `POST /auth/refresh` call and retries the original request; concurrent 401s are queued so only one refresh call fires.
- `AuthContext` schedules an auto-logout ~1 minute before typical access-token expiry (adjust the `14 * 60 * 1000` constant in `AuthContext.jsx` to match your backend's real expiry).
- Forgot/Reset Password pages call `POST /auth/forgot-password` and `POST /auth/reset-password/:token`.

---

## 6. Expected API Contract

The admin panel calls a REST API at `VITE_API_URL` (default `/api/v1`). Every content resource follows the same shape via `createResourceApi()` in `src/api/resourceApi.js`:

```
GET    /{resource}              -> { data: [...], total, page, ... }
GET    /{resource}/:id          -> { data: {...} }
POST   /{resource}              -> { data: {...} }
PATCH  /{resource}/:id          -> { data: {...} }
DELETE /{resource}/:id          -> { data: { success: true } }
PATCH  /{resource}/:id/publish  -> { data: {...} }   // isPublished toggle
```

Resources wired up: `/services`, `/portfolio`, `/blogs`, `/testimonials`, `/jobs`, `/job-applications`, `/leads`, `/users`, `/activity-logs`.

Additional endpoints:
```
POST /auth/login            { email, password } -> { user, accessToken }
POST /auth/logout
GET  /auth/me                -> { user }
POST /auth/refresh            -> { accessToken }
POST /auth/forgot-password   { email }
POST /auth/reset-password/:token  { password }

GET  /dashboard/stats  -> { leadsCount, leadsTrend, openJobsCount,
                            publishedPortfolioCount, publishedBlogCount,
                            leadsOverTime: [{ date, count }] }

GET  /settings         -> { data: {...} }
PATCH /settings         { ...fields } -> { data: {...} }

POST /media/upload  (multipart/form-data, field name "file") -> { url }
```

Field names mirror `Database-Schema.md` exactly (e.g. `isPublished`, `isFeatured`, `subServices`, `technologies`, `seoMeta`). If the backend renames or reshapes any field, update the corresponding Zod schema in that module's `Form.jsx` — nowhere else.

Note: the schema you provided intentionally excludes `faqs` and `newsletterSubscribers` (per its own note) — this admin panel does the same and has no nav entries or pages for either. Say the word if you want those modules scaffolded back in.

---

## 7. Notes for Integration with the Other Two Roles

- **Field names/shapes**: this build assumes the collections exactly as documented in `Database-Schema.md`. Confirm with the backend dev before they diverge.
- **Design tokens**: the public frontend should reuse the same `tailwind.config.js` color tokens so both surfaces feel consistent, per PRD Section 9.
- **Demo data**: until the real backend is ready, you can stub `resourceApi.js` calls with static JSON or point `VITE_API_URL` at a mock server (e.g. `json-server`) matching the contract above.

---

## 8. What's Deliberately Left as TODO

- Wiring a real rich-text-to-sanitized-HTML step is the backend's job (PRD 8.3 "keep every piece of data validated... no relying on the frontend").
- Email notifications, spam protection, and file-upload virus scanning are backend responsibilities.
- Lighthouse/accessibility pass should be run against a deployed build once real content and images are in place.
