# Project memory

## Product intent & audience

- **Maison** — a feature-rich e-commerce marketplace built on Vite + React.
- General online shoppers; supports guest checkout (no account required).
- Catalog: 20 products across 8 categories (Audio, Wearables, Eyewear, Home, Accessories, Footwear, Drinkware, Computing).

## Brand personality & voice

- Premium, polished marketplace aesthetic; brand name "Maison" implies curated/boutique feel.

## Visual design & UX direction

- Homepage: hero section, category browser, featured products, promo banner.
- Catalog: category filtering, sorting (price, rating, newest), search.
- Product detail: real-time stock updates via Supabase live subscriptions.
- Cart: slide-out drawer with quantity controls, free-shipping progress bar, localStorage persistence.
- Checkout: form validation + order summary; slide/inline flow.
- Order tracking: "Track Your Order" page — lookup by email, visual status timeline (Pending → Processing → Shipped → Delivered).
- Tech: Tailwind CSS, Lucide React icons, React hooks, `@/` path alias (`src/`).

## Decisions, constraints & rationale

- **Backend**: Supabase (database, realtime subscriptions, RLS).
- **Security model**: server-side `place_order` PostgreSQL function (SECURITY DEFINER) — atomically validates DB prices (anti-tampering), checks stock, decrements inventory, creates order in one transaction. Row-level security on all tables with guest checkout policies.
- **Payment**: Stripe NOT yet connected; checkout uses "pay on delivery confirmation" placeholder flow. Wiring Stripe requires account + secret key via bolt.new/setup/stripe.
- **Persistence**: cart state in localStorage; product/order data in Supabase.
- **Realtime**: Supabase subscriptions for product stock changes and order status updates.

## Open questions & assumptions

- Stripe integration pending — user needs to connect Stripe account to enable real card payments.
- No user accounts/auth yet — guest checkout only; auth/registration not implemented.
- Shipping logic: free-shipping threshold exists but specific amount/tiers not confirmed.
- Admin/inventory management interface not mentioned; assumed out of scope for now.