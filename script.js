/* =========================================================
   DANKO — script.js   (used by EVERY page)
   =========================================================
   QUICK EDIT GUIDE — search this file for these tags:
     [EDIT: PRODUCTS]   add / remove / rename products, change prices, colours, photos
     [EDIT: COLOURS]    the colour swatch dots (hex codes + display names)
     [EDIT: PHOTOS]     how photo file names are built
     [EDIT: NEWSLETTER] popup delay (how long before it shows)
     [EDIT: SHIPPING]   the flat shipping fee (DK_SHIPPING_FEE, just below)
     [EDIT: YOCO]       your Yoco PUBLIC key for the on-page card form
   Cart, wishlist, search and animations live further down — you
   normally don't need to touch those.
   ========================================================= */

/* ---------- [EDIT: PHOTOS] Product image helpers ----------
   All product photography lives in /images — drop your own files in using
   the same filenames and they'll appear everywhere automatically. */
function productImg(id, variant) { return `images/products/${id}-${variant || 'main'}.jpg`; }
function categoryImg(cat) { return `images/categories/${cat.toLowerCase().replace(/\s+/g,'-')}.jpg`; }

/* ---------- [EDIT: COLOURS] Colour swatches ----------
   DK_COLORS      = the hex colour of each swatch dot on the shop + product pages.
   DK_COLOR_NAMES = the words shown for a colour (anything not listed is just
                    the capitalised key, e.g. "red" -> "Red").
   To add a new colour: add it to DK_COLORS, then add a matching CSS rule
   `.cw-yourcolour{background:#hex}` near the bottom of css/style.css. */
const DK_COLORS = { black:'#000000', white:'#FFFFFF', red:'#C8102E', brown:'#4A2E25', blue:'#8EC8F0', cream:'#F1EDE2' };
const DK_COLOR_NAMES = { blue:'Sky Blue', cream:'Off-White' };
function dkColorName(k){ return DK_COLOR_NAMES[k] || (k[0].toUpperCase()+k.slice(1)); }
function dkColor(key){ return DK_COLORS[key] || DK_COLORS.black; }

/* ---------- [EDIT: YOCO] Yoco PUBLIC key ----------
   Paste your Yoco public key here. It is safe to show in the website (that is
   what "public" means): pk_test_... while testing, pk_live_... when live.
   NEVER paste the SECRET key (sk_...) here; that one goes in Netlify only.
   While this still says REPLACE_ME, checkout falls back to sending customers to
   Yoco's own payment page. */
const DK_YOCO_PUBLIC_KEY = 'pk_test_5ff1e4a5XB3dAYo883c4';

/* ---------- [EDIT: SHIPPING] Flat shipping fee, in Rand ----------
   Used by the checkout page AND by the Yoco payment function
   (netlify/functions/create-checkout.js reads this exact line), so change it
   ONLY here. Keep the format `const DK_SHIPPING_FEE = 60;` on one line. */
const DK_SHIPPING_FEE = 60;

/* ---------- [EDIT: PRODUCTS] The product catalog ----------
   Every product on the site (shop, home page, search, product page, cart,
   checkout) comes from THIS list. Edit it here and it updates everywhere.

   Each product looks like this:
     id      Unique code, used in the URL (product.html?id=dk-13). Never reuse one.
     name    Name shown to customers.
     cat     Type of item. Powers the shop filter chips. Use exactly:
             'Tees', 'Hoodies', 'Sweaters' or 'Headwear'.
             (A new type needs a new chip in shop.html too.)
     line    Collection it belongs to (also a filter chip): 'Danko x CFX',
             'Danko Lifestyle', 'Garden of Danko', 'Tennis Club', 'City of Roses'.
     price   Price in Rand, as a plain number (400 = R400). No "R", no quotes.
     was     Old price for a "sale" strike-through. Leave as null for none.
     badge   Small label on the card, e.g. 'Sold Out'. null = no label.
     isNew   true = also appears on the New Arrivals page. false = it doesn't.
     colors  List of colours. Each one is:
               key   colour name from DK_COLORS above (black, white, red...)
               label words shown to the customer
               img   photo file prefix. 'dk-13' means the site looks for
                     images/products/dk-13-main.jpg (front view) and
                     images/products/dk-13-alt.jpg (back view).
               single (optional) true = this colour only has a -main photo.
             The FIRST colour in the list is the one shown by default.
     desc    Description paragraph on the product page.

   TO ADD A PRODUCT: copy one block below, paste it in the list, change the
   id/name/price/colours, and drop its photos into images/products/.
   TO REMOVE ONE: delete its whole { ... } block (and the comma after it).
   IMPORTANT: the Yoco payment function reads this list to work out what to
   charge, so keep `const PRODUCTS = [` ... a line that is just `];` intact.
   The order of this list = the order products appear on the site. */
