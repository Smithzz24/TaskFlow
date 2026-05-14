const AUTH_STORAGE_KEY = 'taskflowCurrentUser';

function getCurrentUser() {
  return localStorage.getItem(AUTH_STORAGE_KEY);
}

function setCurrentUser(email) {
  localStorage.setItem(AUTH_STORAGE_KEY, email);
}

function clearCurrentUser() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

function handleAuthNav() {
  const currentUser = getCurrentUser();
  const guestLinks = document.querySelectorAll('.js-guest-only');
  const authLinks = document.querySelectorAll('.js-auth-only');
  const authButtons = document.querySelectorAll('.js-auth-cta');
  const guestButtons = document.querySelectorAll('.js-guest-cta');
  const logoutButton = document.querySelector('.js-logout-button');

  guestLinks.forEach((item) => {
    item.style.display = currentUser ? 'none' : '';
  });

  authLinks.forEach((item) => {
    item.style.display = currentUser ? '' : 'none';
  });

  authButtons.forEach((item) => {
    item.style.display = currentUser ? '' : 'none';
  });

  guestButtons.forEach((item) => {
    item.style.display = currentUser ? 'none' : '';
  });

  if (logoutButton) {
    logoutButton.style.display = currentUser ? '' : 'none';
  }
}

function handleLogout(event) {
  event.preventDefault();
  clearCurrentUser();
  window.location.href = '../index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  handleAuthNav();
  const logoutButton = document.querySelector('.js-logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }
});
