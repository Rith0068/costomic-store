# LUMIÈRE — Cosmetics Brand Website

Front-end web application built for **Flash Solution** (Zürich, Switzerland) for the client
**Mr. Kim MinJuu**, owner of the LUMIÈRE cosmetics brand.

> Mock-up / front-end only. All data is static and lives in `src/data/products.js`. There is no
> backend — forms and the cart are simulated client-side.

---

## Tech stack

| Layer     | Choice                                  |
| --------- | --------------------------------------- |
| Framework | React 19 (function components + hooks)  |
| Build     | Vite 8                                  |
| Routing   | React Router 7 (SPA, client-side routes)|
| Styling   | Tailwind CSS v4 (CSS-first `@theme`)   |
| Lint      | oxlint                                  |

## Getting started

```bash
npm install     # install dependencies
npm run dev     # start dev server at http://localhost:5173
npm run build   # production build into dist/
npm run preview # serve the production build locally
npm run lint    # run oxlint
```

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

**Cart**
- Context + reducer-style state, persisted to `localStorage`, survives reload
- Quantity editing, line removal, live subtotal

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

Verified with no horizontal page overflow at 390px, 820px and 1440px. Product visuals are
generated inline as SVG (`ProductVisual`) so the project has no binary image dependencies and
scales losslessly at every breakpoint.

## Project structure

```
src/
├── main.jsx                  # BrowserRouter + root render
├── App.jsx                   # routes, layout shell, scroll restoration
├── index.css                 # Tailwind theme, component classes, keyframes
├── data/products.js          # all static content: products, FAQs, reviews
├── context/CartContext.jsx   # cart state + localStorage persistence
├── hooks/index.js            # useReveal, useScrollPosition, useLockBodyScroll, useOnEscape
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
- `ProductVisual` renders a gradient + SVG bottle silhouette driven by each product's
  `shade.from` / `shade.to`. Replace with real photography by swapping that component for an
  `<img>` when assets are available.
- To connect a real API, replace the contents of `src/data/products.js` with a fetch in a
  `useEffect` or a loader on the route.
