(function () {
  const NAV_LINKS = [
    ['▦ Kategori', 'index.html', 'home'],
    ['Top Up Game', 'catalog.html?cat=topup', 'topup'],
    ['Riwayat Transaksi', 'history.html', 'history'],
    ['Akun Saya', 'account.html', 'account'],
    ['Admin', 'admin.html', 'admin'],
  ];

  function renderHeader(host) {
    const active = host.dataset.active || '';
    const role = getRole();
    const nav = NAV_LINKS
      .filter(([label, href, key]) => NAV_BY_ROLE[role].includes(key))
      .map(([label, href, key]) =>
        `<a href="${href}" class="${key === active ? 'active' : ''}">${label}</a>`)
      .join('');
    const actions = role === 'guest'
      ? `<a href="../html/login.html" class="btn btn-ghost-light">Masuk</a><a href="../html/register.html" class="btn btn-primary">Daftar Gratis</a>`
      : `<a href="../html/account.html" class="btn btn-ghost-light">Akun Saya</a><button type="button" class="btn btn-ghost-light" onclick="logout()">Keluar</button>`;
    host.innerHTML = `
      <div class="utility-bar">
        <div class="container">
          <a href="#">${icon('question')} Bantuan</a>
          <a href="#">${icon('globe')} ID · IDR</a>
        </div>
      </div>
      <header class="site-header" style="padding-bottom:18px;">
        <div class="container">
          <div class="header-row">
            <a href="../html/index.html" class="logo"><span class="mark">${icon('zap')}</span>TopUpIn</a>
            <form class="search-form" action="../html/catalog.html" method="get" role="search">
              <input type="search" name="q" placeholder="Cari game, diamond, voucher...">
              <button type="submit">Cari ↵</button>
            </form>
            <div class="header-actions">${actions}</div>
          </div>
        </div>
      </header>
      <nav class="nav-row">
        <div class="container">${nav}</div>
      </nav>`;
  }

  function renderFooter(host) {
    host.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <div class="logo"><span class="mark">${icon('zap')}</span>TopUpIn</div>
              <p>Platform top up game, voucher, dan jual-beli akun tepercaya untuk gamer Indonesia. Cepat, aman, dan selalu online.</p>
            </div>
            <div>
              <h4>Produk</h4>
              <ul>
                <li><a href="../html/catalog.html">Katalog Produk</a></li>
                <li><a href="../html/catalog.html?cat=topup">Top Up Game</a></li>
              </ul>
            </div>
            <div>
              <h4>Perusahaan</h4>
              <ul>
                <li><a href="#">Tentang Kami</a></li>
                <li><a href="#">Karier</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Hubungi Kami</a></li>
              </ul>
            </div>
            <div>
              <h4>Bantuan</h4>
              <ul>
                <li><a href="#">Pusat Bantuan</a></li>
                <li><a href="../html/history.html">Riwayat Transaksi</a></li>
                <li><a href="../html/account.html">Akun Saya</a></li>
                <li><a href="../html/admin.html">Admin</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© 2026 TopUpIn. Seluruh hak cipta dilindungi.</span>
            <span>Dibuat untuk gamer, oleh gamer</span>
          </div>
        </div>
      </footer>`;
  }

  window.renderHeader = renderHeader;

  document.querySelectorAll('[data-chrome="header"]').forEach(renderHeader);
  document.querySelectorAll('[data-chrome="footer"]').forEach(renderFooter);
})();
