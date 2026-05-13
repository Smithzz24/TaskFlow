// Selección de elementos del DOM.
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');

let tasks = [];

// Renderiza la lista de tareas en el DOM.
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const item = document.createElement('li');
    item.className = 'task-item';
    item.innerHTML = `
      <p>${task}</p>
      <button type="button" aria-label="Eliminar tarea" data-index="${index}">Eliminar</button>
    `;

    taskList.appendChild(item);
  });

  taskCount.textContent = `${tasks.length} tarea${tasks.length === 1 ? '' : 's'}`;
}

// Añade una nueva tarea y actualiza la vista.
function addTask(event) {
  event.preventDefault();
  const value = taskInput.value.trim();
  if (!value) return;

  tasks.push(value);
  taskInput.value = '';
  renderTasks();
}

// Elimina una tarea al pulsar el botón.
function removeTask(event) {
  const button = event.target.closest('button');
  if (!button) return;

  const index = Number(button.dataset.index);
  if (Number.isNaN(index)) return;

  tasks.splice(index, 1);
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

// Eventos del formulario y lista de tareas.
taskForm.addEventListener('submit', addTask);
taskList.addEventListener('click', removeTask);
window.addEventListener('scroll', handleScrollReveal);
window.addEventListener('load', () => {
  renderTasks();
  handleScrollReveal();
});
