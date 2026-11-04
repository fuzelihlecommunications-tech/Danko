/* =========================================================
   DANKO — create-checkout.js   (runs on Netlify, NOT in the browser)
   =========================================================
   REDIRECT payment (fallback). Used only when the on-page card form
   (see charge.js) is not available. It asks Yoco for a hosted payment page
   and returns its address; checkout.html then sends the customer there.

   Needs the Netlify environment variable YOCO_SECRET_KEY (sk_test_... / sk_live_...).
   The secret key must NEVER be put in any HTML/JS file of the website. */
const crypto = require('crypto');
const { priceOrder, orderMetadata, reply } = require('../lib/order');

const YOCO_URL = 'https://payments.yoco.com/api/checkouts';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return reply(405, { error: 'POST only' });
  const secret = process.env.YOCO_SECRET_KEY;
  if (!secret) return reply(500, { error: 'Payments are not set up yet (missing YOCO_SECRET_KEY)' });
  try {
    const { items, customer } = JSON.parse(event.body || '{}');
    if (!customer || !customer.email || !customer.name) return reply(400, { error: 'Missing delivery details' });
    const order = priceOrder(items);                       // real price, worked out on the server
    const site = (process.env.URL || (event.headers && event.headers.origin) || '').replace(/\/$/, '');
    if (!site) return reply(500, { error: 'Site address unknown' });

    const res = await fetch(YOCO_URL, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + secret, 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() },
      body: JSON.stringify({
        amount: Math.round(order.total * 100),             // Yoco wants CENTS
        currency: 'ZAR',
        successUrl: site + '/checkout.html?paid=1',
        cancelUrl: site + '/checkout.html?cancelled=1',
        failureUrl: site + '/checkout.html?cancelled=1',
        metadata: orderMetadata(customer, order)
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.redirectUrl) { console.error('Yoco error', res.status, JSON.stringify(data)); return reply(502, { error: 'Yoco could not start the payment' }); }
    return reply(200, { redirectUrl: data.redirectUrl });
  } catch (err) {
    console.error(err);
    return reply(err.status || 500, { error: err.status ? err.message : 'Something went wrong starting the payment' });
  }
};
