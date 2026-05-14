# TaskFlow 🚀

TaskFlow es una aplicación web enfocada en la gestión de tareas personales y productividad.  
Permite crear, organizar y administrar tareas mediante una interfaz moderna, responsiva y amigable para el usuario.

---

# 📌 Características

- ✅ Registro e inicio de sesión
- ✅ Persistencia de sesión con LocalStorage
- ✅ Crear tareas
- ✅ Editar tareas
- ✅ Eliminar tareas
- ✅ Cambiar estado de tareas
- ✅ Filtrar tareas
- ✅ Diseño responsive
- ✅ Navegación dinámica

---

# 🛠️ Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript Vanilla
- LocalStorage
- Git
- GitHub

---

# 📂 Estructura del proyecto

```plaintext
taskflow/
│
├── index.html
├── pages/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   └── tasks.html
│
├── styles/
│   └── style.css
│
├── scripts/
│   ├── auth.js
│   ├── tasks.js
│   └── main.js
│
├── assets/
│   ├── images/
│   └── icons/
│
└── README.md
```

---

# ⚙️ Instalación y ejecución

## 1. Clonar repositorio

```bash
git clone https://github.com/usuario/taskflow.git
```

---

## 2. Entrar al proyecto

```bash
cd taskflow
```

---

## 3. Ejecutar proyecto

Abrir el archivo:

```plaintext
index.html
```

o usar:

- Live Server (VS Code)

---

# 🔐 Sistema de autenticación

La sesión del usuario se almacena usando:

```js
localStorage
```

Clave utilizada:

```js
taskflowCurrentUser
```

---

# 📋 Funcionalidades

## Gestión de tareas

Cada tarea puede:

- editarse
- eliminarse
- cambiar estado
- filtrarse

---

## Persistencia

Las tareas se almacenan en:

```js
localStorage
```

---

# 📱 Responsive Design

Optimizado para:

- 💻 Desktop
- 📱 Mobile
- 📲 Tablets

Incluye:

- grids adaptativos
- formularios responsive
- botones fluidos
- tarjetas dinámicas

---

# 🌿 Flujo Git

## Ramas principales

```plaintext
main
dev
qa
```

## Ramas de corrección

Ejemplo:

```plaintext
fix/navbar-navigation-improvements
fix/task-persistence
```

---

# 🧪 QA realizados

## QA #1 – Navegación desordenada y poco clara

Correcciones realizadas:

- navegación responsive
- enlaces corregidos
- estructura uniforme

---

## QA #2 – Las tareas no se guardaban

Correcciones realizadas:

- persistencia con LocalStorage
- recuperación de tareas
- sincronización de estados

---

# 👨‍💻 Autor

Desarrollado por Johan como proyecto educativo para práctica de:

- Git
- Git Flow
- QA
- Responsive Design
- JavaScript DOM
- LocalStorage

---

# 📄 Licencia

Proyecto de uso educativo y libre para aprendizaje.