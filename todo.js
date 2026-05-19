let todos = []
const todoList = document.getElementById('todo-list')
const newToDoInput = document.getElementById('new-todo')

//Загрузка списка задач
async function loadTodos() {
    const res = await fetch('/api/todos')
    todos = await res.json()
    renderTodos()
}

//Отрисовка списка
function renderTodos() {
    todoList.innerHTML = ''
    todos.forEach(todo => {
        const li = document.createElement('li')
        li.className = 'todo-item'
        li.innerHTML = `
        <span class="todo-text" contenteditable="true" data-id="${todo.id}">${todo.text}</span>
        <button class="btn" onclick="editTodo(${todo.id})">Обновить</button>
        <button class="btn" onclick="deleteTodo(${todo.id})">Удалить</button>     
        `
        todoList.appendChild(li)
    })
}

//Добавление новой задачи
async function addTodo() {
    const text = newToDoInput.value.trim()
    if (!text) return;
    const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    })
    const newTodo = await res.json()
    todos.push(newTodo)
    renderTodos()
    newToDoInput.value = ''
}

//Редактирование задачи
async function editTodo(id) {
    const text = document.querySelector(`.todo-text[data-id="${id}"]`).innerText
    await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    })
    todos = todos.map(t => t.id === id ? { ...t, text } : t)
}

//Удаление задачи
async function deleteTodo(id) {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' })
    todos = todos.filter(t => t.id !== id)
    renderTodos()
}

loadTodos()