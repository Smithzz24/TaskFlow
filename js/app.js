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

// Notificación de errores/éxito al usuario
function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 4px;
    background-color: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#17a2b8'};
    color: white;
    z-index: 9999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease-in-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in-out';
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

// Carga tareas desde localStorage
function loadTasks() {
  try {
    const storedTasks = localStorage.getItem('taskflowTasks');
    const parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];
    
    if (!Array.isArray(parsedTasks)) {
      console.warn('taskflowTasks no es un array válido, usando array vacío');
      tasks = [];
      return;
    }
    
    tasks = parsedTasks.map(task => {
      // Validar que el objeto tenga las propiedades necesarias
      if (!task.id || !task.title) {
        console.warn('Tarea sin ID o título válido:', task);
        return null;
      }
      return {
        id: String(task.id),
        title: String(task.title || ''),
        description: String(task.description || ''),
        category: String(task.category || 'Académica'),
        status: task.completed ? 'done' : 'pending',
        dueDate: task.dueDate || '',
        priority: String(task.priority || 'media'),
        createdAt: task.createdAt || new Date().toISOString(),
        completedAt: task.completedAt || null
      };
    }).filter(task => task !== null);
  } catch (error) {
    console.error('Error al cargar tareas desde localStorage:', error);
    tasks = [];
    showNotification('Error al cargar tareas. Usando lista vacía.', 'error');
  }
}

