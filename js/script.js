// ===== TopUpIn shared behaviour =====

// Password show/hide toggles
document.querySelectorAll('.toggle-pass').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.closest('.input-wrap').querySelector('input');
    const hidden = input.type === 'password';
    input.type = hidden ? 'text' : 'password';
    btn.textContent = hidden ? 'Sembunyikan' : 'Tampilkan';
  });
});

// Simple toast helper
function showToast(message){
  let toast = document.querySelector('.toast');
  if(!toast){
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="ic">●</span><span class="msg"></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector('.msg').textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

// Register page: live password strength meter
const regPass = document.querySelector('#reg-password');
if(regPass){
  const bars = document.querySelectorAll('.strength-meter .bar');
  const label = document.querySelector('.strength-label');
  regPass.addEventListener('input', () => {
    const v = regPass.value;
    let score = 0;
    if(v.length >= 8) score++;
    if(/[A-Z]/.test(v)) score++;
    if(/[0-9]/.test(v)) score++;
    if(/[^A-Za-z0-9]/.test(v)) score++;
    const colors = ['#e2e7f2', '#ff4d5e', '#ff9f1c', '#2f6bff', '#17ae6d'];
    bars.forEach((bar, i) => {
      bar.style.background = i < score ? colors[score] : '#e2e7f2';
    });
    const labels = ['Terlalu pendek', 'Lemah', 'Sedang', 'Kuat', 'Sangat kuat'];
    if(label) label.textContent = v ? labels[score] : '';
  });
}

// Generic form submit -> prevent real submit, show toast (demo only)
document.querySelectorAll('form[data-demo-submit]').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast(form.dataset.demoSubmit || 'Berhasil disimpan');
  });
});

// Account page: sidebar tab switching
const sideNavButtons = document.querySelectorAll('.side-nav button[data-tab]');
if(sideNavButtons.length){
  sideNavButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sideNavButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.account-tab').forEach(tab => tab.classList.remove('active'));
      const target = document.querySelector('#tab-' + btn.dataset.tab);
      if(target) target.classList.add('active');
    });
  });
}

// Account page: toggle switches give feedback
document.querySelectorAll('.switch input').forEach(sw => {
  sw.addEventListener('change', () => {
    const label = sw.closest('.toggle-row').querySelector('.t1')?.textContent || 'Pengaturan';
    showToast(`${label} ${sw.checked ? 'diaktifkan' : 'dimatikan'}`);
  });
});

// Remove saved payment method
document.querySelectorAll('.pay-method .remove').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.pay-method').remove();
    showToast('Metode pembayaran dihapus');
  });
});

// Ticker: duplicate content for seamless loop
document.querySelectorAll('.ticker-track').forEach(track => {
  track.innerHTML += track.innerHTML;
});
