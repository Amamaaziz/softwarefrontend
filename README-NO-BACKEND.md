# Running the admin panel + customer site with no backend

Both apps now run entirely in the browser. There is no Express server, no
MongoDB, no Prisma — and, importantly, **they are no longer two disconnected
demos**. They share one mock database, so what an admin publishes actually
shows up on the public website, and what a visitor submits actually shows up in
the admin panel.

---

## 1. Run it

```bash
# once
npm run install:all

# then, in two terminals
npm run dev:site     # public website  → http://localhost:5173
npm run dev:admin    # admin panel     → served through the site
```

Then open:

| | URL |
|---|---|
| Customer site | http://localhost:5173 |
| Admin panel | **http://localhost:5173/admin** |

> ⚠️ **Always open the admin panel at `:5173/admin`, not `:5174`.**
> The database lives in `localStorage`, and browsers scope `localStorage` per
> origin. The site's Vite config proxies `/admin` to the admin dev server so
> both apps land on the **same origin** and therefore share **one database**.
> Open `:5174` directly and you get a second, separate copy of the data.

### Demo logins

Password for every account: **`demo1234`**

| Email | Role | What they can reach |
|---|---|---|
| `admin@demo.com` | super admin | everything |
| `bilal@nexbyte.dev` | content editor | services, portfolio, blog, testimonials, leads |
| `sara@nexbyte.dev` | HR manager | jobs, applications, leads |

Signing in as different roles is how you demo the role-based route guards.

---

## 2. What to demo

1. **Publish flow.** Admin → Services → New. Fill in a title and description,
   tick *Published*, save. Switch to the site's `/services` tab — the new
   service is already there, no refresh needed. Untick *Published* and it
   disappears.
2. **Draft vs published.** Admin → Blog. The seeded "Behind the Scenes" post is
   a draft, so the public blog doesn't show it. Set it to *Published* and it
   appears with today's date.
3. **Contact form → Leads.** Fill in the site's contact form. Admin → Leads:
   the submission is at the top, marked `new`. Move it through
   `contacted → converted`.
4. **Careers → Applications.** Apply for a role on the site. Admin →
   Careers → Applications: the application is there, linked to the right job.
5. **Activity log.** Every admin write is recorded. Admin → Activity Logs.
6. **Settings.** Change the contact email in Admin → Settings, reload the site —
   the footer and contact page pick it up.

**Reset the demo data** any time from the browser console:

```js
resetDemoData()
```

---

## 3. How it works

```
                    ┌──────────────────────────────┐
                    │   localStorage["nexbyte.db.v1"]  ← the "database"
                    └───────────────┬──────────────┘
                     reads/writes   │   reads/writes
              ┌────────────────────┴────────────────────┐
              │                                         │
   frontend/src/lib/api.js                admin-panel/src/data/index.js
   (public site)                          (admin panel)
              │                                         │
      pages via useAsync()                pages via React Query
```

| File | Role |
|---|---|
| `*/src/data/seed.js` | The starting data. One canonical copy, duplicated into both apps. |
| `*/src/data/mockDb.js` | The database engine: `localStorage` persistence, CRUD, slugs, cross-tab change events. |
| `admin-panel/src/data/index.js` | Admin's data API (`servicesApi`, `leadsApi`, …). Same method names a REST client would have. |
| `frontend/src/lib/api.js` | Site's data API. Reads published records; writes leads and applications. |
| `frontend/src/lib/useAsync.js` | Subscribes to database changes, so open pages refetch when the admin saves. |

Data **persists across refreshes** (it used to reset — everything was held in
memory). Two browser tabs stay in sync via `BroadcastChannel` and the `storage`
event.

### What is still faked

- **Passwords.** Nothing is hashed or stored; any known email + `demo1234`
  signs in. There is no token.
- **File uploads.** Image fields take URLs. A CV attached to a job application
  keeps its filename only — there is nowhere to store the bytes.
- **Email.** Nothing is sent. A contact form writes a lead row; that's it.
- **Storage limit.** `localStorage` holds ~5 MB. Fine for text; don't paste
  giant base64 images.

---

## 4. Swapping in a real backend later

Nothing in any page component knows the backend is fake, because both data
layers already return `{ data }` / `{ data, total }` the way an axios call
would. When the API is ready:

1. In `admin-panel/src/data/index.js`, replace the `createCollection(...)`
   calls with axios calls — `list: () => axios.get('/api/services')`, etc.
2. In `frontend/src/lib/api.js`, replace each function body the same way.
3. Delete `mockDb.js` and `seed.js` from both apps.
4. In `AuthContext.jsx`, swap the fake `login` for a real `POST /api/auth/login`
   and store the JWT instead of the session object.

No page, form, table, or route has to change.

---

## 5. Files changed in this pass

**New**
- `frontend/src/data/seed.js`, `frontend/src/data/mockDb.js`
- `admin-panel/src/data/seed.js`, `admin-panel/src/data/mockDb.js`
- `frontend/src/components/ui/RichText.jsx`
- `shared/` (reference copies of the two shared modules)

**Rewritten**
- `admin-panel/src/data/index.js` — now persistent, shared, with slug
  generation and activity logging (was in-memory; `seedData.js` and
  `resourceStore.js` are gone)
- `frontend/src/lib/api.js` — reads the shared DB, writes leads/applications
- `frontend/src/data/mockData.js` — now a thin compat layer over the DB
- `frontend/src/lib/useAsync.js` — refetches on DB changes
- `admin-panel/src/context/AuthContext.jsx` — role-based demo logins

**Edited**
- `frontend/vite.config.js` — proxies `/admin` (this is the same-origin trick)
- `admin-panel/vite.config.js` — `base: '/admin/'`
- `admin-panel/src/main.jsx` — router `basename`
- `admin-panel/src/pages/auth/Login.jsx` — demo credentials hint
- `frontend/src/pages/{Service,Portfolio,Blog,Job}Detail.jsx` — render admin
  rich text via `RichText`
- `frontend/src/index.css` — `.rich-text` styles
- `package.json`, `admin-panel/package.json` — run/build scripts

Two bugs fixed along the way: the admin Applications page called
`applicationsApi.delete()`, which didn't exist (only `remove()` did), and
records created in the admin panel had no `slug`, so the public site's
`/services/:slug` routes could never have found them.
