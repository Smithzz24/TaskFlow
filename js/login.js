const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

function showMessage(text, type = 'success') {
  loginMessage.textContent = text;
  loginMessage.className = `form-message ${type === 'error' ? 'form-message-error' : 'form-message-success'}`;
}

function getStoredUsers() {
  return JSON.parse(localStorage.getItem('taskflowUsers') || '[]');
}

function findUserByEmail(email) {
  const users = getStoredUsers();
  return users.find((user) => user.email === email.toLowerCase());
}

function handleLogin(event) {
  event.preventDefault();

  if (!loginForm.checkValidity()) {
    showMessage('Completa todos los campos correctamente.', 'error');
    return;
  }

  const emailValue = emailInput.value.trim().toLowerCase();
  const passwordValue = passwordInput.value;
  const user = findUserByEmail(emailValue);

  if (!user) {
    showMessage('No se encontró una cuenta con ese correo.', 'error');
    return;
  }

  const storedPassword = atob(user.password);
  if (passwordValue !== storedPassword) {
    showMessage('Contraseña incorrecta. Intenta de nuevo.', 'error');
    return;
  }

  showMessage(`Bienvenido de nuevo, ${user.name}.`, 'success');
  loginForm.reset();
}

function revealOnLoad() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((element) => element.classList.add('visible'));
}

loginForm.addEventListener('submit', handleLogin);
window.addEventListener('load', revealOnLoad);
