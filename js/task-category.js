const categoryForm = document.getElementById('category-form');
const categoryNameInput = document.getElementById('category-name');
const categoryColorInput = document.getElementById('category-color');
const categoriesList = document.getElementById('categories-list');

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

function getStoredCategories() {
  try {
    const stored = localStorage.getItem('taskflowCategories');
    const categories = stored ? JSON.parse(stored) : [];
    
    if (!Array.isArray(categories)) {
      console.warn('taskflowCategories no es un array válido');
      return [];
    }
    
    return categories;
  } catch (error) {
    console.error('Error al recuperar categorías:', error);
    showNotification('Error al recuperar categorías', 'error');
    return [];
  }
}

function saveCategories(categories) {
  try {
    if (!Array.isArray(categories)) {
      throw new Error('categories debe ser un array');
    }
    localStorage.setItem('taskflowCategories', JSON.stringify(categories));
  } catch (error) {
    console.error('Error al guardar categorías:', error);
    showNotification('Error al guardar categorías', 'error');
    throw error;
  }
}

function loadCategories() {
  try {
    if (!categoriesList) {
      throw new Error('categoriesList element not found');
    }
    
    const categories = getStoredCategories();
    categoriesList.innerHTML = '';
    
    if (categories.length === 0) {
      categoriesList.innerHTML = '<p style="color: #999; text-align: center;">No hay categorías creadas aún.</p>';
      return;
    }
    
    categories.forEach(category => {
      try {
        if (!category.id || !category.name) {
          console.warn('Categoría sin id o nombre válido:', category);
          return;
        }
        
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        const safeName = escapeHTML(category.name);
        const safeColor = /^#[0-9A-F]{6}$/i.test(category.color) ? category.color : '#007bff';
        
        categoryItem.innerHTML = `
          <span class="category-name" style="color: ${safeColor}">${safeName}</span>
          <button class="delete-category" data-id="${category.id}" aria-label="Eliminar categoría ${safeName}">Eliminar</button>
        `;
        categoriesList.appendChild(categoryItem);
      } catch (error) {
        console.error('Error renderizando categoría individual:', error);
      }
    });

    // Agregar event listeners para eliminar
    document.querySelectorAll('.delete-category').forEach(button => {
      button.addEventListener('click', handleDeleteCategory);
    });
  } catch (error) {
    console.error('Error al cargar categorías:', error);
    if (categoriesList) {
      categoriesList.innerHTML = '<p style="color: #999; text-align: center;">Error al cargar categorías</p>';
    }
  }
}

function handleCreateCategory(event) {
  try {
    event.preventDefault();

    if (!categoryForm) {
      showNotification('Error: Formulario no encontrado', 'error');
      return;
    }

    if (!categoryForm.checkValidity()) {
      showNotification('Por favor, ingresa un nombre para la categoría.', 'error');
      return;
    }

    const name = categoryNameInput ? categoryNameInput.value.trim() : '';
    const color = categoryColorInput ? categoryColorInput.value : '#007bff';

    if (!name) {
      showNotification('El nombre de la categoría no puede estar vacío', 'error');
      return;
    }
    
    if (name.length > 50) {
      showNotification('El nombre de la categoría no debe exceder 50 caracteres', 'error');
      return;
    }

    // Validar color
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      showNotification('El color debe ser un código hexadecimal válido', 'error');
      return;
    }

    const category = {
      id: Date.now().toString(),
      name: escapeHTML(name),
      color,
      createdAt: new Date().toISOString(),
    };

    const categories = getStoredCategories();
    
    // Verificar que no exista una categoría con el mismo nombre
    if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
      showNotification('Ya existe una categoría con ese nombre', 'error');
      return;
    }
    
    categories.push(category);
    saveCategories(categories);

    if (categoryForm) {
      categoryForm.reset();
      if (categoryColorInput) {
        categoryColorInput.value = '#007bff';
      }
    }
    
    loadCategories();
    showNotification('Categoría creada correctamente.', 'success');
  } catch (error) {
    console.error('Error al crear categoría:', error);
    showNotification('Error al crear la categoría. Por favor, intenta de nuevo.', 'error');
  }
}

function handleDeleteCategory(event) {
  try {
    const categoryId = event.target.dataset.id;
    
    if (!categoryId) {
      showNotification('Error: ID de categoría no válido', 'error');
      return;
    }

    const categories = getStoredCategories();
    const categoryToDelete = categories.find(cat => cat.id === categoryId);
    
    if (!categoryToDelete) {
      showNotification('Categoría no encontrada', 'error');
      return;
    }

    if (confirm(`¿Estás seguro de que deseas eliminar la categoría "${escapeHTML(categoryToDelete.name)}"?`)) {
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      saveCategories(updatedCategories);
      loadCategories();
      showNotification('Categoría eliminada correctamente.', 'success');
    }
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    showNotification('Error al eliminar la categoría', 'error');
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
    loadCategories();
    revealOnLoad();
  } catch (error) {
    console.error('Error durante la carga inicial:', error);
    showNotification('Error al cargar la página', 'error');
  }
});

if (categoryForm) {
  categoryForm.addEventListener('submit', handleCreateCategory);
}