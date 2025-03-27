const express = require("express");
const router = express.Router();

const todosController = require("../controller/todos.controller");


router.get("/dashboard", todosController.getAllTodos);

router.get("/add-task", todosController.getAddTodo);

router.post("/add-task", todosController.addTodo);

router.get("/add-task/:id", todosController.getUpdateTodo);

router.post("/add-task/:id", todosController.updateTodo);

router.post("/add-task/:id/delete", todosController.deleteTodo);

router.post("/add-task/:id/done", todosController.markComplete);

// router.get("/add-task/:id/done",todosController.getCompletedTodo);

module.exports = router;
