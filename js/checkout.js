const cart = getCart();
const game = cart ? resolveGame(cart.gameId) : null;
const pkg = game && cart ? game.packages[cart.pkgIdx] : null;

if (!game || !pkg) {
  document.getElementById('checkout-wrap').classList.add('hidden');
  document.getElementById('empty-cart').classList.remove('hidden');
} else {
  initCheckout();
}

function initCheckout() {
  document.getElementById('sum-thumb').innerHTML = icon(game.icon);
  document.getElementById('sum-name').textContent = `${game.name} — ${pkg.qty} ${game.unit}`;
  document.getElementById('sum-meta').textContent = `${game.pub} · Paket ${pkg.qty} ${game.unit}`;
  document.getElementById('id-label').textContent = game.idLabel;
  document.getElementById('id-hint').textContent = game.idHint;
  document.getElementById('id-input').placeholder = game.idLabel.includes('Email')
    ? 'nama@email.com' : 'contoh: 1122334455';

  const CODES = { TOPUPIN10: 0.10, BRONZE5: 0.05 };
  let promo = null;
  let qty = 1;
  let total = pkg.price;

  function updateTotals() {
    const subtotal = pkg.price * qty;
    const disc = promo ? Math.round(subtotal * CODES[promo]) : 0;
    const line = document.getElementById('disc-line');
    if (disc > 0) {
      line.classList.remove('hidden');
      document.getElementById('disc-val').textContent = '-' + formatIDR(disc);
    } else {
      line.classList.add('hidden');
    }
    total = subtotal - disc;
    document.getElementById('total').textContent = formatIDR(total);
    return total;
  }

  function setQty(n) {
    qty = Math.min(10, Math.max(1, n));
    document.getElementById('qty-val').textContent = qty;
    updateTotals();
  }

  document.getElementById('subtotal').textContent = formatIDR(pkg.price);
  updateTotals();

  document.getElementById('qty-minus').addEventListener('click', () => setQty(qty - 1));
  document.getElementById('qty-plus').addEventListener('click', () => setQty(qty + 1));

  const checkBtn = document.getElementById('check-id-btn');
  const checkBox = document.getElementById('check-id-result');

  checkBtn.addEventListener('click', async () => {
    const val = document.getElementById('id-input').value.trim();
    if (!val) return;
    checkBox.classList.remove('hidden');
    checkBox.innerHTML = '<div class="ck-row muted">Mengecek ID di server...</div>';
    try {
      const res = await fetch('http://localhost:3000/api/check-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ character_id: val }),
      });
      const result = await res.json();
      if (result.status === 'success') {
        checkBox.innerHTML = result.data.map(d => {
          const isFlag = String(d.account_name).includes('KSM{');
          return `<div class="ck-row"${isFlag ? ' style="border-color:gold; color:#b45309; background:#fffbeb; font-weight:700;"' : ''}>
            <span class="ck-name">${d.account_name}</span>
            <span class="ck-id">ID #${d.id}</span>
          </div>`;
        }).join('') + (result.data.length > 1
          ? '<div class="ck-row muted">⚡ Menemukan lebih dari satu ID — sepertinya query kamu dimanipulasi!</div>'
          : '');
      } else {
        checkBox.innerHTML = `<div class="ck-row muted">${result.message || 'ID tidak ditemukan'}</div>`;
      }
    } catch (err) {
      checkBox.innerHTML = '<div class="ck-row muted">Gagal terhubung ke server (port 3000).</div>';
    }
  });

  const promoBtn = document.getElementById('promo-btn');
  const promoInput = document.getElementById('promo-input');
  const promoNote = document.getElementById('promo-note');

  promoBtn.addEventListener('click', () => {
    const code = promoInput.value.trim().toUpperCase();
    if (!code) { promoNote.textContent = 'Masukkan kode promo dulu.'; return; }
    if (!(code in CODES)) { promoNote.textContent = `Kode "${code}" tidak valid.`; return; }
    promo = code;
    promoNote.textContent = `Kode ${code} diterapkan — diskon ${CODES[code] * 100}%!`;
    updateTotals();
  });

  document.getElementById('pay-form').addEventListener('submit', e => {
    e.preventDefault();
    const idInput = document.getElementById('id-input');
    const err = document.getElementById('id-error');
    if (!idInput.value.trim()) {
      err.style.display = 'block';
      idInput.focus();
      return;
    }
    err.style.display = 'none';
    const order = {
      id: 'TPI-' + Math.floor(10000 + Math.random() * 89999),
      item: `${game.name} — ${pkg.qty} ${game.unit}`,
      qty: qty,
      date: todayID(),
      total: updateTotals(),
      status: 'Diproses',
    };
    addOrder(order);
    setCart(null);
    document.getElementById('checkout-wrap').classList.add('hidden');
    const success = document.getElementById('success-wrap');
    success.classList.remove('hidden');
    document.getElementById('success-oid').textContent = order.id;
    document.getElementById('success-item').textContent = order.item;
    document.getElementById('success-total').textContent = formatIDR(order.total);
    showToast('Pesanan berhasil dibuat');
  });
}