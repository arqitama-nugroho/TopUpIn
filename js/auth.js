const ROLE_KEY = 'role';

const NAV_BY_ROLE = {
  guest: ['home', 'topup', 'voucher', 'akun'],
  user: ['home', 'topup', 'voucher', 'akun', 'history', 'account'],
  admin: ['home', 'topup', 'voucher', 'akun', 'history', 'account', 'admin'],
};

function getRole() {
  return localStorage.getItem(ROLE_KEY) || 'guest';
}

function setRole(role) {
  localStorage.setItem(ROLE_KEY, role);
}

function logout() {
  localStorage.removeItem(ROLE_KEY);
  location.href = 'login.html';
}

function requireRole(roles) {
  if (!roles.includes(getRole())) {
    location.replace('login.html');
  }
}

function filterNav() {
  const role = getRole();
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.style.display = NAV_BY_ROLE[role].includes(link.dataset.nav) ? '' : 'none';
  });
}

document.addEventListener('DOMContentLoaded', filterNav);
