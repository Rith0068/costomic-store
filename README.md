# LUMIÈRE — Cosmetics Brand Website

Front-end web application built for **Flash Solution** (Zürich, Switzerland) for the client
**Mr. Kim MinJuu**, owner of the LUMIÈRE cosmetics brand.

> React front end plus a small Express API. The store data is persisted as JSON under
> `server/data/`. The seed catalogue is still sourced from `src/data/products.js`.

---

## Tech stack

| Layer     | Choice                                  |
| --------- | --------------------------------------- |
| Framework | React 19 (function components + hooks)  |
| Build     | Vite 8                                  |
| Routing   | React Router 7 (SPA, client-side routes)|
| Styling   | Tailwind CSS v4 (CSS-first `@theme`)   |
| API       | Express 5 (JSON file store)             |
| Auth      | express-session + bcryptjs              |
| Lint      | oxlint                                  |

## Getting started

```bash
npm install
cp .env.example .env    # then set ADMIN_PASSWORD and SESSION_SECRET
npm run dev             # API on :3001 + Vite on :5173
npm run build           # production build into dist/
npm start               # Express serves dist/ and the API together
npm run lint            # run oxlint
```

### Signing in to the admin panel

`npm run dev` starts both processes — the API has to be running or the panel cannot load.

1. Open `http://localhost:5173/admin` (you are redirected to `/login?mode=admin`).
2. Sign in with `ADMIN_EMAIL` and the `ADMIN_PASSWORD` from `.env` (minimum 12 characters).
   The administrator account is created automatically on first server start.

`SESSION_SECRET` signs the session cookie. Without it the server still runs, but sessions
do not survive a restart.

---

## Features

**Navigation & layout**
- Sticky header that gains a frosted-glass background on scroll, with an announcement bar
- Responsive layout: mobile (single column) → tablet → desktop (`lg` breakpoint at 1024px)
- Slide-in mobile navigation drawer with body-scroll lock and `Escape` to close
- Slide-in cart drawer with a free-shipping progress bar

**Home page**
- Hero, trust bar, marquee, bestsellers, category grid
- **Routine finder** — interactive accordion that builds a 3-step routine from the selected skin concern
- Brand philosophy (process steps), testimonials, FAQ accordion

**Products page**
- Live search across name, description and ingredient list
- Category filter, skin-type filter, and 5 sort orders
- URL-synced category filter via query params (`/products?category=serum`) so filtered views are shareable
- Empty state with a "clear filters" recovery action
- Results count announced via `aria-live`

**Product detail**
- Gallery, variant/size selector, quantity stepper, add-to-bag with confirmation
- Tabbed panel: description, how to use, ingredients, shipping
- Breadcrumbs, related products, per-page `document.title`

**Cart & checkout**
- Server-backed cart, scoped to the session and merged into the account on sign-in
- Quantity editing, line removal, live subtotal, free-shipping progress bar
- Checkout requires an account; orders are recorded and listed in the admin panel

**Admin panel** (`/admin`, admin role only)
- Fixed sidebar navigation with a slide-in drawer on mobile; the site chrome is
  deliberately absent so the panel reads as a standalone tool
- **Overview** — revenue, orders, customers, average order value, a 14-day revenue
  chart, best sellers, stock-on-hand and recent orders
- **Orders** — search, status filter, expandable line items, inline status changes
- **Catalogue** — full product CRUD, wired to the API
- **Inventory** — stock levels per product with inline steppers, low/out-of-stock filters
- **Customers** — accounts, order counts and lifetime spend
- **Settings** — store details, announcement bar, free-shipping threshold, low-stock alert

**About** — brand story, vertical timeline, values, process, sustainability metrics
**Contact** — validated enquiry form, 4 contact methods, office details, shipping table, FAQ

---

## Accessibility

- Semantic landmarks (`header` / `nav` / `main` / `footer`) and a skip-to-content link
- One `<h1>` per page, no heading-level skips
- All icon-only controls have `aria-label`; all form fields are labelled
- Cart drawer and mobile menu: `role="dialog"`, `aria-modal`, `Escape` to dismiss, scroll lock
- Accordions use `aria-expanded` / `aria-selected`; filters use `aria-pressed`
- Live region announces filtered result counts
- `prefers-reduced-motion` disables all animation
- Interactive targets padded to a comfortable touch size

## Responsive design

Verified with no horizontal page overflow at 390px, 820px and 1440px. All imagery uses
`object-cover` on a fixed `aspect-[4/5]` frame, so any photo crop composes identically at every
breakpoint. Card images are `loading="lazy"`; above-the-fold images load eagerly.

## Project structure

