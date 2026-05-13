const registerForm = document.getElementById('register-form');
const registerMessage = document.getElementById('register-message');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');

function showMessage(text, type = 'success') {
  registerMessage.textContent = text;
  registerMessage.className = `form-message ${type === 'error' ? 'form-message-error' : 'form-message-success'}`;
}

function getStoredUsers() {
  return JSON.parse(localStorage.getItem('taskflowUsers') || '[]');
}

function saveUser(user) {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem('taskflowUsers', JSON.stringify(users));
}

function isEmailRegistered(email) {
  const users = getStoredUsers();
  return users.some((user) => user.email === email.toLowerCase());
}

function handleRegistration(event) {
  event.preventDefault();

  if (!registerForm.checkValidity()) {
    showMessage('Completa todos los campos correctamente.', 'error');
    return;
  }

  if (passwordInput.value !== confirmPasswordInput.value) {
    showMessage('Las contraseñas no coinciden.', 'error');
    return;
  }

  const emailValue = emailInput.value.trim().toLowerCase();

  if (isEmailRegistered(emailValue)) {
    showMessage('Este correo ya está registrado. Inicia sesión o usa otro correo.', 'error');
    return;
  }

  saveUser({
    name: nameInput.value.trim(),
    email: emailValue,
    password: btoa(passwordInput.value),
    registeredAt: new Date().toISOString(),
  });

  registerForm.reset();
  showMessage('Cuenta creada con éxito. Ya puedes volver a la página principal.', 'success');
}

function revealOnLoad() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((element) => element.classList.add('visible'));
}

registerForm.addEventListener('submit', handleRegistration);
window.addEventListener('load', revealOnLoad);
