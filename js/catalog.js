const params = new URLSearchParams(location.search);
let cat = params.get('cat') || 'all';
let query = (params.get('q') || '').trim().toLowerCase();
let sort = 'popular';

const CATS = [
  ['all', 'Semua Produk'],
  ['topup', 'Top Up'],
  ['voucher', 'Voucher'],
  ['akun', 'Akun & Item'],
];

const headerHost = document.querySelector('[data-chrome="header"]');
if (headerHost && cat !== 'all') {
  headerHost.dataset.active = cat;
  renderHeader(headerHost);
}

function currentGames() {
  let list = getProducts().filter(p =>
    (cat === 'all' || p.cat === cat) && (!query || p.name.toLowerCase().includes(query)));
  if (sort === 'low') list = list.slice().sort((a, b) => a.price - b.price);
  if (sort === 'high') list = list.slice().sort((a, b) => b.price - a.price);
  return list;
}

function cardHTML(p) {
  const g = GAMES.find(x => x.id === p.id);
  const disc = g && g.disc ? `<span class="badge-disc">-${g.disc}%</span>` : '';
  const pub = g ? g.pub : 'Seller Verified';
  const ic = icon(g ? g.icon : 'gamepad');
  return `<article class="product-card">
    <div class="thumb">${ic}${disc}</div>
    <div class="body">
      <div class="name">${p.name}</div>
      <div class="pub">${pub}</div>
      <div class="price">Mulai dari<br><small>${formatIDR(p.price)}</small></div>
      <button class="btn btn-primary" type="button">Lihat Paket</button>
    </div>
  </article>`;
}

function renderFilters() {
  const wrap = document.getElementById('cat-filters');
  wrap.innerHTML = CATS.map(([key, label]) =>
    `<button type="button" class="filter-btn ${cat === key ? 'active' : ''}" data-cat="${key}">${label}</button>`).join('');
  wrap.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    cat = b.dataset.cat;
    renderFilters();
    renderGrid();
  }));
}

function updateCount(n) {
  document.getElementById('result-count').textContent = `${n} produk ditemukan`;
}

function renderGrid() {
  const grid = document.getElementById('product-grid');
  const list = currentGames();
  updateCount(list.length);
  grid.innerHTML = list.length
    ? list.map(cardHTML).join('')
    : `<div class="empty-state" style="grid-column:1/-1;"><span class="ic">${icon('search')}</span>Tidak ada produk yang cocok dengan pencarianmu.</div>`;
  grid.querySelectorAll('.product-card .btn').forEach((btn, i) =>
    btn.addEventListener('click', () => openModal(list[i].id)));
}

const overlay = document.getElementById('pkg-modal');
let selected = null;

function openModal(id) {
  const g = resolveGame(id);
  if (!g) return;
  selected = { gameId: g.id, pkgIdx: 0 };
  document.getElementById('modal-name').innerHTML = `${icon(g.icon)} ${g.name}`;
  document.getElementById('modal-pub').textContent = g.pub;
  const list = document.getElementById('pkg-list');
  list.innerHTML = g.packages.map((p, i) => `
    <label class="pkg-row ${i === 0 ? 'selected' : ''}">
      <input type="radio" name="pkg" value="${i}" ${i === 0 ? 'checked' : ''}>
      <div class="pkg-info"><b>${p.qty} ${g.unit}</b>${p.bonus ? `<span class="tag-bonus">${icon('gift')} +${p.bonus}</span>` : ''}</div>
      <div class="pkg-price">${formatIDR(p.price)}</div>
    </label>`).join('');
  list.querySelectorAll('input').forEach(inp => inp.addEventListener('change', () => {
    selected.pkgIdx = +inp.value;
    list.querySelectorAll('.pkg-row').forEach((r, i) => r.classList.toggle('selected', i === selected.pkgIdx));
    document.getElementById('buy-btn').textContent = `Beli ${formatIDR(g.packages[selected.pkgIdx].price)}`;
  }));
  document.getElementById('buy-btn').textContent = `Beli ${formatIDR(g.packages[0].price)}`;
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.add('hidden');
  document.body.style.overflow = '';
}

overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.getElementById('modal-close').addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

document.getElementById('buy-btn').addEventListener('click', () => {
  if (!selected) return;
  setCart(selected);
  location.href = '../html/checkout.html';
});

const sortSel = document.getElementById('sort');
sortSel.addEventListener('change', () => { sort = sortSel.value; renderGrid(); });

const sideSearch = document.getElementById('side-search');
sideSearch.addEventListener('input', () => {
  query = sideSearch.value.trim().toLowerCase();
  renderGrid();
});

renderFilters();
renderGrid();
if (query) {
  sideSearch.value = query;
  const headerInput = document.querySelector('.search-form input');
  if (headerInput) headerInput.value = query;
}
