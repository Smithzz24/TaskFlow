const createTaskForm = document.getElementById('create-task-form');
const createTaskMessage = document.getElementById('create-task-message');
const titleInput = document.getElementById('task-title');
const descInput = document.getElementById('task-desc');
const dateInput = document.getElementById('task-date');
const priorityInput = document.getElementById('task-priority');

function showMessage(text, type = 'success') {
  if (!createTaskMessage) return;
  createTaskMessage.textContent = text;
  createTaskMessage.className = `form-message ${type === 'error' ? 'form-message-error' : 'form-message-success'}`;
  
  // Auto-ocultar mensaje después de 5 segundos
  if (type === 'success') {
    setTimeout(() => {
      createTaskMessage.textContent = '';
      createTaskMessage.className = '';
    }, 5000);
  }
}

function escapeHTML(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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
    console.error('Error al recuperar tareas de localStorage:', error);
    showMessage('Error al recuperar tareas del almacenamiento', 'error');
    return [];
  }
}

function saveTask(task) {
  try {
    // Validar objeto de tarea
    if (!task || typeof task !== 'object') {
      throw new Error('Task debe ser un objeto válido');
    }
    
    if (!task.id || !task.title) {
      throw new Error('Task debe tener id y title');
    }
    
    const tasks = getStoredTasks();
    tasks.push({
      id: task.id,
      title: escapeHTML(task.title),
      description: escapeHTML(task.description || ''),
      dueDate: task.dueDate || '',
      priority: task.priority || 'media',
      category: task.category || 'Académica',
      createdAt: task.createdAt || new Date().toISOString(),
      completed: false
    });
    
    localStorage.setItem('taskflowTasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error al guardar tarea:', error);
    showMessage('Error al guardar la tarea. Por favor, intenta de nuevo.', 'error');
    throw error;
  }
}

function handleCreateTask(event) {
  try {
    event.preventDefault();

    if (!createTaskForm) {
      showMessage('Error: Formulario no encontrado', 'error');
      return;
    }

    if (!createTaskForm.checkValidity()) {
      showMessage('Por favor, completa el título de la tarea antes de guardar.', 'error');
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

    const task = {
      id: Date.now().toString(),
      title,
      description,
      dueDate,
      priority,
      category: 'Académica',
      createdAt: new Date().toISOString(),
    };

    saveTask(task);
    
    if (createTaskForm) {
      createTaskForm.reset();
    }
    
    showMessage('Tarea creada correctamente. Revisa tu lista en la pantalla principal.', 'success');
  } catch (error) {
    console.error('Error al crear tarea:', error);
    showMessage('Error al crear la tarea. Por favor, intenta de nuevo.', 'error');
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

if (createTaskForm) {
  createTaskForm.addEventListener('submit', handleCreateTask);
}

window.addEventListener('load', revealOnLoad);
