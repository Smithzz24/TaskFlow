const categoryForm = document.getElementById('category-form');
const categoryNameInput = document.getElementById('category-name');
const categoryColorInput = document.getElementById('category-color');
const categoriesList = document.getElementById('categories-list');

function getStoredCategories() {
  return JSON.parse(localStorage.getItem('taskflowCategories') || '[]');
}

function saveCategories(categories) {
  localStorage.setItem('taskflowCategories', JSON.stringify(categories));
}

function loadCategories() {
  const categories = getStoredCategories();
  categoriesList.innerHTML = '';
  categories.forEach(category => {
    const categoryItem = document.createElement('div');
    categoryItem.className = 'category-item';
    categoryItem.innerHTML = `
      <span class="category-name" style="color: ${category.color}">${category.name}</span>
      <button class="delete-category" data-id="${category.id}">Eliminar</button>
    `;
    categoriesList.appendChild(categoryItem);
  });

  // Agregar event listeners para eliminar
  document.querySelectorAll('.delete-category').forEach(button => {
    button.addEventListener('click', handleDeleteCategory);
  });
}

function handleCreateCategory(event) {
  event.preventDefault();

  if (!categoryForm.checkValidity()) {
    alert('Ingresa un nombre para la categoría.');
    return;
  }

  const category = {
    id: Date.now().toString(),
    name: categoryNameInput.value.trim(),
    color: categoryColorInput.value,
    createdAt: new Date().toISOString(),
  };

  const categories = getStoredCategories();
  categories.push(category);
  saveCategories(categories);

  categoryForm.reset();
  loadCategories();
  alert('Categoría creada correctamente.');
}

function handleDeleteCategory(event) {
  const categoryId = event.target.dataset.id;
  const categories = getStoredCategories();
  const updatedCategories = categories.filter(cat => cat.id !== categoryId);
  saveCategories(updatedCategories);
  loadCategories();
  alert('Categoría eliminada.');
}

function revealOnLoad() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((element) => element.classList.add('visible'));
}

document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  revealOnLoad();
});

categoryForm.addEventListener('submit', handleCreateCategory);