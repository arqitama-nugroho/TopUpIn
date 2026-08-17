const STATUS_DB = { completed: 'Berhasil', pending: 'Diproses', failed: 'Gagal', cancelled: 'Gagal' };

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || '?';
}

function txRow(o, withId) {
  const idCol = withId
    ? `<td style="font-family:var(--font-mono);">${o.id}</td>`
    : '';
  return `
    <tr>
      ${idCol}
      <td>${o.item}</td>
      <td>${o.date}</td>
      <td>${formatIDR(o.total)}</td>
      <td><span class="status-pill status-${STATUS_CLASS[o.status]}">${o.status}</span></td>
    </tr>`;
}

// ===== Profil dari database =====
async function loadProfile() {
  const username = localStorage.getItem('tp_username');
  if (!username) {
    document.querySelector('.profile-card .uname').textContent = 'Sesi tidak dikenali';
    document.querySelector('.profile-card .uemail').textContent = 'Keluar lalu masuk kembali untuk memuat profil';
    return;
  }
  try {
    const res = await fetch(`http://localhost:3000/api/users/${username}`);
    const result = await res.json();
    if (result.status !== 'success') throw new Error(result.message);
    const u = result.data;
    document.querySelector('.profile-card .avatar').textContent = initials(u.full_name || u.username);
    document.querySelector('.profile-card .uname').textContent = u.full_name || u.username;
    document.querySelector('.profile-card .uemail').textContent = u.email;
    document.getElementById('p-name').value = u.full_name || '';
    document.getElementById('p-username').value = u.username;
    document.getElementById('p-email').value = u.email;
    document.getElementById('p-phone').value = u.phone_number || '';
  } catch (e) {
    console.warn('Gagal memuat profil:', e);
    document.querySelector('.profile-card .uname').textContent = 'Gagal memuat profil';
    document.querySelector('.profile-card .uemail').textContent = 'Pastikan backend aktif, lalu muat ulang';
  }
}

document.getElementById('profile-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const uid = localStorage.getItem('tp_uid');
  if (!uid) return showToast('Sesi berakhir, silakan masuk kembali');

  try {
    const res = await fetch(`http://localhost:3000/api/users/${uid}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: document.getElementById('p-name').value,
        email: document.getElementById('p-email').value,
        phone_number: document.getElementById('p-phone').value,
      }),
    });
    const result = await res.json();
    if (result.status === 'success') {
      showToast('Profil berhasil diperbarui');
      loadProfile();
    } else {
      showToast('Gagal: ' + result.message);
    }
  } catch (error) {
    showToast('Error: Tidak dapat terhubung ke server backend');
  }
});

// ===== Transaksi dari database =====
let orders = [];

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
        date: fmtDate(o.created_at),
      }));
    }
  } catch (e) {
    console.warn('Gagal memuat riwayat dari server:', e);
  }
  renderOverview();
  renderTx();
}

function renderOverview() {
  const total = orders.reduce((s, o) => s + o.total, 0);
  const ok = orders.filter(o => o.status === 'Berhasil').length;
  document.getElementById('ov-count').innerHTML = `${orders.length} <small>kali</small>`;
  document.getElementById('ov-total').innerHTML = formatIDR(total);
  document.getElementById('ov-poin').innerHTML = `${Math.floor(total / 1000).toLocaleString('id-ID')} <small>poin</small>`;

  const tbody = document.getElementById('ov-body');
  tbody.innerHTML = orders.length
    ? orders.slice(0, 3).map(o => txRow(o, false)).join('')
    : '<tr><td colspan="4"><div class="empty-state">Belum ada transaksi.</div></td></tr>';
}

function renderTx() {
  const tbody = document.getElementById('tx-body');
  tbody.innerHTML = orders.length
    ? orders.map(o => txRow(o, true)).join('')
    : '<tr><td colspan="5"><div class="empty-state">Belum ada transaksi.</div></td></tr>';
}

loadProfile();
loadOrders();