const PRODUCTS = [
  /* ---- Danko x CFX tee ---- */
  { id:'dk-13', name:'Danko x CFX Oversized Tee', cat:'Tees', line:'Danko x CFX', price:400, was:null, badge:null, isNew:false,
    colors:[{key:'white',label:'White',img:'dk-13'},{key:'black',label:'Black',img:'dk-19',single:true}],
    desc:'Two streetwear brands. One city. The Danko x CFX oversized tee, inspired by the soccer culture of Bloemfontein.' },
  /* ---- Danko Lifestyle tee (red / white / sky blue) ---- */
  { id:'dk-01', name:'Danko Lifestyle Oversized Tee', cat:'Tees', line:'Danko Lifestyle', price:400, was:null, badge:null, isNew:false,
    colors:[{key:'red',label:'Red',img:'dk-01'},{key:'white',label:'White',img:'dk-03'},{key:'blue',label:'Sky Blue',img:'dk-04'}],
    desc:'Oversized tee with the Danko Lifestyle signature script on the chest.' },
  /* ---- Garden of Danko Bloemfontein tee ---- */
  { id:'dk-02', name:'Garden of Danko Bloemfontein Oversized Tee', cat:'Tees', line:'Garden of Danko', price:400, was:null, badge:null, isNew:false,
    colors:[{key:'brown',label:'Brown',img:'dk-02'}],
    desc:'Brown oversized tee with the Garden of Danko Bloemfontein emblem on the chest.' },
  /* ---- Garden of Danko '25 tee ---- */
  { id:'dk-10', name:"Garden of Danko '25 Oversized Tee", cat:'Tees', line:'Garden of Danko', price:400, was:null, badge:null, isNew:false,
    colors:[{key:'white',label:'White',img:'dk-10'},{key:'cream',label:'Off-White',img:'dk-06'}],
    desc:"Oversized tee from the Garden of Danko '25 collection, with the red flower Garden of Danko print." },
  /* ---- Danko Tennis Club tee ---- */
  { id:'dk-05', name:'Danko Tennis Club Oversized Tee', cat:'Tees', line:'Tennis Club', price:400, was:null, badge:null, isNew:false,
    colors:[{key:'cream',label:'Off-White',img:'dk-05'}],
    desc:'Off-white oversized tee with the green "Danko Tennis Club, Est. 2021" back graphic and illustrated players.' },
  /* ---- City of Roses (Koranta) tee ---- */
  { id:'dk-17', name:'DITY City of Roses (Koranta) Oversized Tee', cat:'Tees', line:'City of Roses', price:400, was:null, badge:null, isNew:false,
    colors:[{key:'black',label:'Black',img:'dk-17'},{key:'white',label:'White',img:'dk-18'}],
    desc:'City of Roses, Bloemfontein. Small "Danko Is Thank You" chest print and a large graphic across the back. Black carries the Koranta newspaper collage; white carries the red telephone box.' },
  /* ---- Garden of Danko Bloemfontein hoodie (black) ---- */
  { id:'dk-15', name:'Garden of Danko Bloemfontein Hoodie', cat:'Hoodies', line:'Garden of Danko', price:450, was:null, badge:null, isNew:false,
    colors:[{key:'black',label:'Black',img:'dk-15'}],
    desc:'Black hoodie with a small Garden of Danko Bloemfontein emblem on the chest and a large floral graphic on the back: "The rarest flower is that which bloemd in the toughest conditions."' },
  /* ---- Garden of Danko hoodie (red) ---- */
  { id:'dk-14', name:'Garden of Danko Hoodie', cat:'Hoodies', line:'Garden of Danko', price:450, was:null, badge:null, isNew:false,
    colors:[{key:'red',label:'Red',img:'dk-14'}],
    desc:'Red hoodie with the Garden of Danko script on the chest and across the back.' },
  /* ---- Garden of Danko '25 sweater ---- */
  { id:'dk-16', name:"Garden of Danko '25 Sweater", cat:'Sweaters', line:'Garden of Danko', price:450, was:null, badge:null, isNew:false,
    colors:[{key:'white',label:'White',img:'dk-16'}],
    desc:"White sweater from the Garden of Danko '25 collection, with a small floral chest print and a large red-and-blue flower graphic on the back." },
  /* ---- Danko Lifestyle 5-panel cap ---- */
  { id:'dk-07', name:'Danko Lifestyle 5-Panel Cap', cat:'Headwear', line:'Danko Lifestyle', price:200, was:null, badge:null, isNew:false,
    colors:[{key:'white',label:'White',img:'dk-07'},{key:'red',label:'Red',img:'dk-08'}],
    desc:'5-panel cap with the Danko Lifestyle script embroidered on the front panel.' }
];
/* Sets each product's default colour to the first one listed (don't edit). */
PRODUCTS.forEach(p => { p.color = p.colors[0].key; });
/* Helpers that find the right photo for a product + colour (don't edit). */
function colorOf(p, key) { return p.colors.find(c => c.key === key) || p.colors[0]; }
function variantImg(p, key, view) { const c = colorOf(p, key); return `images/products/${c.img}-${(c.single ? 'main' : (view || 'main'))}.jpg`; }

