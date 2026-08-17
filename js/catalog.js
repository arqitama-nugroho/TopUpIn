const params = new URLSearchParams(location.search);
let cat = params.get('cat') || 'topup';
if (cat !== 'topup') cat = 'topup';
let query = (params.get('q') || '').trim().toLowerCase();
let sort = 'popular';

let allProducts = [];
let allGames = [];

const CATS = [
  ['topup', 'Top Up'],
];

const headerHost = document.querySelector('[data-chrome="header"]');
if (headerHost && cat !== 'all') {
  headerHost.dataset.active = cat;
  renderHeader(headerHost);
}

// Render filter kategori langsung agar UI tidak kosong
function renderFilters() {
  const wrap = document.getElementById('cat-filters');
  if (!wrap) return;
  wrap.innerHTML = CATS.map(([key, label]) =>
    `<button type="button" class="filter-btn ${cat === key ? 'active' : ''}" data-cat="${key}">${label}</button>`).join('');
  wrap.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    cat = b.dataset.cat;
    renderFilters();
    renderGrid();
  }));
}

// Ambil data produk dan game dari Backend API
async function fetchCatalogData() {
  const grid = document.getElementById('product-grid');
  if (grid) grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:20px; color:#64748b;">Memuat data produk dari server...</div>';

  try {
    const [prodRes, gameRes] = await Promise.all([
      fetch('http://localhost:3000/api/products'),
      fetch('http://localhost:3000/api/games')
    ]);
    
    const prodResult = await prodRes.json();
    const gameResult = await gameRes.json();

    if (prodResult.status === 'success') allProducts = prodResult.data;
    if (gameResult.status === 'success') allGames = gameResult.data;

    renderGrid();
  } catch (err) {
    console.error("Gagal memuat data katalog dari server:", err);
    if (grid) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1; color:red;">Gagal terhubung ke server backend (Port 3000). Pastikan Docker sudah menyala!</div>';
    }
  }
}

function currentGames() {
  let list = allProducts.filter(p =>
    (!query || p.product_name.toLowerCase().includes(query) || p.game_name.toLowerCase().includes(query))
  );

  if (sort === 'low') list = list.slice().sort((a, b) => a.price - b.price);
  if (sort === 'high') list = list.slice().sort((a, b) => b.price - a.price);
  return list;
}

function cardHTML(p) {
  return `<article class="product-card">
    <div class="thumb" style="display:flex; align-items:center; justify-content:center; font-size:32px; background:var(--blue-100);">🎮</div>
    <div class="body">
      <div class="name">${p.product_name}</div>
      <div class="pub">${p.game_name}</div>
      <div class="price">Mulai dari<br><small>${formatIDR(p.price)}</small></div>
      <button class="btn btn-primary" type="button" onclick="openModal(${p.id})">Lihat Paket</button>
    </div>
  </article>`;
}

function updateCount(n) {
  const counter = document.getElementById('result-count');
  if (counter) counter.textContent = `${n} produk ditemukan`;
}

function renderGrid() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  
  const list = currentGames();
  updateCount(list.length);
  
  grid.innerHTML = list.length
    ? list.map(cardHTML).join('')
    : `<div class="empty-state" style="grid-column:1/-1;"><span class="ic">🔍</span>Tidak ada produk yang cocok dengan pencarianmu.</div>`;
}

const overlay = document.getElementById('pkg-modal');
let selected = null;

async function openModal(id) {
  try {
    const res = await fetch(`http://localhost:3000/api/products/${id}`);
    const result = await res.json();
    
    if (result.status !== 'success') return;
    const p = result.data;

    selected = { id: p.id, name: p.product_name, price: Number(p.price) };
    
    document.getElementById('modal-name').textContent = p.product_name;
    document.getElementById('modal-pub').textContent = p.game_name;
    
    const list = document.getElementById('pkg-list');
    list.innerHTML = `
      <div class="pkg-row selected" style="padding: 12px; border: 1px solid var(--blue-600); border-radius: 8px; background: var(--blue-50);">
        <div class="pkg-info"><b>${p.product_name} (${p.denomination})</b></div>
        <div class="pkg-price" style="font-weight:700; color:var(--blue-600);">${formatIDR(p.price)}</div>
      </div>
    `;
    
    document.getElementById('buy-btn').textContent = `Beli ${formatIDR(p.price)}`;
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  } catch (err) {
    console.error("Gagal membuka detail produk:", err);
  }
}

function closeModal() {
  if (overlay) overlay.classList.add('hidden');
  document.body.style.overflow = '';
}

if (overlay) {
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
}
const modalCloseBtn = document.getElementById('modal-close');
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

const buyBtn = document.getElementById('buy-btn');
if (buyBtn) {
  buyBtn.addEventListener('click', () => {
    if (!selected) return;
    const prod = { id: selected.id, name: selected.name, cat: 'topup', price: selected.price };
    const products = getProducts().filter(x => x.id !== prod.id);
    products.push(prod);
    saveProducts(products);
    setCart({ gameId: prod.id, pkgIdx: 0 });
    location.href = '../html/checkout.html';
  });
}

const sortSel = document.getElementById('sort');
if (sortSel) {
  sortSel.addEventListener('change', () => { 
    sort = sortSel.value; 
    renderGrid(); 
  });
}

const sideSearch = document.getElementById('side-search');
if (sideSearch) {
  sideSearch.addEventListener('input', () => {
    query = sideSearch.value.trim().toLowerCase();
    renderGrid();
  });
}

// Inisialisasi awal
renderFilters();
fetchCatalogData();

if (query && sideSearch) {
  sideSearch.value = query;
  const headerInput = document.querySelector('.search-form input');
  if (headerInput) headerInput.value = query;
}