# Yoco payments: setup guide

Customers now pay ON your checkout page. Yoco's secure card field appears
inside the page, so nobody is sent away to another site.

How it works:
1. The customer types their card into Yoco's secure field. Yoco's script turns
   it into a one-time token in the browser. Your site never sees the card number.
2. Our Netlify function `netlify/functions/charge.js` receives that token,
   works out the REAL total from `js/script.js`, and charges it with your secret key.
3. If the card field can't load (no public key set, or Yoco's script blocked),
   checkout automatically falls back to sending the customer to Yoco's own page
   (`netlify/functions/create-checkout.js`). Payments keep working either way.

## One-time setup
1. **Yoco account**: online payments enabled. Get your integration keys.
   You have four: `pk_test_`, `sk_test_`, `pk_live_`, `sk_live_`.
2. **Public key**: open `js/script.js`, find `[EDIT: YOCO]` and replace
   `pk_test_REPLACE_ME` with your `pk_test_...` key. (Public keys are safe to show.)
3. **Deploy through GitHub + Netlify** (drag-and-drop does NOT run functions).
   Put this folder in a GitHub repo, then Netlify > Add new site > Import from Git.
4. **Secret key**: Netlify > Site configuration > Environment variables, add
   `YOCO_SECRET_KEY` = your `sk_test_...` key. Redeploy.
   The secret key NEVER goes in any website file.
5. **Test**: check out with Yoco's test card details (in the Yoco developer docs)
   and confirm: card field shows, payment succeeds, a test payment appears in Yoco.
   Also test a declined card. Check the Netlify function logs if anything fails.
6. **Go live**: swap in `pk_live_...` (script.js) and `sk_live_...` (Netlify),
   redeploy, and make one small real purchase yourself.

## IMPORTANT: confirm on-page payments with Yoco
The on-page card field uses Yoco's Web SDK (loaded from js.yoco.com). Yoco's
newest docs focus on the redirect Checkout API, so before launch confirm with
Yoco support that Web SDK / inline payments is enabled for your account. If it
isn't, nothing breaks: the site uses the redirect fallback automatically.

## Where to see orders
Each payment carries the order details (name, email, phone, address, items,
sizes, colours, total) as metadata. Paid sales show in your Yoco dashboard.
NOT BUILT YET: an automatic email to you per order (needs an email service).

## Changing prices or shipping
Edit only `js/script.js` (`PRODUCTS`, `DK_SHIPPING_FEE`). The payment functions
read the same file, so the site and the charge can never disagree.