/* ---------- Cart / wishlist state ----------
   Saved in the visitor's own browser (localStorage) so the bag survives a
   page refresh. Nothing here is sent to a server. (don't edit) */
const DK = {
  cart: JSON.parse(localStorage.getItem('danko_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('danko_wishlist') || '[]'),
  save() {
    localStorage.setItem('danko_cart', JSON.stringify(this.cart));
    localStorage.setItem('danko_wishlist', JSON.stringify(this.wishlist));
  },
  addToCart(id, size, qty, color) {
    size = size || 'M'; qty = qty || 1;
    const p = PRODUCTS.find(p => p.id === id);
    color = color || (p ? p.colors[0].key : '');
    const existing = this.cart.find(i => i.id === id && i.size === size && (i.color || '') === color);
    if (existing) existing.qty += qty;
    else this.cart.push({ id, size, qty, color });
    this.save(); renderCart(); showToast('Added to bag');
  },
  removeFromCart(id, size, color) {
    this.cart = this.cart.filter(i => !(i.id === id && i.size === size && (i.color || '') === (color || '')));
    this.save(); renderCart();
  },
  setQty(id, size, qty, color) {
    const item = this.cart.find(i => i.id === id && i.size === size && (i.color || '') === (color || ''));
    if (item) { item.qty = Math.max(1, qty); this.save(); renderCart(); }
  },
  toggleWishlist(id) {
    const idx = this.wishlist.indexOf(id);
    if (idx > -1) { this.wishlist.splice(idx, 1); } else { this.wishlist.push(id); }
    this.save();
    return this.wishlist.includes(id);
  },
  cartCount() { return this.cart.reduce((s, i) => s + i.qty, 0); },
  cartTotal() {
    return this.cart.reduce((s, i) => {
      const p = PRODUCTS.find(p => p.id === i.id);
      return s + (p ? p.price * i.qty : 0);
    }, 0);
  }
};

function renderCart() {
  const list = document.querySelector('.cart-items');
  const countEls = document.querySelectorAll('.cart-count');
  const headCount = document.querySelector('.cart-head h3');
  const subtotalEl = document.querySelector('.cart-subtotal span:last-child');
  if (!list) return;
  const count = DK.cartCount();
  countEls.forEach(el => el.textContent = count);
  if (headCount) headCount.textContent = `Your Bag (${count})`;
  if (subtotalEl) subtotalEl.textContent = 'R' + DK.cartTotal().toFixed(2);

  if (!DK.cart.length) {
    list.innerHTML = '<div class="cart-empty">Your bag is empty — go find something you like.</div>';
    return;
  }
  list.innerHTML = DK.cart.map(item => {
    const p = PRODUCTS.find(p => p.id === item.id);
    if (!p) return '';
    const col = colorOf(p, item.color);
    return `
    <div class="cart-item">
      <div class="thumb"><img src="${variantImg(p, col.key, 'main')}" alt="${p.name}" loading="lazy"></div>
      <div class="meta">
        <div class="nm">${p.name}</div>
        <div class="opt">${col.label} · ${item.size === 'One Size' ? 'One Size' : 'Size ' + item.size} · R${p.price}</div>
        <div class="qty-stepper" data-id="${p.id}" data-size="${item.size}" data-color="${col.key}">
          <button class="minus" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button class="plus" aria-label="Increase quantity">+</button>
        </div>
        <div class="rm" data-id="${p.id}" data-size="${item.size}" data-color="${col.key}">Remove</div>
      </div>
    </div>`;
  }).join('');

  list.querySelectorAll('.rm').forEach(rm => rm.addEventListener('click', () => DK.removeFromCart(rm.dataset.id, rm.dataset.size, rm.dataset.color)));
  list.querySelectorAll('.qty-stepper').forEach(st => {
    const item = DK.cart.find(i => i.id === st.dataset.id && i.size === st.dataset.size && colorOf(PRODUCTS.find(p => p.id === i.id), i.color).key === st.dataset.color);
    st.querySelector('.minus').addEventListener('click', () => DK.setQty(st.dataset.id, st.dataset.size, item.qty - 1, item.color));
    st.querySelector('.plus').addEventListener('click', () => DK.setQty(st.dataset.id, st.dataset.size, item.qty + 1, item.color));
  });
}

/* ---------- Product card renderer (used by shop grid + featured sections) ---------- */
function productCardHTML(p) {
  const wished = DK.wishlist.includes(p.id);
  return `
  <div class="product-card reveal" data-id="${p.id}" data-cat="${p.cat}" data-price="${p.price}">
    <div class="product-media">
      ${p.badge ? `<span class="badge${p.badge === 'Sale' ? ' sale' : p.badge === 'Limited' ? ' limited' : ''}">${p.badge === 'Sale' ? '-' + Math.round((1 - p.price / p.was) * 100) + '%' : p.badge}</span>` : ''}
      <button class="wish-btn${wished ? ' active' : ''}" data-wish="${p.id}" aria-label="Add to wishlist"><i class="fa-${wished ? 'solid' : 'regular'} fa-heart"></i></button>
      <img class="garment main" src="${variantImg(p, p.color, 'main')}" alt="${p.name} — front" loading="lazy">
      <img class="garment alt" src="${variantImg(p, p.color, 'alt')}" alt="${p.name} — back" loading="lazy">
      <button class="add-cart-slide" data-quickadd="${p.id}">Add to Bag</button>
    </div>
    <a href="product.html?id=${p.id}" style="display:block;">
      <div class="product-info">
        <div>
          <div class="name">${p.name}</div>
          <div class="cat">${p.cat}</div>
          <div class="swatches">${p.colors.map(c => `<i class="cw-${c.key}" title="${c.label}"></i>`).join('')}</div>
        </div>
        <div class="price">${p.was ? `<span class="was">R${p.was}</span>` : ''}R${p.price}</div>
      </div>
    </a>
  </div>`;
}

function bindProductCardEvents(container) {
  container.querySelectorAll('[data-wish]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const active = DK.toggleWishlist(btn.dataset.wish);
      btn.classList.toggle('active', active);
      btn.innerHTML = `<i class="fa-${active ? 'solid' : 'regular'} fa-heart"></i>`;
      updateWishCount();
      showToast(active ? 'Added to wishlist' : 'Removed from wishlist');
    });
  });
  container.querySelectorAll('[data-quickadd]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      DK.addToCart(btn.dataset.quickadd, 'M', 1);
      openCartDrawer();
    });
  });
}

