const completeTaskForm = document.getElementById('complete-task-form');
const taskSelect = document.getElementById('task-select');

function getStoredTasks() {
  return JSON.parse(localStorage.getItem('taskflowTasks') || '[]');
}

function saveTasks(tasks) {
  localStorage.setItem('taskflowTasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = getStoredTasks();
  taskSelect.innerHTML = '<option value="">Selecciona una tarea...</option>';
  tasks.forEach(task => {
    if (!task.completed) {
      const option = document.createElement('option');
      option.value = task.id;
      option.textContent = task.title;
      taskSelect.appendChild(option);
    }
  });
}

function handleCompleteTask(event) {
  event.preventDefault();

  const taskId = taskSelect.value;
  if (!taskId) {
    alert('Selecciona una tarea para completar.');
    return;
  }

  const tasks = getStoredTasks();
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = true;
    tasks[taskIndex].completedAt = new Date().toISOString();
    saveTasks(tasks);
    alert('Tarea completada correctamente.');
    loadTasks(); // Recargar la lista
  }
}

function revealOnLoad() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((element) => element.classList.add('visible'));
}

document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  revealOnLoad();
});

completeTaskForm.addEventListener('submit', handleCompleteTask);