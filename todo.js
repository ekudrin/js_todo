let todos = []
const todoList = document.getElementById('todo-list')
const newToDoInput = document.getElementById('new-todo')

//Загрузка списка задач
function loadTodos() {
    const res = fetch('/api/todos')
    todos = res.json()
    renderTodos()
}

//Отрисовка списка
function renderTodos() {
    todoList.innerHTML = ''
    todos.forEach(todo => {
        const li = document.createElement('li')
        li.className = 'todo-item'
        li.innerHTML = `
        <span class="todo-text" contenteditable="true" data-id="${todo.id}">
        <button class="btn" onclick="editTodo(${todo.id})">Обновить</button>
        <button class="btn" onclick="deleteTodo(${todo.id})">Удалить</button>     
        `
        todoList.appendChild(li)
    })
}

//Добавление новой задачи
function addTodo() {
    const text = newToDoInput.value.trim()
    if (!text) return;
    const res = fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    })
    const newTodo = res.json()
    todos.push(newTodo)
    renderTodos()
    newToDoInput.value = ''
}

//Редактирование задачи
function editTodo(id) {
    const text = document.querySelector(`.todo-text[data-id="${id}"]`).innerText
    fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    })
    todos = todos.map(t => t.id === id ? { ...t, text } : t)
}

//Удаление задачи
function deleteTodo(id) {
    fetch(`/api/todos/${id}`, { method: 'DELETE' })
    todos = todos.filter(t => t.id !== id)
    renderTodos()
}

loadTodos()