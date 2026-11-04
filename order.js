/* =========================================================
   DANKO — order.js   (server-side helper, runs on Netlify)
   =========================================================
   Shared by create-checkout.js (redirect payment) and charge.js (on-page
   card payment). Works out the REAL price of a bag from js/script.js, so
   nothing the browser sends can change what is charged. */
const fs = require('fs');
const path = require('path');

const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];   // allowed sizes

function loadCatalog() {
  const candidates = [
    path.join(__dirname, '..', '..', 'js', 'script.js'),
    path.join(__dirname, 'js', 'script.js'),
    path.join(process.cwd(), 'js', 'script.js'),
    path.join(process.env.LAMBDA_TASK_ROOT || '', 'js', 'script.js')
  ];
  const file = candidates.find(f => f && fs.existsSync(f));
  if (!file) throw new Error('Could not find js/script.js (check included_files in netlify.toml)');
  const src = fs.readFileSync(file, 'utf8');
  const arr = src.match(/^const PRODUCTS = \[([\s\S]*?)\n\];/m);
  const fee = src.match(/^const DK_SHIPPING_FEE\s*=\s*(\d+)/m);
  if (!arr || !fee) throw new Error('Could not read PRODUCTS / DK_SHIPPING_FEE from js/script.js');
  return { products: new Function('return [' + arr[1] + '\n]')(), shippingFee: Number(fee[1]) };
}

/* Returns { subtotal, shippingFee, total, lines } (Rand) or throws an Error with .status = 400 */
function priceOrder(items) {
  const bad = msg => Object.assign(new Error(msg), { status: 400 });
  if (!Array.isArray(items) || !items.length || items.length > 30) throw bad('Your bag is empty');
  const { products, shippingFee } = loadCatalog();
  let subtotal = 0;
  const lines = [];
  for (const it of items) {
    const p = products.find(x => x.id === it.id);
    const qty = Number(it.qty);
    if (!p || !Number.isInteger(qty) || qty < 1 || qty > 20) throw bad('Invalid item in bag');
    if (!SIZES.includes(it.size)) throw bad('Invalid size');
    const colour = p.colors.find(c => c.key === it.color) || p.colors[0];
    subtotal += p.price * qty;
    lines.push(`${p.name} | ${colour.label} | ${it.size} x${qty}`);
  }
  return { subtotal, shippingFee, total: subtotal + shippingFee, lines };
}

/* Order details stored with the payment so you know what to pack and where to send it. */
function orderMetadata(customer, order) {
  return {
    customer: String(customer.name).slice(0, 100),
    email: String(customer.email).slice(0, 100),
    phone: String(customer.phone || '').slice(0, 30),
    address: [customer.address, customer.city, customer.postalCode].filter(Boolean).join(', ').slice(0, 250),
    items: order.lines.join(' ; ').slice(0, 450),
    subtotal: 'R' + order.subtotal, shipping: 'R' + order.shippingFee, total: 'R' + order.total
  };
}

const reply = (statusCode, body) => ({
  statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
});

module.exports = { priceOrder, orderMetadata, reply };
