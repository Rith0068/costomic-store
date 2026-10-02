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
├── store.js                  # atomic JSON file store
├── sessionStore.js           # file-backed express-session store
├── validate.js               # shared input validators
└── data/                     # products, users, orders, carts, sessions, settings (.json)

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
### ⚠️ Data is a JSON file store

`server/data/*.json` is the database. Writes are atomic (temp file + rename) and serialised
per collection, but there is no migration path, no indexing and no concurrency control
beyond a single process. Fine for a demo or a single-store pilot; **not** suitable for real
customers — move to a real database before launch.

`server/data/sessions.json` stores live session state and `users.json` stores bcrypt hashes.
Both are gitignored, but they are still plaintext on disk — keep `server/data/` out of any
backup you do not encrypt, and delete the seeded test accounts before launch.
