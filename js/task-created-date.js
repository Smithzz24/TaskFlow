const dateFilterForm = document.getElementById('date-filter-form');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const filteredTasksContainer = document.getElementById('filtered-tasks');

function getStoredTasks() {
  return JSON.parse(localStorage.getItem('taskflowTasks') || '[]');
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}

function displayTasks(tasks) {
  filteredTasksContainer.innerHTML = '';
  
  if (tasks.length === 0) {
    filteredTasksContainer.innerHTML = '<p class="no-tasks">No hay tareas en este período.</p>';
    return;
  }

  tasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    taskElement.innerHTML = `
      <div class="task-header">
        <h3>${task.title}</h3>
        <span class="priority-badge priority-${task.priority}">${task.priority}</span>
      </div>
      <p class="task-description">${task.description}</p>
      <div class="task-meta">
        <span class="created-date">Creada: ${formatDate(task.createdAt)}</span>
        <span class="due-date">Vence: ${task.dueDate ? formatDate(task.dueDate) : 'Sin fecha'}</span>
      </div>
    `;
    filteredTasksContainer.appendChild(taskElement);
  });
}

function handleFilterTasks(event) {
  event.preventDefault();

  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (!startDate || !endDate) {
    alert('Ingresa ambas fechas para filtrar.');
    return;
  }

  const tasks = getStoredTasks();
  const filtered = tasks.filter(task => {
    const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
    return taskDate >= startDate && taskDate <= endDate;
  });

  displayTasks(filtered);
}

function revealOnLoad() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((element) => element.classList.add('visible'));
}

document.addEventListener('DOMContentLoaded', () => {
  // Establecer fechas por defecto (últimos 30 días)
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  endDateInput.valueAsDate = today;
  startDateInput.valueAsDate = thirtyDaysAgo;
  
  revealOnLoad();
});

dateFilterForm.addEventListener('submit', handleFilterTasks);