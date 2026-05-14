const updateTaskForm = document.getElementById('update-task-form');
const updateTaskMessage = document.getElementById('update-task-message');
const titleInput = document.getElementById('task-title');
const descInput = document.getElementById('task-desc');
const dateInput = document.getElementById('task-date');
const priorityInput = document.getElementById('task-priority');

function showMessage(text, type = 'success') {
  updateTaskMessage.textContent = text;
  updateTaskMessage.className = `form-message ${type === 'error' ? 'form-message-error' : 'form-message-success'}`;
}

function getStoredTasks() {
  return JSON.parse(localStorage.getItem('taskflowTasks') || '[]');
}

function saveTasks(tasks) {
  localStorage.setItem('taskflowTasks', JSON.stringify(tasks));
}

function getTaskIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

function loadTaskForEditing() {
  const taskId = getTaskIdFromUrl();
  if (!taskId) {
    showMessage('No se especificó una tarea para actualizar.', 'error');
    return;
  }

  const tasks = getStoredTasks();
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    showMessage('La tarea especificada no existe.', 'error');
    return;
  }

  // Populate form with task data
  titleInput.value = task.title || '';
  descInput.value = task.description || '';
  dateInput.value = task.dueDate || '';
  priorityInput.value = task.priority || 'media';
}

function handleUpdateTask(event) {
  event.preventDefault();

  if (!updateTaskForm.checkValidity()) {
    showMessage('Completa el título de la tarea antes de actualizar.', 'error');
    return;
  }

  const taskId = getTaskIdFromUrl();
  if (!taskId) {
    showMessage('Error: No se puede identificar la tarea a actualizar.', 'error');
    return;
  }

  const tasks = getStoredTasks();
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    showMessage('La tarea especificada no existe.', 'error');
    return;
  }

  // Update the task
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: titleInput.value.trim(),
    description: descInput.value.trim(),
    dueDate: dateInput.value,
    priority: priorityInput.value,
  };

  saveTasks(tasks);
  showMessage('Tarea actualizada correctamente.', 'success');

  // Optionally redirect back after a short delay
  setTimeout(() => {
    window.location.href = '../index.html';
  }, 2000);
}

function revealOnLoad() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((element) => element.classList.add('visible'));
}

updateTaskForm.addEventListener('submit', handleUpdateTask);
window.addEventListener('load', () => {
  loadTaskForEditing();
  revealOnLoad();
});