const completeTaskForm = document.getElementById('complete-task-form');
const taskSelect = document.getElementById('task-select');

function escapeHTML(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 4px;
    background-color: ${type === 'error' ? '#dc3545' : '#28a745'};
    color: white;
    z-index: 9999;
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

function getStoredTasks() {
  try {
    const stored = localStorage.getItem('taskflowTasks');
    const tasks = stored ? JSON.parse(stored) : [];
    
    if (!Array.isArray(tasks)) {
      console.warn('taskflowTasks no es un array válido');
      return [];
    }
    
    return tasks;
  } catch (error) {
    console.error('Error al recuperar tareas:', error);
    showNotification('Error al recuperar tareas', 'error');
    return [];
  }
}

function saveTasks(tasks) {
  try {
    if (!Array.isArray(tasks)) {
      throw new Error('tasks debe ser un array');
    }
    localStorage.setItem('taskflowTasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error al guardar tareas:', error);
    showNotification('Error al guardar cambios', 'error');
    throw error;
  }
}

function loadTasks() {
  try {
    if (!taskSelect) {
      throw new Error('taskSelect element not found');
    }
    
    const tasks = getStoredTasks();
    taskSelect.innerHTML = '<option value="">Selecciona una tarea...</option>';
    
    const pendingTasks = tasks.filter(task => !task.completed);
    
    if (pendingTasks.length === 0) {
      const option = document.createElement('option');
      option.disabled = true;
      option.textContent = 'No hay tareas pendientes';
      taskSelect.appendChild(option);
      return;
    }
    
    pendingTasks.forEach(task => {
      if (task.id && task.title) {
        const option = document.createElement('option');
        option.value = String(task.id);
        option.textContent = escapeHTML(task.title);
        taskSelect.appendChild(option);
      }
    });
  } catch (error) {
    console.error('Error al cargar tareas:', error);
    showNotification('Error al cargar tareas', 'error');
  }
}

function handleCompleteTask(event) {
  try {
    event.preventDefault();

    if (!taskSelect) {
      throw new Error('taskSelect element not found');
    }

    const taskId = taskSelect.value;
    if (!taskId) {
      showNotification('Selecciona una tarea para completar', 'error');
      return;
    }

    const tasks = getStoredTasks();
    const taskIndex = tasks.findIndex(task => String(task.id) === taskId);
    
    if (taskIndex === -1) {
      showNotification('Tarea no encontrada', 'error');
      return;
    }

    if (tasks[taskIndex].completed) {
      showNotification('Esta tarea ya está completada', 'error');
      return;
    }

    tasks[taskIndex].completed = true;
    tasks[taskIndex].completedAt = new Date().toISOString();
    
    saveTasks(tasks);
    
    const taskTitle = escapeHTML(tasks[taskIndex].title || 'Sin título');
    showNotification(`Tarea "${taskTitle}" completada correctamente`, 'success');
    
    loadTasks();
    taskSelect.value = '';
  } catch (error) {
    console.error('Error al completar tarea:', error);
    showNotification('Error al completar la tarea', 'error');
  }
}

function revealOnLoad() {
  try {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((element) => {
      if (element) {
        element.classList.add('visible');
      }
    });
  } catch (error) {
    console.error('Error en animación de carga:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    loadTasks();
    revealOnLoad();
  } catch (error) {
    console.error('Error durante la carga inicial:', error);
    showNotification('Error al cargar la página', 'error');
  }
});

if (completeTaskForm) {
  completeTaskForm.addEventListener('submit', handleCompleteTask);
}