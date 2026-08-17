let orders = [];
let statusFilter = 'all';
let term = '';

const STATUS_DB = { completed: 'Berhasil', pending: 'Diproses', failed: 'Gagal', cancelled: 'Gagal' };

function setStat(id, html) {
  document.getElementById(id).innerHTML = html;
}

function renderStats() {
  const ok = orders.filter(o => o.status === 'Berhasil');
  const total = orders.reduce((s, o) => s + o.total, 0);
  setStat('h-count', `${orders.length} <small>kali</small>`);
  setStat('h-total', formatIDR(total));
  setStat('h-ok', `${ok.length} <small>kali</small>`);
}

function visibleOrders() {
  return orders.filter(o =>
    (statusFilter === 'all' || STATUS_CLASS[o.status] === statusFilter) &&
    (!term || o.item.toLowerCase().includes(term) || o.id.toLowerCase().includes(term)));
}

function renderTable() {
  const tbody = document.getElementById('tx-body');
  const list = visibleOrders();
  tbody.innerHTML = list.length
    ? list.map(o => `
      <tr>
        <td style="font-family:var(--font-mono);">${o.id}</td>
        <td>${o.item}</td>
        <td>${o.qty || 1}×</td>
        <td>${formatIDR(o.total)}</td>
        <td><span class="status-pill status-${STATUS_CLASS[o.status]}">${o.status}</span></td>
        <td>${o.date}</td>
      </tr>`).join('')
    : `<tr><td colspan="6"><div class="empty-state"><span class="ic">${icon('file')}</span>Belum ada transaksi yang cocok.</div></td></tr>`;
}

function renderTabs() {
  const wrap = document.getElementById('status-tabs');
  const defs = [['all', 'Semua'], ['success', 'Berhasil'], ['pending', 'Diproses'], ['failed', 'Gagal']];
  wrap.innerHTML = defs.map(([key, label]) => {
    const n = key === 'all'
      ? orders.length
      : orders.filter(o => STATUS_CLASS[o.status] === key).length;
    return `<button type="button" class="${statusFilter === key ? 'active' : ''}" data-f="${key}">${label} (${n})</button>`;
  }).join('');
  wrap.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    statusFilter = b.dataset.f;
    renderTabs();
    renderTable();
  }));
}

document.getElementById('h-search').addEventListener('input', e => {
  term = e.target.value.trim().toLowerCase();
  renderTable();
});

// Ambil riwayat transaksi asli dari database (backend API),
// fallback ke localStorage bila server tidak terjangkau.
async function loadOrders() {
  try {
    const res = await fetch('http://localhost:3000/api/orders');
    const result = await res.json();
    if (result.status === 'success' && result.data.length) {
      orders = result.data.map(o => ({
        id: o.order_code,
        item: o.product_name,
        qty: o.quantity || 1,
        total: Number(o.total_amount),
        status: STATUS_DB[o.status] || o.status,
        date: new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      }));
    }
  } catch (e) {
    console.warn('Gagal memuat riwayat dari server, memakai data lokal:', e);
  }
  if (!orders.length) orders = getOrders();
  renderStats();
  renderTabs();
  renderTable();
}

loadOrders();
