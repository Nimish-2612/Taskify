const Todo = require("../models/todos.model");
const db = require("../data/database");
const mongodb = require("mongodb");

async function markComplete(req, res, next) {
  const todoId = req.params.id;
  const todo = new Todo(null, null, todoId,null);
  await todo.changeStatus();
  res.redirect('/dashboard');
}

async function getAllTodos(req, res, next) {
  let todos;

  let completedTasks =[];
  let incompleteTasks=[];
  try {
    todos = await Todo.getAllTodos();
  } catch (error) {
    return next(error);
  }

  for(const todo of todos){
    if(todo.isCompleted)
    {
      // console.log(todo);
      completedTasks.push(todo);
    }
    else{
      incompleteTasks.push(todo);
    }
  }

  if (req.isAuthenticated()) {
    const userName = req.user.name;
    return res.render("landing/dashboard", { userName:userName ,todos:todos, completedTasks: completedTasks,incompleteTasks:incompleteTasks });
  }
 
  res.render("includes/401");
}

async function getUpdateTodo(req, res) {
  try {
    const todo = await Todo.findTodoById(req.params.id);
    res.render("todos/update-todos", { todo: todo });
  } catch (error) {
    return next(error);
  }
}

async function addTodo(req, res, next) {
  const todoText = req.body.text;
  const todoTitle = req.body.textTitle;
  const todo = new Todo(todoTitle, todoText);
  let insertedId;
  try {
    const result = await todo.save();
    insertedId = result.insertedId;
  } catch (error) {
    return next(error);
  }

  todo.id = insertedId.toString();
  res.redirect("/dashboard");
}

async function updateTodo(req, res, next) {
  const todoId = req.params.id;
  const newTodoTitle = req.body.title;
  const newTodoText = req.body.text;
  const todo = new Todo(newTodoTitle, newTodoText, todoId);
  try {
    await todo.save();
  } catch (error) {
    return next(error);
  }
  res.redirect("/dashboard");
}

async function deleteTodo(req, res, next) {
  const todoId = req.params.id;
  const todo = new Todo(null, null, todoId);
  try {
    await todo.delete();
  } catch (error) {
    return next(error);
  }
  res.redirect("/dashboard");
}

function getAddTodo(req, res) {
  res.render("todos/add-todos");
}

module.exports = {
  getAllTodos: getAllTodos,
  getAddTodo: getAddTodo,
  addTodo: addTodo,
  getUpdateTodo: getUpdateTodo,
  updateTodo: updateTodo,
  deleteTodo: deleteTodo,
  markComplete: markComplete,
};
