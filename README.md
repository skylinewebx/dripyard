# DRIPYARD

Premium Nike sneaker storefront. Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · Lenis · Zustand · Stripe Checkout (test mode).

> DRIPYARD is an independent retailer and is not affiliated with Nike, Inc. Ratings, review counts, testimonials and "12,000+ customers" are **sample storefront content**.

## Requirements and install

Node 18.18+ (20 recommended).

```bash
npm install
cp .env.example .env.local   # then fill in Stripe test keys
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run typecheck && npm run lint
```

## Project structure

```
app/            routes (/, /shop, /product/[id], /wishlist, /checkout, /success, /cancel, /about, /account, /terms, /privacy, api/checkout, api/webhook)
components/     home sections, product cards/gallery/selectors, shop filters, cart drawer, menu overlay, layout, ui primitives
data/           products.json (single source of truth), image-meta.json (generated blur placeholders)
lib/            catalog helpers, pricing/shipping rules, filter logic, server checkout validation, payments/ (provider module)
store/          Zustand stores: cart, wishlist (persisted), ui
assets/originals/  the supplied photographs, untouched
scripts/        enhance-images.mjs, prepare-static.mjs
```

## Catalog and assets

Edit `data/products.json` (an array; every page reads it). Per product: `id` (URL slug), `name`, `colorway`, `price` (USD list price), `category`, `colors[]`, `sizes[]`, `stock` (units per US size, `0` = sold out), `rating`/`reviewCount` (sample data), `isNew`, `flashDropDiscount` (percent), `image`, and `verification` (how the model was identified; shown only in development).

Photos: originals are in `assets/originals/shoe-01..20.jpg`. `npm run images` writes `public/images/shoes/shoe-XX.webp` (Lanczos upscale up to 2x, light exposure correction, mild sharpen; no generative steps) plus blur placeholders. Product `image` points at those files. Each product has one real photo; the gallery shows the full frame plus two close-up crops of that same photo.

**Hero:** place the supplied photo at `public/images/hero.webp`. It is used automatically when present (deep-red fallback otherwise).

**Items needing verification** (see each product's `verification` field): colourway names for most Jordan 1 Mid/Low pairs are descriptive, not confirmed official names; `af1-low-black-aqua` and `af1-low-black-red-air` look like custom colourways; no supplied photo is a running shoe, so the Running category is empty.

## Stripe test mode

1. Create a Stripe account, stay in **Test mode**, copy the secret key (`sk_test_…`).
2. `.env.local`:
   ```
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   PAYMENT_PROVIDER=stripe
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
3. Local webhook: `stripe listen --forward-to localhost:3000/api/webhook` and copy the printed `whsec_…` into `STRIPE_WEBHOOK_SECRET`.
4. Pay with card `4242 4242 4242 4242`, any future date, any CVC.

### Payment flow

1. Checkout UI posts only `{productId, size, color, quantity}` to `/api/checkout`.
2. The server validates ids, sizes, colours, quantities and stock, recomputes every price from the catalog, applies shipping (free over $150, else $9.95), and creates a Stripe Checkout Session.
3. The browser is redirected to Stripe. `/success?session_id=…` asks Stripe (server-side) for the session's payment status; the bag is cleared only if it is `paid`.
4. `/api/webhook` verifies the Stripe signature, and for paid sessions records the order idempotently in `.data/orders.json`; checkout subtracts those sold units from catalog stock. That file ledger is for a single-server demo; use a database on serverless hosting.

### Replacing Stripe with Razorpay

Everything provider-specific lives in `lib/payments/`. Implement the `PaymentProvider` interface (`createCheckout`, `retrieveSession`, `parseWebhook`) in `lib/payments/razorpay.ts`, register it in `lib/payments/index.ts`, and set `PAYMENT_PROVIDER=razorpay`. The checkout UI, validation and routes do not change.

## Static preview (GitHub Pages)

The Pages deploy (`.github/workflows/deploy.yml`) builds a static export with `STATIC_EXPORT=1`: API routes are stripped and checkout is disabled. Everything else (shop, filters, cart, wishlist) works. Use the normal build for payments.

## Known limitations

Sample ratings/testimonials; single photo per product; file-based order ledger; taxes not calculated; no accounts; hero photo must be supplied.