function updateWishCount() {
  document.querySelectorAll('.wish-count').forEach(el => el.textContent = DK.wishlist.length);
}

let openCartDrawer = () => {};
let showToast = (msg) => { console.log(msg); };

/* Everything below runs once the page has loaded: loading screen, menus,
   search, cart drawer, animations, forms. Each block has its own heading. */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loading screen ---------- */
  const loader = document.getElementById('d-loader');
  if (loader) {
    const bar = loader.querySelector('.bar');
    const pct = loader.querySelector('.pct');
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 20;
      if (p >= 100) { p = 100; clearInterval(iv); }
      if (bar) bar.style.width = p + '%';
      if (pct) pct.textContent = Math.floor(p) + '%';
      if (p === 100) {
        setTimeout(() => {
          loader.style.transition = 'opacity .6s ease';
          loader.style.opacity = '0';
          setTimeout(() => { loader.style.display = 'none'; playHeroReveal(); }, 620);
        }, 150);
      }
    }, 80);
  } else {
    playHeroReveal();
  }

  /* ---------- Scroll progress + header state ---------- */
  const progress = document.getElementById('scroll-progress');
  const header = document.querySelector('.site-header');
  function onScroll() {
    if (progress) {
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      progress.style.width = (scrolled || 0) + '%';
    }
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeMenu = document.querySelector('.close-menu');
  hamburger && hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  closeMenu && closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu && mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

  /* ---------- Search overlay ---------- */
  const searchOverlay = document.querySelector('.search-overlay');
  const searchInput = document.querySelector('.search-box input');
  const searchResults = document.querySelector('.search-results');
  document.querySelectorAll('[data-open-search]').forEach(b => b.addEventListener('click', () => {
    searchOverlay.classList.add('show');
    setTimeout(() => searchInput && searchInput.focus(), 300);
  }));
  document.querySelectorAll('.search-close').forEach(b => b.addEventListener('click', () => searchOverlay.classList.remove('show')));
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) { searchResults.innerHTML = ''; return; }
      const matches = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q) || p.colors.some(c => c.label.toLowerCase().includes(q)) || (p.line||'').toLowerCase().includes(q));
      searchResults.innerHTML = matches.length
        ? matches.map(p => `<a class="search-result" href="product.html?id=${p.id}"><span>${p.name}</span><span>R${p.price}</span></a>`).join('')
        : `<div class="search-empty">No products match "${q}" — try "tee", "cap", or "garden".</div>`;
    });
  }

  /* ---------- Custom cursor ---------- */
  const cursor = document.querySelector('.d-cursor');
  if (cursor && window.matchMedia('(hover:hover)').matches) {
    window.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseover', e => {
      if (e.target.closest('a, button, .product-card, .collection-card')) cursor.classList.add('grow');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest('a, button, .product-card, .collection-card')) cursor.classList.remove('grow');
    });
  }

  /* ---------- Magnetic buttons ---------- */
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.4}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
  });

  /* ---------- GSAP scroll reveals ---------- */
  function initReveals() {
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray('.reveal').forEach(el => {
        gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
      });
    } else {
      document.querySelectorAll('.reveal').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    }
  }

  function playHeroReveal() {
    if (window.gsap) {
      gsap.to('.hero-title .line span', { y: '0%', duration: 1.1, ease: 'power4.out', stagger: .12, delay: .1 });
      gsap.fromTo('.hero-content .eyebrow', { opacity: 0 }, { opacity: 1, duration: .8, delay: .1 });
      gsap.fromTo('.hero-sub, .hero-actions', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .9, delay: .6, stagger: .1 });
    } else {
      document.querySelectorAll('.hero-title .line span').forEach(s => s.style.transform = 'translateY(0)');
    }
  }

  /* ---------- Accordion ---------- */
  document.body.addEventListener('click', e => {
    const head = e.target.closest('.accordion-head');
    if (!head) return;
    const item = head.closest('.accordion-item');
    const wasOpen = item.classList.contains('open');
    item.parentElement.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });

  /* ---------- Filter chips + search-in-page filtering (shop page) ---------- */
  document.querySelectorAll('.filter-group').forEach(group => {
    group.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        group.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        if (typeof applyFilters === 'function') applyFilters();
      });
    });
  });
  document.querySelectorAll('.filter-select').forEach(sel => {
    sel.addEventListener('change', () => { if (typeof applyFilters === 'function') applyFilters(); });
  });

  /* ---------- Cart drawer ---------- */
  const cartDrawer = document.querySelector('.cart-drawer');
  const overlay = document.querySelector('.overlay-dim');
  openCartDrawer = () => { cartDrawer && cartDrawer.classList.add('open'); overlay && overlay.classList.add('show'); };
  const closeCart = () => { cartDrawer && cartDrawer.classList.remove('open'); overlay && overlay.classList.remove('show'); };
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', openCartDrawer));
  document.querySelectorAll('[data-close-cart]').forEach(b => b.addEventListener('click', closeCart));

  /* ---------- Quick view modal ---------- */
  const qvModal = document.querySelector('.quickview-modal');
  const openQuickView = () => { qvModal && qvModal.classList.add('show'); overlay && overlay.classList.add('show'); };
  const closeQuickView = () => { qvModal && qvModal.classList.remove('show'); overlay && overlay.classList.remove('show'); };
  document.querySelectorAll('[data-quickview]').forEach(b => b.addEventListener('click', openQuickView));
  document.querySelectorAll('.qv-close').forEach(b => b.addEventListener('click', closeQuickView));
  overlay && overlay.addEventListener('click', () => { closeCart(); closeQuickView(); searchOverlay && searchOverlay.classList.remove('show'); });

  /* ---------- Toasts ---------- */
  showToast = function (msg) {
    let stack = document.querySelector('.toast-stack');
    if (!stack) { stack = document.createElement('div'); stack.className = 'toast-stack'; document.body.appendChild(stack); }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-check"></i><span>${msg}</span>`;
    stack.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2600);
  };

  /* ---------- [EDIT: NEWSLETTER] Newsletter popup ----------
   The popup text itself is at the bottom of index.html.
   Change 7000 below to change the delay (in milliseconds, 7000 = 7 seconds). */
  const nlPopup = document.querySelector('.nl-popup-overlay');
  if (nlPopup && !sessionStorage.getItem('danko_nl_dismissed')) {
    setTimeout(() => nlPopup.classList.add('show'), 7000);
  }
  document.querySelectorAll('.close-popup').forEach(b => b.addEventListener('click', () => {
    nlPopup.classList.remove('show');
    sessionStorage.setItem('danko_nl_dismissed', '1');
  }));

  /* ---------- Contact form validation ----------
   NOTE: this only checks the fields and shows "Message sent". It does NOT
   deliver the message anywhere yet — connect a form service before launch
   (see the launch checklist). */
  const contactForm = document.querySelector('.glass-form:not(#checkout-form)');   // contact page only (checkout has its own handler)
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      contactForm.querySelectorAll('.field').forEach(field => {
        const input = field.querySelector('input, textarea');
        if (input && input.hasAttribute('required') && !input.value.trim()) { field.classList.add('invalid'); valid = false; }
        else if (input && input.type === 'email' && input.value && !/^\S+@\S+\.\S+$/.test(input.value)) { field.classList.add('invalid'); valid = false; }
        else field.classList.remove('invalid');
      });
      if (valid) { showToast('Message sent — we\'ll be in touch'); contactForm.reset(); }
    });
  }

  /* ---------- Newsletter forms ----------
   NOTE: shows "You're on the list" but doesn't store the email yet —
   connect Mailchimp / MailerLite before launch. */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => { e.preventDefault(); showToast('You\'re on the list'); form.reset(); });
  });

  /* ---------- Init product-driven UI ---------- */
  renderCart();
  updateWishCount();
  bindProductCardEvents(document);
  initReveals();

  /* Re-run reveal stagger for dynamically inserted product grids */
  document.addEventListener('danko:grid-rendered', () => {
    bindProductCardEvents(document);
    initReveals();
  });

  /* ---------- Account button ----------
   Header person icon: goes to account.html (or shows the user's name once
   they've signed in on this device). */
  let dkUser = null;
  try { dkUser = JSON.parse(localStorage.getItem('danko_user') || 'null'); } catch (e) {}
  document.querySelectorAll('[aria-label="Account"]').forEach(btn => {
    btn.title = dkUser ? 'Hi ' + dkUser.first : 'Sign in / Create account';
    if (dkUser) btn.querySelector('i').className = 'fa-solid fa-user';
    btn.addEventListener('click', () => { window.location.href = 'account.html'; });
  });
});
