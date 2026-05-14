const updateTaskForm = document.getElementById('update-task-form');
const updateTaskMessage = document.getElementById('update-task-message');
const titleInput = document.getElementById('task-title');
const descInput = document.getElementById('task-desc');
const dateInput = document.getElementById('task-date');
const priorityInput = document.getElementById('task-priority');

function escapeHTML(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showMessage(text, type = 'success') {
  if (!updateTaskMessage) return;
  updateTaskMessage.textContent = text;
  updateTaskMessage.className = `form-message ${type === 'error' ? 'form-message-error' : 'form-message-success'}`;
  
  if (type === 'success') {
    setTimeout(() => {
      updateTaskMessage.textContent = '';
      updateTaskMessage.className = '';
    }, 5000);
  }
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
    showMessage('Error al recuperar tareas', 'error');
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
    showMessage('Error al guardar cambios', 'error');
    throw error;
  }
}

function getTaskIdFromUrl() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
      throw new Error('No se especificó un ID de tarea en la URL');
    }
    
    return id;
  } catch (error) {
    console.error('Error al obtener ID de URL:', error);
    return null;
  }
}

function loadTaskForEditing() {
  try {
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

    // Validate and populate form with task data
    if (titleInput) {
      titleInput.value = escapeHTML(task.title || '');
    }
    if (descInput) {
      descInput.value = escapeHTML(task.description || '');
    }
    if (dateInput) {
      dateInput.value = task.dueDate || '';
    }
    if (priorityInput) {
      priorityInput.value = task.priority || 'media';
    }
  } catch (error) {
    console.error('Error al cargar tarea para editar:', error);
    showMessage('Error al cargar la tarea', 'error');
  }
}

function handleUpdateTask(event) {
  try {
    event.preventDefault();

    if (!updateTaskForm) {
      showMessage('Error: Formulario no encontrado', 'error');
      return;
    }

    if (!updateTaskForm.checkValidity()) {
      showMessage('Por favor, completa el título de la tarea antes de actualizar.', 'error');
      return;
    }

    const taskId = getTaskIdFromUrl();
    if (!taskId) {
      showMessage('Error: No se puede identificar la tarea a actualizar.', 'error');
      return;
    }

    const title = titleInput ? titleInput.value.trim() : '';
    const description = descInput ? descInput.value.trim() : '';
    const dueDate = dateInput ? dateInput.value : '';
    const priority = priorityInput ? priorityInput.value : 'media';

    if (!title) {
      showMessage('El título de la tarea no puede estar vacío', 'error');
      return;
    }
    
    if (title.length > 80) {
      showMessage('El título no debe exceder 80 caracteres', 'error');
      return;
    }
    
    if (description.length > 240) {
      showMessage('La descripción no debe exceder 240 caracteres', 'error');
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
      title: escapeHTML(title),
      description: escapeHTML(description),
      dueDate,
      priority,
      updatedAt: new Date().toISOString()
    };

    saveTasks(tasks);
    showMessage('Tarea actualizada correctamente.', 'success');

    // Redirect back after a short delay
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 2000);
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    showMessage('Error al actualizar la tarea. Por favor, intenta de nuevo.', 'error');
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

if (updateTaskForm) {
  updateTaskForm.addEventListener('submit', handleUpdateTask);
}

window.addEventListener('load', () => {
  try {
    loadTaskForEditing();
    revealOnLoad();
  } catch (error) {
    console.error('Error durante la carga inicial:', error);
    showMessage('Error al cargar la página', 'error');
  }
});