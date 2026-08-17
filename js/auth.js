const ROLE_KEY = 'role';

const NAV_BY_ROLE = {
  guest: ['home', 'topup'],
  user: ['home', 'topup', 'history', 'account'],
  admin: ['home', 'topup', 'history', 'account', 'admin'],
};

function getRole() {
  return localStorage.getItem(ROLE_KEY) || 'guest';
}

function setRole(role) {
  localStorage.setItem(ROLE_KEY, role);
}

function logout() {
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem('tp_uid');
  localStorage.removeItem('tp_username');
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
