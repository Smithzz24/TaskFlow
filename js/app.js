// Selección de elementos del DOM.
const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskDesc = document.getElementById('task-desc');
const taskCategory = document.getElementById('task-category');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const statusFilter = document.getElementById('status-filter');

let tasks = [];
let currentFilter = 'all';

// Carga tareas desde localStorage
function loadTasks() {
  const storedTasks = JSON.parse(localStorage.getItem('taskflowTasks') || '[]');
  tasks = storedTasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    category: task.category || 'Académica', // Default category if not set
    status: task.completed ? 'done' : 'pending',
    dueDate: task.dueDate,
    priority: task.priority,
    createdAt: task.createdAt,
    completedAt: task.completedAt
  }));
}

// Carga categorías desde localStorage
function loadCategories() {
  const storedCategories = JSON.parse(localStorage.getItem('taskflowCategories') || '[]');
  if (taskCategory) {
    taskCategory.innerHTML = '';
    if (storedCategories.length > 0) {
      storedCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        taskCategory.appendChild(option);
      });
    } else {
      // Categorías por defecto
      const defaultCategories = ['Académica', 'Personal', 'Trabajo', 'Salud'];
      defaultCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        taskCategory.appendChild(option);
      });
    }
  }
}

// Guarda tareas en localStorage
function saveTasks() {
  const storedTasks = tasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    category: task.category,
    dueDate: task.dueDate,
    priority: task.priority,
    createdAt: task.createdAt,
    completed: task.status === 'done',
    completedAt: task.status === 'done' ? task.completedAt || new Date().toISOString() : undefined
  }));
  localStorage.setItem('taskflowTasks', JSON.stringify(storedTasks));
}

// Devuelve las tareas visibles según el filtro seleccionado.
function getFilteredTasks() {
  if (currentFilter === 'all') return tasks;
  return tasks.filter((task) => task.status === currentFilter);
}

// Renderiza la lista de tareas en el DOM.
function renderTasks() {
  if (!taskList) return;

  const visibleTasks = getFilteredTasks();
  taskList.innerHTML = '';

  if (visibleTasks.length === 0) {
    taskList.innerHTML = '<li class="task-item empty-state">No hay tareas en este estado. Añade una tarea nueva o cambia el filtro.</li>';
  }

  visibleTasks.forEach((task, visibleIndex) => {
    // Find the original index in tasks array
    const originalIndex = tasks.findIndex(t => t.id === task.id);
    const item = document.createElement('li');
    item.className = `task-item ${task.status === 'done' ? 'completed' : ''}`;
    item.innerHTML = `
      <div class="task-item-main">
        <div class="task-item-head">
          <span class="task-status-badge ${task.status}">${task.status === 'done' ? 'Hecha' : 'En espera'}</span>
          <span class="task-category-badge">${task.category}</span>
        </div>
        <div class="task-item-copy">
          <h4>${task.title}</h4>
          <p>${task.description || 'Sin descripción adicional'}</p>
        </div>
      </div>
      <div class="task-item-actions">
        <button type="button" class="button button-secondary" data-action="toggle" data-index="${originalIndex}">
          ${task.status === 'done' ? 'Reabrir' : 'Marcar hecha'}
        </button>
        <button type="button" class="button button-ghost" data-action="delete" data-index="${originalIndex}">Eliminar</button>
      </div>
    `;

    taskList.appendChild(item);
  });

  const visibleCount = visibleTasks.length;
  const totalCount = tasks.length;
  const countText = `${visibleCount} tarea${visibleCount === 1 ? '' : 's'}`;

  if (taskCount) {
    taskCount.textContent = currentFilter === 'all' ? countText : `${countText} de ${totalCount}`;
  }
}

// Añade una nueva tarea y actualiza la vista.
function addTask(event) {
  event.preventDefault();
  if (!taskTitle || !taskCategory) return;

  const title = taskTitle.value.trim();
  const description = taskDesc ? taskDesc.value.trim() : '';
  const category = taskCategory.value;

  if (!title) return;

  tasks.push({
    id: Date.now().toString(),
    title,
    description,
    category,
    status: 'pending',
    dueDate: '',
    priority: 'media', // Default priority
    createdAt: new Date().toISOString()
  });

  taskTitle.value = '';
  if (taskDesc) taskDesc.value = '';
  taskCategory.value = 'Académica';
  saveTasks();
  renderTasks();
}

// Cambia el estado de una tarea entre pendiente y hecha.
function toggleTaskStatus(index) {
  if (!Number.isInteger(index) || index < 0 || index >= tasks.length) return;
  tasks[index].status = tasks[index].status === 'done' ? 'pending' : 'done';
  if (tasks[index].status === 'done') {
    tasks[index].completedAt = new Date().toISOString();
  } else {
    delete tasks[index].completedAt;
  }
  saveTasks();
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
    saveTasks();
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
  loadTasks();
  loadCategories();
  if (statusFilter) {
    statusFilter.value = currentFilter;
  }

  if (taskList) {
    renderTasks();
  }

  handleScrollReveal();
});
