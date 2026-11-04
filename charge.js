/* =========================================================
   DANKO — charge.js   (runs on Netlify, NOT in the browser)
   =========================================================
   ON-PAGE card payment. The customer types their card into Yoco's secure
   card field on checkout.html; Yoco's script turns it into a one-time TOKEN
   in the browser and we receive only that token (never the card number).
   This function then charges that token for the REAL total.

   Needs the Netlify environment variable YOCO_SECRET_KEY (sk_test_... / sk_live_...).
   NOTE: this uses Yoco's Web SDK charge endpoint. Test it in test mode before
   going live (see YOCO-SETUP.md). */
const { priceOrder, orderMetadata, reply } = require('../lib/order');

const CHARGE_URL = 'https://online.yoco.com/v1/charges/';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return reply(405, { error: 'POST only' });
  const secret = process.env.YOCO_SECRET_KEY;
  if (!secret) return reply(500, { error: 'Payments are not set up yet (missing YOCO_SECRET_KEY)' });
  try {
    const { token, items, customer } = JSON.parse(event.body || '{}');
    if (!token || typeof token !== 'string') return reply(400, { error: 'Missing card token' });
    if (!customer || !customer.email || !customer.name) return reply(400, { error: 'Missing delivery details' });
    const order = priceOrder(items);                       // real price, worked out on the server

    const res = await fetch(CHARGE_URL, {
      method: 'POST',
      headers: { 'X-Auth-Secret-Key': secret, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        amountInCents: Math.round(order.total * 100),      // CENTS
        currency: 'ZAR',
        metadata: orderMetadata(customer, order)
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.status === 'failed') {
      console.error('Yoco charge error', res.status, JSON.stringify(data));
      return reply(402, { error: data.displayMessage || 'Your card was declined. Please try another card.' });
    }
    return reply(200, { ok: true, paymentId: data.id || null, total: order.total });
  } catch (err) {
    console.error(err);
    return reply(err.status || 500, { error: err.status ? err.message : 'Something went wrong taking the payment' });
  }
};
