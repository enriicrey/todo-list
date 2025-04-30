// Cargar tareas al iniciar
document.addEventListener("DOMContentLoaded", loadTasks);

// Añadir tarea
function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();
    
    if (taskText === "") {
        alert("Por favor, escribe una tarea.");
        return;
    }

    const task = { text: taskText, completed: false };
    saveTask(task);
    renderTask(task);
    input.value = "";
}

// Eliminar tarea
function deleteTask(button) {
    const li = button.parentElement;
    const taskText = li.childNodes[0].textContent.trim();
    removeTaskFromStorage(taskText);
    li.remove();
}

// Editar tarea
function editTask(span) {
    const currentText = span.textContent;
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentText;
    input.className = "edit-input";

    span.replaceWith(input);
    input.focus();

    // Guardar cambios al presionar Enter o salir del campo
    input.addEventListener("blur", () => saveEdit(input, currentText));
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveEdit(input, currentText);
    });
}

// Guardar edición
function saveEdit(input, oldText) {
    const newText = input.value.trim();
    if (newText === "") return;

    const span = document.createElement("span");
    span.textContent = newText;
    span.onclick = () => editTask(span);
    input.replaceWith(span);

    updateTaskInStorage(oldText, newText);
}

// Guardar en LocalStorage
function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Cargar desde LocalStorage
function loadTasks() {
    const tasks = getTasks();
    tasks.forEach(renderTask);
}

// Eliminar de LocalStorage
function removeTaskFromStorage(text) {
    let tasks = getTasks();
    tasks = tasks.filter(t => t.text !== text);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Actualizar texto en LocalStorage
function updateTaskInStorage(oldText, newText) {
    let tasks = getTasks();
    tasks = tasks.map(t => t.text === oldText ? { text: newText, completed: t.completed } : t);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Funciones auxiliares
function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function renderTask(task) {
    const li = document.createElement("li");
    li.innerHTML = `
        <span>${task.text}</span>
        <div>
            <button onclick="editTask(this.previousElementSibling)">Editar</button>
            <button onclick="deleteTask(this)">Eliminar</button>
        </div>
    `;
    li.querySelector("span").onclick = () => editTask(li.querySelector("span"));
    document.getElementById("taskList").appendChild(li);
}