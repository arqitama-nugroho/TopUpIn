const ICONS = {
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
  card: '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  question: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  gamepad: '<line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2" ry="2"/>',
  cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  tag: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
  folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  dollar: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  award: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  hexagon: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>',
  box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  gift: '<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
};

function icon(name) {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICONS[name] || ICONS.gamepad) + '</svg>';
}

const GAMES = [
  {
    id: 'ml', name: 'Mobile Legends', pub: 'Moonton', icon: 'award', cat: 'topup', disc: 13, unit: 'Diamond',
    idLabel: 'ID Karakter', idHint: 'Cek ID dan server di profil game kamu',
    packages: [
      { qty: '86', price: 15000, bonus: '+6' },
      { qty: '172', price: 29000, bonus: '+8' },
      { qty: '344', price: 57000 },
      { qty: '568', price: 94000, bonus: '+5' },
      { qty: '1000', price: 165000, bonus: '+15' },
    ],
  },
  {
    id: 'ff', name: 'Free Fire', pub: 'Garena', icon: 'flame', cat: 'topup', unit: 'Diamond',
    idLabel: 'ID Karakter', idHint: 'ID Free Fire berupa angka',
    packages: [
      { qty: '70', price: 11000 },
      { qty: '140', price: 21000, bonus: '+5' },
      { qty: '355', price: 52000 },
      { qty: '725', price: 105000, bonus: '+25' },
    ],
  },
  {
    id: 'pubg', name: 'PUBG Mobile', pub: 'Krafton', icon: 'target', cat: 'topup', unit: 'UC',
    idLabel: 'ID Karakter', idHint: 'Cek ID di profil avatar game',
    packages: [
      { qty: '60', price: 15000 },
      { qty: '325', price: 81000, bonus: '+15' },
      { qty: '660', price: 165000, bonus: '+40' },
      { qty: '1800', price: 440000, bonus: '+150' },
    ],
  },
  {
    id: 'gi', name: 'Genshin Impact', pub: 'HoYoverse', icon: 'hexagon', cat: 'topup', unit: 'Crystal',
    idLabel: 'UID', idHint: 'UID 9 digit, boleh disertai server',
    packages: [
      { qty: '60', price: 16000 },
      { qty: '330', price: 88000 },
      { qty: '980', price: 249000, bonus: '+110' },
      { qty: '1980', price: 499000, bonus: '+260' },
    ],
  },
  {
    id: 'rbx', name: 'Roblox', pub: 'Roblox Corp', icon: 'box', cat: 'voucher', unit: 'Robux',
    idLabel: 'Username Roblox', idHint: 'Nama pengguna tanpa tanda @',
    packages: [
      { qty: '80', price: 13000 },
      { qty: '400', price: 59000, bonus: '+10' },
      { qty: '800', price: 115000, bonus: '+40' },
      { qty: '1700', price: 235000, bonus: '+150' },
    ],
  },
  {
    id: 'steam', name: 'Steam Wallet', pub: 'Valve', icon: 'gift', cat: 'voucher', unit: 'Wallet',
    idLabel: 'Email Steam', idHint: 'Email akun Steam tujuan',
    packages: [
      { qty: 'Rp 50.000', price: 55000 },
      { qty: 'Rp 100.000', price: 109000 },
      { qty: 'Rp 200.000', price: 217000 },
    ],
  },
  {
    id: 'token', name: 'Token Listrik PLN', pub: 'PLN', icon: 'zap', cat: 'voucher', unit: 'Token',
    idLabel: 'Nomor Meter / ID Pelanggan', idHint: '11-12 digit nomor pelanggan PLN',
    packages: [
      { qty: '20.000', price: 21500 },
      { qty: '50.000', price: 52500 },
      { qty: '100.000', price: 104000 },
      { qty: '200.000', price: 207000 },
    ],
  },
  {
    id: 'ml-akun', name: 'Akun Mobile Legends', pub: 'Seller Verified', icon: 'user', cat: 'akun', unit: 'Akun',
    idLabel: 'Email Penerima', idHint: 'Detail akun dikirim ke email ini',
    packages: [
      { qty: 'Mythic — 120 skin', price: 450000 },
      { qty: 'Mythical Glory — 240 skin', price: 950000 },
    ],
  },
];

function formatIDR(n) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

const STATUS_CLASS = { 'Berhasil': 'success', 'Diproses': 'pending', 'Gagal': 'failed' };

const CART_KEY = 'tp_cart';
const ORDER_KEY = 'tp_orders';
const PRODUCT_KEY = 'tp_products';

const SAMPLE_ORDERS = [
  { id: 'TPI-88213', item: 'Mobile Legends — 344 Diamond', qty: 1, date: '14 Agu 2026', total: 57000, status: 'Berhasil' },
  { id: 'TPI-88190', item: 'Free Fire — 140 Diamond', qty: 2, date: '10 Agu 2026', total: 42000, status: 'Berhasil' },
  { id: 'TPI-88147', item: 'PUBG Mobile — 660 UC', qty: 1, date: '08 Agu 2026', total: 165000, status: 'Diproses' },
  { id: 'TPI-87990', item: 'Genshin Impact — 980 Crystal', qty: 1, date: '29 Jul 2026', total: 249000, status: 'Berhasil' },
  { id: 'TPI-87874', item: 'Roblox — 400 Robux', qty: 3, date: '21 Jul 2026', total: 177000, status: 'Gagal' },
  { id: 'TPI-87711', item: 'Token Listrik PLN — 100.000', qty: 1, date: '15 Jul 2026', total: 104000, status: 'Berhasil' },
];

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)); } catch (e) { return null; }
}

function setCart(cart) {
  if (cart) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  else localStorage.removeItem(CART_KEY);
}

function getOrders() {
  try {
    const raw = localStorage.getItem(ORDER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return SAMPLE_ORDERS.slice();
}

function saveOrders(list) {
  localStorage.setItem(ORDER_KEY, JSON.stringify(list));
}

function addOrder(order) {
  const list = getOrders();
  list.unshift(order);
  saveOrders(list);
  return order;
}

function todayID() {
  return new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

const SEED_PRODUCTS = GAMES.map(g => ({ id: g.id, name: g.name, cat: g.cat, price: g.packages[0].price }));

function getProducts() {
  try {
    const raw = localStorage.getItem(PRODUCT_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return SEED_PRODUCTS.slice();
}

function saveProducts(list) {
  localStorage.setItem(PRODUCT_KEY, JSON.stringify(list));
}

function resolveGame(id) {
  const g = GAMES.find(x => x.id === id);
  if (g) return g;
  const p = getProducts().find(x => x.id === id);
  if (!p) return null;
  return {
    id: p.id, name: p.name, pub: 'Seller Verified', icon: 'gamepad', unit: 'Unit',
    idLabel: 'ID / Data Akun', idHint: 'Isi data sesuai produk yang kamu beli',
    packages: [{ qty: 'Paket Reguler', price: p.price }],
  };
}
