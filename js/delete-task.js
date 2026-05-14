const deleteTaskForm = document.getElementById('delete-task-form');
const deleteTaskSelect = document.getElementById('delete-task-select');
const deleteTaskMessage = document.getElementById('delete-task-message');
const deleteTaskList = document.getElementById('delete-task-list');
const deleteTaskCount = document.getElementById('delete-task-count');

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
    console.error('Error al recuperar tareas:', error);
    showMessage('Error al recuperar las tareas', 'error');
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

function showMessage(text, type = 'success') {
  if (!deleteTaskMessage) return;
  deleteTaskMessage.textContent = text;
  deleteTaskMessage.className = `form-message ${type === 'error' ? 'form-message-error' : 'form-message-success'}`;
  
  if (type === 'success') {
    setTimeout(() => {
      deleteTaskMessage.textContent = '';
      deleteTaskMessage.className = '';
    }, 5000);
  }
}

function renderTaskList() {
  try {
    if (!deleteTaskList) return;
    
    const tasks = getStoredTasks();
    deleteTaskList.innerHTML = '';
    
    if (deleteTaskCount) {
      deleteTaskCount.textContent = `${tasks.length} tarea${tasks.length === 1 ? '' : 's'}`;
    }

    if (tasks.length === 0) {
      deleteTaskList.innerHTML = '<li class="task-item"><p>No hay tareas registradas.</p></li>';
      return;
    }

    tasks.forEach((task) => {
      try {
        const item = document.createElement('li');
        item.className = 'task-item';
        
        const safeTitle = escapeHTML(task.title || 'Sin título');
        const safeDesc = escapeHTML(task.description || 'Sin descripción');
        const dueDateStr = task.dueDate ? `Fecha límite: ${escapeHTML(task.dueDate)}` : 'Sin fecha límite';
        
        item.innerHTML = `
          <div>
            <p><strong>${safeTitle}</strong></p>
            <p>${safeDesc}</p>
            <small>${dueDateStr}</small>
          </div>
        `;
        deleteTaskList.appendChild(item);
      } catch (error) {
        console.error('Error renderizando tarea individual:', error);
      }
    });
  } catch (error) {
    console.error('Error al renderizar lista de tareas:', error);
    if (deleteTaskList) {
      deleteTaskList.innerHTML = '<li class="task-item"><p>Error al cargar las tareas</p></li>';
    }
  }
}

function renderTaskOptions() {
  try {
    if (!deleteTaskSelect) return;
    
    const tasks = getStoredTasks();
    deleteTaskSelect.innerHTML = '<option value="">Elige una tarea...</option>';

    tasks.forEach((task, index) => {
      try {
        if (!task.id && index !== undefined) {
          const option = document.createElement('option');
          option.value = String(index);
          const safeTitle = escapeHTML(task.title || 'Sin título');
          const dateStr = task.dueDate ? ` · ${escapeHTML(task.dueDate)}` : '';
          option.textContent = `${safeTitle}${dateStr}`;
          deleteTaskSelect.appendChild(option);
        }
      } catch (error) {
        console.error('Error renderizando opción individual:', error);
      }
    });
  } catch (error) {
    console.error('Error al renderizar opciones:', error);
  }
}

function handleDeleteTask(event) {
  try {
    event.preventDefault();
    
    if (!deleteTaskSelect) {
      showMessage('Error: Selector de tareas no encontrado', 'error');
      return;
    }
    
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

    const deletedTask = escapeHTML(tasks[index].title || 'Tarea sin título');
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTaskOptions();
    renderTaskList();
    showMessage(`Tarea "${deletedTask}" eliminada correctamente.`, 'success');
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    showMessage('Error al eliminar la tarea. Por favor, intenta de nuevo.', 'error');
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

if (deleteTaskForm) {
  deleteTaskForm.addEventListener('submit', handleDeleteTask);
}

window.addEventListener('load', () => {
  try {
    renderTaskOptions();
    renderTaskList();
    revealOnLoad();
  } catch (error) {
    console.error('Error durante la carga inicial:', error);
    showMessage('Error al cargar la página', 'error');
  }
});