```
server/
├── index.js                  # Express app, routes, session setup
├── analytics.js              # summary/series/inventory/customer derivations
├── auth.js                   # password hashing, requireAdmin, login rate limiting
├── productSchema.js          # product validation + normalisation
├── seed.js                   # first-run admin, catalogue and settings
├── store.js                  # storage layer: Redis when configured, else JSON files
├── sessionStore.js           # express-session store backed by store.js
├── validate.js               # shared input validators
└── data/                     # local JSON fallback: products, users, orders, carts, sessions, settings

src/
├── main.jsx                  # BrowserRouter + root render
├── App.jsx                   # routes, site layout shell, scroll restoration
├── index.css                 # Tailwind theme, component classes, keyframes
├── data/products.js          # seed catalogue content + shared formatters
├── lib/api.js                # fetch wrapper; throws ApiError
├── context/                  # CartContext, AuthContext, ProductsContext (+ providers)
├── pages/admin/              # shell, 6 sections, shared parts and formatters
├── hooks/index.js            # useResource, useReveal, useLockBodyScroll, useOnEscape
├── components/
│   ├── layout/               # Navbar, Footer, CartDrawer
│   ├── ui/Section.jsx        # Reveal, SectionHeading, Marquee
│   ├── ProductCard.jsx       # product grid card + Rating
│   ├── ProductVisual.jsx     # SVG product artwork
│   └── Icon.jsx              # inline icon set
└── pages/
    ├── Home.jsx
    ├── Products.jsx
    ├── ProductDetail.jsx
    ├── About.jsx
    ├── Contact.jsx
    └── NotFound.jsx
```

## Notes for the team

- Theme tokens (colours, fonts, easing) are defined once in `src/index.css` under `@theme`.
  Change them there to rebrand the whole site.
### Swapping product photography

Every product renders through `<ProductImage>` (`src/components/ProductImage.jsx`), which draws
the photo in `public/products/` and **falls back automatically to the generated SVG artwork**
(`ProductVisual`) if the file is missing or fails to load. The site therefore never shows a
broken image.

To use the client's real photography, drop the files into `public/products/` and update the
`photo` / `photoAlt` fields on each product in `src/data/products.js`. Nothing else needs to
change. If a product has no `photo` field, it uses the SVG artwork.

### ⚠️ Placeholder photography disclaimer

The current photos are **free Pexels stock images of other people's cosmetic products**, not
LUMIÈRE products. They are licensed for commercial use under the Pexels Licence (no attribution
required; credits are recorded in the `PHOTO_CREDITS` export in `src/data/products.js`).

Before this goes anywhere near a real customer, a human **must** review every image and:
1. Replace each shot with the client's own product photography.
2. Replace any shot showing a recognisable third-party brand or logo — relabelling a
   competitor's product as LUMIÈRE is a trademark problem, not a cosmetic one.
3. Confirm the subject of each shot actually matches the product it illustrates. These were
   matched from stock-photo descriptions, not from inspecting the images.
### ⚠️ Storage: Redis in production, JSON files on your machine

`server/store.js` picks a backend at boot:

| Condition | Backend | Survives redeploy? |
| --- | --- | --- |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN` are set | Upstash Redis | Yes |
| Otherwise, on your machine | `server/data/*.json` | Yes |
| Otherwise, on a serverless sandbox (no Redis) | `/tmp` JSON — **ephemeral** | **No** |

That last row is the one to avoid. Vercel functions get a fresh, read-only filesystem per
deployment, so without Redis the catalogue is re-seeded from `src/data/products.js` on every
cold start and any product you create or edit in the admin panel is lost — as are sessions,
so admin logins drop at random. Products will still *display*, because seeding is automatic;
the CRUD you do in the dashboard just will not stick. The server logs which backend it chose:

```
[server] storage: redis
```

The Redis path also drops the in-process read cache, so every request sees fresh data —
necessary once requests can land on different instances.

Writes are still read-modify-write over a whole collection, serialised per key. Two writes to
*different* collections never collide, but two edits to the same collection at the same moment
can still drop one — Redis makes data durable, it does not add transactions or row-level
locking. One admin at a time is fine; if you ever need concurrent editors, add a CAS/expiry
or move products to a real database.

Sessions and bcrypt hashes live in the same store. They are gitignored either way, but in
the local JSON fallback they are plaintext on disk — keep `server/data/` out of any backup
you do not encrypt, and delete the seeded test accounts before launch.

## Deploying to Vercel

The Vite build is a static SPA and the Express app runs as a single serverless function.

1. **Push the repository** and import it in the Vercel dashboard.
2. **Add a Redis store.** Project → Storage → Create Database → *Redis* (Upstash). Vercel
   injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` for you; nothing to copy.
3. **Set the env vars** in Project → Settings → Environment Variables (all environments):

   | Variable | Value |
   | --- | --- |
   | `SESSION_SECRET` | `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
   | `ADMIN_EMAIL` | your admin login |
   | `ADMIN_PASSWORD` | 12+ characters — this creates the single admin account |

   `PORT` and `NODE_ENV` are set by Vercel; do not override them.

4. **Deploy.** Build settings are committed in `vercel.json` (framework `vite`, output
   `dist`), so nothing needs configuring in the dashboard.

`vercel.json` rewrites matter and are easy to get wrong:

```json
"rewrites": [
  { "source": "/api/(.*)", "destination": "/api/index" },
  { "source": "/((?!api/).*)", "destination": "/index.html" }
]
```

The first sends every API call to the function. The second is the SPA fallback — without it,
deep links such as `/admin` or `/products/vit-c-glow-serum` return 404 because no such file
exists in `dist/`. Real files (`/assets/*`, `/products/*`, `/favicon.svg`) are served by the
filesystem before rewrites run, so only unmatched paths fall through to `index.html`. The
negative lookahead keeps `/api` from being swallowed by the fallback.

Admin bootstrap failures are logged rather than thrown, so a forgotten `ADMIN_PASSWORD`
degrades to "admin cannot sign in" instead of 500s across the whole storefront.
