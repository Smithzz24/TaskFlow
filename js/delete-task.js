const deleteTaskForm = document.getElementById('delete-task-form');
const deleteTaskSelect = document.getElementById('delete-task-select');
const deleteTaskMessage = document.getElementById('delete-task-message');
const deleteTaskList = document.getElementById('delete-task-list');
const deleteTaskCount = document.getElementById('delete-task-count');

function getStoredTasks() {
  return JSON.parse(localStorage.getItem('taskflowTasks') || '[]');
}

function saveTasks(tasks) {
  localStorage.setItem('taskflowTasks', JSON.stringify(tasks));
}

function showMessage(text, type = 'success') {
  deleteTaskMessage.textContent = text;
  deleteTaskMessage.className = `form-message ${type === 'error' ? 'form-message-error' : 'form-message-success'}`;
}

function renderTaskList() {
  const tasks = getStoredTasks();
  deleteTaskList.innerHTML = '';
  deleteTaskCount.textContent = `${tasks.length} tarea${tasks.length === 1 ? '' : 's'}`;

  if (tasks.length === 0) {
    deleteTaskList.innerHTML = '<li class="task-item"><p>No hay tareas registradas.</p></li>';
    return;
  }

  tasks.forEach((task, index) => {
    const item = document.createElement('li');
    item.className = 'task-item';
    item.innerHTML = `
      <div>
        <p><strong>${task.title}</strong></p>
        <p>${task.description || 'Sin descripción'}</p>
        <small>${task.dueDate ? `Fecha límite: ${task.dueDate}` : 'Sin fecha límite'}</small>
      </div>
    `;
    deleteTaskList.appendChild(item);
  });
}

function renderTaskOptions() {
  const tasks = getStoredTasks();
  deleteTaskSelect.innerHTML = '<option value="">Elige una tarea...</option>';

  tasks.forEach((task, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = `${task.title} ${task.dueDate ? `· ${task.dueDate}` : ''}`;
    deleteTaskSelect.appendChild(option);
  });
}

function handleDeleteTask(event) {
  event.preventDefault();
  const selectedIndex = deleteTaskSelect.value;

  if (selectedIndex === '') {
    showMessage('Selecciona primero una tarea para eliminar.', 'error');
    return;
  }

  const tasks = getStoredTasks();
  const index = Number(selectedIndex);

  if (Number.isNaN(index) || index < 0 || index >= tasks.length) {
    showMessage('Tarea no válida. Intenta de nuevo.', 'error');
    return;
  }

  tasks.splice(index, 1);
  saveTasks(tasks);
  renderTaskOptions();
  renderTaskList();
  showMessage('Tarea eliminada correctamente.', 'success');
}

function revealOnLoad() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((element) => element.classList.add('visible'));
}

deleteTaskForm.addEventListener('submit', handleDeleteTask);
window.addEventListener('load', () => {
  renderTaskOptions();
  renderTaskList();
  revealOnLoad();
});
