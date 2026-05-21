const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 3000
const DATA_FILE = path.join(__dirname, 'todo.json')

//Создание JSON-файла, если его ещё нет
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]))
}


app.use(express.json())
app.use(express.static(__dirname))


//Получить список задач
app.get('/api/todos', (req, res) => {
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    res.json(JSON.parse(data))
})


//Добавить задачу
app.post('/api/todos', (req, res) => {
    const todos = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    const newTodo = { id: Date.now(), text: req.body.text, completed: false }
    todos.push(newTodo)
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2))
    res.json(newTodo)
})


//Обновить задачу
app.put('/api/todos/:id', (req, res) => {
    const todos = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    const todo = todos.find(t => t.id == req.params.id) //Функция сравнивает id каждого элемента массива с id в запросе
    if (todo) {
        todo.text = req.body.text
        fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2))
        res.json(todo)
    } else {
        res.status(404, 'Задача не найдена')
    }
})

//Удалить задачу
app.delete('/api/todos/:id', (req, res) => {
    const todos = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
    const newTodos = todos.filter(t => t.id != req.params.id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(newTodos, null, 2))
    res.json({ success: true })

})

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`)
})