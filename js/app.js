// Selección de elementos del DOM.
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const statusFilter = document.getElementById('status-filter');

let tasks = [];
let currentFilter = 'all';

// Devuelve las tareas visibles según el filtro seleccionado.
function getFilteredTasks() {
  if (currentFilter === 'all') return tasks;
  return tasks.filter((task) => task.status === currentFilter);
}

// Renderiza la lista de tareas en el DOM.
function renderTasks() {
  const visibleTasks = getFilteredTasks();
  taskList.innerHTML = '';

  if (visibleTasks.length === 0) {
    taskList.innerHTML = '<li class="task-item empty-state">No hay tareas en este estado. Añade una tarea nueva o cambia el filtro.</li>';
  }

  visibleTasks.forEach((task) => {
    const actualIndex = tasks.indexOf(task);
    const item = document.createElement('li');
    item.className = `task-item ${task.status === 'done' ? 'completed' : ''}`;
    item.innerHTML = `
      <div class="task-item-main">
        <span class="task-status-badge ${task.status}">${task.status === 'done' ? 'Hecha' : 'Pendiente'}</span>
        <p>${task.text}</p>
      </div>
      <div class="task-item-actions">
        <button type="button" class="button button-secondary" data-action="toggle" data-index="${actualIndex}">
          ${task.status === 'done' ? 'Reabrir' : 'Marcar hecha'}
        </button>
        <button type="button" class="button button-ghost" data-action="delete" data-index="${actualIndex}">Eliminar</button>
      </div>
    `;

    taskList.appendChild(item);
  });

  const visibleCount = visibleTasks.length;
  const totalCount = tasks.length;
  const countText = `${visibleCount} tarea${visibleCount === 1 ? '' : 's'}`;
  taskCount.textContent = currentFilter === 'all' ? countText : `${countText} de ${totalCount}`;
}

// Añade una nueva tarea y actualiza la vista.
function addTask(event) {
  event.preventDefault();
  if (!taskInput) return;

  const value = taskInput.value.trim();
  if (!value) return;

  tasks.push({ text: value, status: 'pending' });
  taskInput.value = '';
  renderTasks();
}

// Cambia el estado de una tarea entre pendiente y hecha.
function toggleTaskStatus(index) {
  if (!Number.isInteger(index) || index < 0 || index >= tasks.length) return;
  tasks[index].status = tasks[index].status === 'done' ? 'pending' : 'done';
  renderTasks();
}

// Elimina una tarea al pulsar el botón.
function handleTaskListClick(event) {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const index = Number(button.dataset.index);
  if (Number.isNaN(index)) return;

  if (action === 'delete') {
    tasks.splice(index, 1);
    renderTasks();
    return;
  }

  if (action === 'toggle') {
    toggleTaskStatus(index);
  }
}

// Cambia el filtro de estado y vuelve a renderizar.
function handleFilterChange(event) {
  currentFilter = event.target.value;
  renderTasks();
}

// Aplica animaciones suaves al hacer scroll.
function handleScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const viewportHeight = window.innerHeight;

  reveals.forEach((element) => {
    const top = element.getBoundingClientRect().top;
    if (top < viewportHeight - 80) {
      element.classList.add('visible');
    }
  });
}

if (taskForm) {
  taskForm.addEventListener('submit', addTask);
}

if (taskList) {
  taskList.addEventListener('click', handleTaskListClick);
}

if (statusFilter) {
  statusFilter.addEventListener('change', handleFilterChange);
}

window.addEventListener('scroll', handleScrollReveal);
window.addEventListener('load', () => {
  if (statusFilter) {
    statusFilter.value = currentFilter;
  }

  if (taskList) {
    renderTasks();
  }

  handleScrollReveal();
});
