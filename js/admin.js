let orders = getOrders();
let filter = 'all';

function setStat(id, html) {
  document.getElementById(id).innerHTML = html;
}

function renderStats() {
  const revenue = orders.filter(o => o.status !== 'Gagal').reduce((s, o) => s + o.total, 0);
  const pending = orders.filter(o => o.status === 'Diproses').length;
  const today = orders.filter(o => o.date === todayID()).length;
  setStat('a-count', `${orders.length} <small>order</small>`);
  setStat('a-revenue', formatIDR(revenue));
  setStat('a-pending', `${pending} <small>order</small>`);
  setStat('a-today', `${today} <small>transaksi</small>`);
}

function visibleOrders() {
  return filter === 'all'
    ? orders
    : orders.filter(o => STATUS_CLASS[o.status] === filter);
}

function renderTable() {
  const tbody = document.getElementById('admin-body');
  const list = visibleOrders();
  tbody.innerHTML = list.length
    ? list.map(o => `
      <tr>
        <td style="font-family:var(--font-mono);">${o.id}</td>
        <td>${o.item}</td>
        <td>${o.qty || 1}×</td>
        <td>${formatIDR(o.total)}</td>
        <td>
          <select class="status-select status-${STATUS_CLASS[o.status]}" data-id="${o.id}">
            <option ${o.status === 'Berhasil' ? 'selected' : ''}>Berhasil</option>
            <option ${o.status === 'Diproses' ? 'selected' : ''}>Diproses</option>
            <option ${o.status === 'Gagal' ? 'selected' : ''}>Gagal</option>
          </select>
        </td>
        <td>${o.date}</td>
      </tr>`).join('')
    : `<tr><td colspan="6"><div class="empty-state"><span class="ic">📦</span>Tidak ada pesanan di filter ini.</div></td></tr>`;
  tbody.querySelectorAll('select').forEach(sel => sel.addEventListener('change', () => {
    const o = orders.find(x => x.id === sel.dataset.id);
    if (!o) return;
    o.status = sel.value;
    saveOrders(orders);
    renderStats();
    renderTabs();
    renderTable();
    showToast(`Order ${o.id} → ${o.status}`);
  }));
}

function renderTabs() {
  const wrap = document.getElementById('a-tabs');
  const defs = [['all', 'Semua'], ['success', 'Berhasil'], ['pending', 'Diproses'], ['failed', 'Gagal']];
  wrap.innerHTML = defs.map(([key, label]) => {
    const n = key === 'all'
      ? orders.length
      : orders.filter(o => STATUS_CLASS[o.status] === key).length;
    return `<button type="button" class="${filter === key ? 'active' : ''}" data-f="${key}">${label} (${n})</button>`;
  }).join('');
  wrap.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    filter = b.dataset.f;
    renderTabs();
    renderTable();
  }));
}

renderStats();
renderTabs();
renderTable();

const CAT_LABEL = { topup: 'Top Up', voucher: 'Voucher', akun: 'Akun & Item' };
const USERS = [
  { name: 'Benjamin Sesko', email: 'Benjamin.Sesko@email.com', role: 'User', joined: '12 Jan 2026' },
  { name: 'Dewi Maharani', email: 'dewi.m@email.com', role: 'User', joined: '02 Feb 2026' },
  { name: 'Fajar Nugroho', email: 'fajar99@email.com', role: 'User', joined: '18 Mar 2026' },
  { name: 'Putri Wulandari', email: 'putri.w@email.com', role: 'User', joined: '09 Apr 2026' },
  { name: 'Bagas Kurniawan', email: 'bagas.k@email.com', role: 'User', joined: '21 Mei 2026' },
  { name: 'Admin Utama', email: 'admin@topupin.id', role: 'Admin', joined: '01 Jan 2026' },
];

let products = getProducts();
let editingId = null;

function renderUsers() {
  const tbody = document.getElementById('user-body');
  tbody.innerHTML = USERS.map(u => `
    <tr>
      <td><b style="font-size:13px;">${u.name}</b></td>
      <td>${u.email}</td>
      <td>${u.role === 'Admin'
        ? '<span class="status-pill" style="background:var(--blue-100);color:var(--blue-700);">Admin</span>'
        : 'User'}</td>
      <td>${u.joined}</td>
      <td><span class="status-pill status-success">Aktif</span></td>
    </tr>`).join('');
}

function renderProducts() {
  const tbody = document.getElementById('product-body');
  tbody.innerHTML = products.length
    ? products.map(p => `
      <tr>
        <td><b style="font-size:13px;">${p.name}</b></td>
        <td>${CAT_LABEL[p.cat] || p.cat}</td>
        <td>${formatIDR(p.price)}</td>
        <td><span class="status-pill status-success">Aktif</span></td>
        <td>
          <button type="button" class="btn btn-outline btn-xs" data-edit="${p.id}">Edit</button>
          <button type="button" class="link-danger" data-del="${p.id}">Hapus</button>
        </td>
      </tr>`).join('')
    : `<tr><td colspan="5"><div class="empty-state"><span class="ic">${icon('tag')}</span>Belum ada produk.</div></td></tr>`;
  tbody.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openProductModal(b.dataset.edit)));
  tbody.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
    if (!confirm('Hapus produk ini?')) return;
    products = products.filter(x => x.id !== b.dataset.del);
    saveProducts(products);
    renderProducts();
    showToast('Produk dihapus');
  }));
}

const pmOverlay = document.getElementById('product-modal');

function openProductModal(id) {
  editingId = id;
  const p = id ? products.find(x => x.id === id) : null;
  document.getElementById('pm-title').textContent = p ? 'Edit Produk' : 'Tambah Produk';
  document.getElementById('pm-name').value = p ? p.name : '';
  document.getElementById('pm-cat').value = p ? p.cat : 'topup';
  document.getElementById('pm-price').value = p ? p.price : '';
  pmOverlay.classList.remove('hidden');
}

function closeProductModal() {
  pmOverlay.classList.add('hidden');
}

document.getElementById('product-add').addEventListener('click', () => openProductModal(null));
document.getElementById('pm-close').addEventListener('click', closeProductModal);
pmOverlay.addEventListener('click', e => { if (e.target === pmOverlay) closeProductModal(); });

document.getElementById('pm-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('pm-name').value.trim();
  const cat = document.getElementById('pm-cat').value;
  const price = parseInt(document.getElementById('pm-price').value, 10) || 0;
  if (!name || price <= 0) {
    showToast('Nama dan harga wajib diisi dengan benar');
    return;
  }
  if (editingId) {
    const p = products.find(x => x.id === editingId);
    if (p) { p.name = name; p.cat = cat; p.price = price; }
    showToast('Produk diperbarui');
  } else {
    products.push({ id: 'p-' + Date.now(), name, cat, price });
    showToast('Produk ditambahkan');
  }
  saveProducts(products);
  renderProducts();
  closeProductModal();
});

renderProducts();
renderUsers();