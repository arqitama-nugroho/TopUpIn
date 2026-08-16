const orders = getOrders();
let statusFilter = 'all';
let term = '';

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

renderStats();
renderTabs();
renderTable();