const createTaskForm = document.getElementById('create-task-form');
const createTaskMessage = document.getElementById('create-task-message');
const titleInput = document.getElementById('task-title');
const descInput = document.getElementById('task-desc');
const dateInput = document.getElementById('task-date');
const priorityInput = document.getElementById('task-priority');
const categoryInput = document.getElementById('task-category');

function showMessage(text, type = 'success') {
  createTaskMessage.textContent = text;
  createTaskMessage.className = `form-message ${type === 'error' ? 'form-message-error' : 'form-message-success'}`;
}

function getStoredTasks() {
  return JSON.parse(localStorage.getItem('taskflowTasks') || '[]');
}

function saveTask(task) {
  const tasks = getStoredTasks();
  tasks.push(task);
  localStorage.setItem('taskflowTasks', JSON.stringify(tasks));
}

function handleCreateTask(event) {
  event.preventDefault();

  if (!createTaskForm.checkValidity()) {
    showMessage('Completa el título de la tarea antes de guardar.', 'error');
    return;
  }

  const task = {
    id: Date.now().toString(),
    title: titleInput.value.trim(),
    description: descInput.value.trim(),
    dueDate: dateInput.value,
    priority: priorityInput.value,
    category: categoryInput.value,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  saveTask(task);
  createTaskForm.reset();
  showMessage('Tarea creada correctamente. Revisa tu lista en la pantalla principal.', 'success');
}

function revealOnLoad() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((element) => element.classList.add('visible'));
}

createTaskForm.addEventListener('submit', handleCreateTask);
window.addEventListener('load', revealOnLoad);