// Carga categorías desde localStorage
function loadCategories() {
  try {
    const storedCategories = localStorage.getItem('taskflowCategories');
    const parsedCategories = storedCategories ? JSON.parse(storedCategories) : [];
    
    if (!Array.isArray(parsedCategories)) {
      throw new Error('taskflowCategories no es un array válido');
    }
    
    if (taskCategory) {
      taskCategory.innerHTML = '';
      if (parsedCategories.length > 0) {
        parsedCategories.forEach(cat => {
          if (cat.name) {
            const option = document.createElement('option');
            option.value = escapeHTML(cat.name);
            option.textContent = escapeHTML(cat.name);
            taskCategory.appendChild(option);
          }
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
  } catch (error) {
    console.error('Error al cargar categorías:', error);
    // Cargar categorías por defecto en caso de error
    if (taskCategory) {
      taskCategory.innerHTML = '';
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
  try {
    if (!Array.isArray(tasks)) {
      throw new Error('tasks no es un array válido');
    }
    
    const storedTasks = tasks.map(task => {
      if (!task.id || !task.title) {
        throw new Error('Tarea sin ID o título válido');
      }
      return {
        id: task.id,
        title: task.title,
        description: task.description || '',
        category: task.category || 'Académica',
        dueDate: task.dueDate || '',
        priority: task.priority || 'media',
        createdAt: task.createdAt || new Date().toISOString(),
        completed: task.status === 'done',
        completedAt: task.status === 'done' ? task.completedAt || new Date().toISOString() : undefined
      };
    });
    
    localStorage.setItem('taskflowTasks', JSON.stringify(storedTasks));
  } catch (error) {
    console.error('Error al guardar tareas en localStorage:', error);
    showNotification('Error al guardar tareas. Por favor, intenta de nuevo.', 'error');
  }
}

// Escapa texto para uso seguro en HTML.
function escapeHTML(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Devuelve las tareas visibles según el filtro seleccionado.
function getFilteredTasks() {
  if (currentFilter === 'all') return tasks;
  return tasks.filter((task) => task.status === currentFilter);
}

// Renderiza la lista de tareas en el DOM.
function renderTasks() {
  try {
    if (!taskList) return;

    const visibleTasks = getFilteredTasks();
    taskList.innerHTML = '';

    if (visibleTasks.length === 0) {
      taskList.innerHTML = '<li class="task-item empty-state">No hay tareas en este estado. Añade una tarea nueva o cambia el filtro.</li>';
      if (taskCount) {
        taskCount.textContent = '0 tareas';
      }
      return;
    }

    visibleTasks.forEach((task) => {
      try {
        const originalIndex = tasks.findIndex(t => t.id === task.id);
        if (originalIndex === -1) {
          console.warn('Tarea no encontrada en el array:', task);
          return;
        }
        
        const item = document.createElement('li');
        item.className = `task-item ${task.status === 'done' ? 'completed' : ''}`;
        const safeTitle = escapeHTML(task.title || 'Sin título');
        const safeDescription = escapeHTML(task.description || 'Sin descripción adicional');
        const safeCategory = escapeHTML(task.category || 'Sin categoría');
        const labelToggle = task.status === 'done'
          ? `Reabrir tarea ${safeTitle}`
          : `Marcar tarea ${safeTitle} como hecha`;

        item.innerHTML = `
          <div class="task-item-main">
            <div class="task-item-head">
              <span class="task-status-badge ${task.status}">${task.status === 'done' ? 'Hecha' : 'En espera'}</span>
              <span class="task-category-badge">${safeCategory}</span>
            </div>
            <div class="task-item-copy">
              <h4>${safeTitle}</h4>
              <p>${safeDescription}</p>
            </div>
          </div>
          <div class="task-item-actions">
            <button type="button" class="button button-secondary" data-action="toggle" data-index="${originalIndex}" aria-label="${labelToggle}">
              ${task.status === 'done' ? 'Reabrir' : 'Marcar hecha'}
            </button>
            <button type="button" class="button button-ghost" data-action="delete" data-index="${originalIndex}" aria-label="Eliminar tarea ${safeTitle}">Eliminar</button>
          </div>
        `;

        taskList.appendChild(item);
      } catch (error) {
        console.error('Error al renderizar tarea individual:', error, task);
      }
    });

    const visibleCount = visibleTasks.length;
    const totalCount = tasks.length;
    const countText = `${visibleCount} tarea${visibleCount === 1 ? '' : 's'}`;

    if (taskCount) {
      taskCount.textContent = currentFilter === 'all' ? countText : `${countText} de ${totalCount}`;
    }
  } catch (error) {
    console.error('Error al renderizar tareas:', error);
    if (taskList) {
      taskList.innerHTML = '<li class="task-item empty-state">Error al cargar las tareas. Por favor, recarga la página.</li>';
    }
  }
}

// Añade una nueva tarea y actualiza la vista.
function addTask(event) {
  try {
    event.preventDefault();
    
    if (!taskTitle || !taskCategory) {
      showNotification('Error: Elementos del formulario no encontrados', 'error');
      return;
    }

    const title = taskTitle.value.trim();
    const description = taskDesc ? taskDesc.value.trim() : '';
    const category = taskCategory.value;

    if (!title) {
      showNotification('Por favor, ingresa un título para la tarea', 'error');
      return;
    }
    
    if (title.length > 80) {
      showNotification('El título no debe exceder 80 caracteres', 'error');
      return;
    }
    
    if (description.length > 240) {
      showNotification('La descripción no debe exceder 240 caracteres', 'error');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      category,
      status: 'pending',
      dueDate: '',
      priority: 'media',
      createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    taskTitle.value = '';
    if (taskDesc) taskDesc.value = '';
    taskCategory.value = 'Académica';
    
    saveTasks();
    renderTasks();
    showNotification('Tarea creada correctamente', 'success');
  } catch (error) {
    console.error('Error al agregar tarea:', error);
    showNotification('Error al crear la tarea. Por favor, intenta de nuevo.', 'error');
  }
}

// Cambia el estado de una tarea entre pendiente y hecha.
function toggleTaskStatus(index) {
  try {
    if (!Number.isInteger(index) || index < 0 || index >= tasks.length) {
      throw new Error(`Índice de tarea inválido: ${index}`);
    }
    
    tasks[index].status = tasks[index].status === 'done' ? 'pending' : 'done';
    if (tasks[index].status === 'done') {
      tasks[index].completedAt = new Date().toISOString();
    } else {
      delete tasks[index].completedAt;
    }
    
    saveTasks();
    renderTasks();
  } catch (error) {
    console.error('Error al cambiar estado de tarea:', error);
    showNotification('Error al actualizar el estado de la tarea', 'error');
  }
}

// Elimina una tarea al pulsar el botón.
function handleTaskListClick(event) {
  try {
    const button = event.target.closest('button');
    if (!button) return;

    const action = button.dataset.action;
    const index = Number(button.dataset.index);
    
    if (Number.isNaN(index) || !action) {
      throw new Error('Acción o índice inválido');
    }
    
    if (index < 0 || index >= tasks.length) {
      throw new Error(`Índice fuera de rango: ${index}`);
    }

    if (action === 'delete') {
      const taskTitle = escapeHTML(tasks[index].title || 'Sin título');
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
      showNotification('Tarea eliminada correctamente', 'success');
      return;
    }

    if (action === 'toggle') {
      toggleTaskStatus(index);
    }
  } catch (error) {
    console.error('Error en manejo de clic de tarea:', error);
    showNotification('Error al procesar la acción', 'error');
  }
}

// Cambia el filtro de estado y vuelve a renderizar.
function handleFilterChange(event) {
  try {
    const newFilter = event.target.value;
    if (!['all', 'pending', 'done'].includes(newFilter)) {
      throw new Error(`Filtro inválido: ${newFilter}`);
    }
    currentFilter = newFilter;
    renderTasks();
  } catch (error) {
    console.error('Error al cambiar filtro:', error);
    currentFilter = 'all';
    renderTasks();
    showNotification('Error al aplicar filtro', 'error');
  }
}

// Aplica animaciones suaves al hacer scroll.
function handleScrollReveal() {
  try {
    const reveals = document.querySelectorAll('.reveal');
    const viewportHeight = window.innerHeight;

    reveals.forEach((element) => {
      if (!element) return;
      const top = element.getBoundingClientRect().top;
      if (top < viewportHeight - 80) {
        element.classList.add('visible');
      }
    });
  } catch (error) {
    console.error('Error en animación de scroll:', error);
  }
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
  try {
    loadTasks();
    loadCategories();
    
    if (statusFilter) {
      statusFilter.value = currentFilter;
    }

    if (taskList) {
      renderTasks();
    }

    handleScrollReveal();
  } catch (error) {
    console.error('Error durante la carga inicial:', error);
    showNotification('Error al cargar la aplicación', 'error');
  }
});

// Agregar estilos para animaciones de notificaciones
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
