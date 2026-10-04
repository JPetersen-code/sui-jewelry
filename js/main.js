/* =========================================================
   Sui Jewelry — site behaviour
   No build step: plain JS, loaded via <script defer>.
   ========================================================= */

/* ---------- Mobile nav ---------- */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
  });
}

/* ---------- Footer year ---------- */
function initYear() {
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/* ---------- Ring placeholder art ----------
   We don't have real product photography yet, so every product
   card renders a simple generated "ring" glyph coloured to match
   the metal, over a faint ripple. Swap .ring-plate for a real
   <img> once photos exist — see README. */
function metalColor(key) {
  switch (key) {
    case 'gold': return '#c9a66b';
    case 'rose-gold': return '#d9a69a';
    case 'titanium': return '#8a9a9c';
    case 'black-titanium': return '#394042';
    default: return '#c7cdd1'; // silver
  }
}

function ringSVG(color) {
  return `
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="30" stroke="${color}" stroke-width="10"/>
      <circle cx="50" cy="34" r="5" fill="${color}"/>
    </svg>`;
}

function rippleSVG() {
  return `
    <svg viewBox="0 0 100 100" class="ripple" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="none" stroke="#2d7e7f" stroke-opacity="0.15" stroke-width="1"/>
      <circle cx="50" cy="50" r="36" fill="none" stroke="#2d7e7f" stroke-opacity="0.12" stroke-width="1"/>
      <circle cx="50" cy="50" r="26" fill="none" stroke="#2d7e7f" stroke-opacity="0.1" stroke-width="1"/>
    </svg>`;
}

function productCardHTML(p) {
  const color = metalColor(p.metalKey);
  return `
    <div class="card product-card" data-metal="${p.metalKey}" data-collection="${p.collection}">
      <div class="ring-plate">
        ${rippleSVG()}
        ${ringSVG(color)}
      </div>
      <div class="info">
        <span class="collection-tag">${p.collection}</span>
        <h3>${p.name}</h3>
        <div class="metal">
          <span class="metal-chip"><span class="metal-dot" style="background:${color}"></span>${p.metal}</span>
        </div>
        <div class="price">${p.price}</div>
        <p class="desc">${p.description}</p>
        <a class="btn btn-ghost btn-sm" href="${p.etsyUrl}" target="_blank" rel="noopener">View on Etsy →</a>
      </div>
    </div>`;
}

/* ---------- Load products.json and render ---------- */
async function loadProducts() {
  const res = await fetch('data/products.json');
  if (!res.ok) throw new Error('Could not load products.json');
  return res.json();
}

function initFeatured() {
  const mount = document.querySelector('[data-featured-products]');
  if (!mount) return;
  loadProducts()
    .then((products) => {
      const featured = products.slice(0, 3);
      mount.innerHTML = featured.map(productCardHTML).join('');
    })
    .catch(() => {
      mount.innerHTML = '<p>Unable to load pieces right now — please refresh.</p>';
    });
}

function initShopGrid() {
  const mount = document.querySelector('[data-shop-grid]');
  const filterBar = document.querySelector('[data-metal-filters]');
  if (!mount) return;

  loadProducts()
    .then((products) => {
      mount.innerHTML = products.map(productCardHTML).join('');

      if (filterBar) {
        filterBar.addEventListener('click', (e) => {
          const btn = e.target.closest('.filter-btn');
          if (!btn) return;
          filterBar.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          const metal = btn.dataset.metal;
          mount.querySelectorAll('.product-card').forEach((card) => {
            const show = metal === 'all' || card.dataset.metal === metal;
            card.style.display = show ? '' : 'none';
          });
        });
      }
    })
    .catch(() => {
      mount.innerHTML = '<p>Unable to load pieces right now — please refresh.</p>';
    });
}

/* ---------- Accordion (care / FAQ pages) ---------- */
function initAccordion() {
  document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const panel = item.querySelector('.accordion-panel');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.accordion-item.open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.accordion-panel').style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

/* ---------- Forms (contact + newsletter) ----------
   No backend yet: we just show a confirmation message in-page.
   See README for how to wire these up to a real inbox
   (e.g. Formspree, Netlify Forms, or a mailto fallback). */
function initForms() {
  document.querySelectorAll('[data-demo-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const successEl = form.querySelector('.form-success');
      if (successEl) {
        successEl.classList.add('show');
      }
      form.reset();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initYear();
  initFeatured();
  initShopGrid();
  initAccordion();
  initForms();
});
