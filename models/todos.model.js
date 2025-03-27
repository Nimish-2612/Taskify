const mongodb = require("mongodb");
const db = require("../data/database");

class Todo {
  constructor(title, text, id, isCompleted) {
    this.title = title;
    this.text = text;
    this.id = id;
    this.isCompleted = isCompleted;
  }

  static async getAllTodos() {
    const todoDocuments = await db.getDb().collection("todos").find().toArray();
    return todoDocuments.map(function (todoDocument) {
      return new Todo(
        todoDocument.title,
        todoDocument.text,
        todoDocument._id,
        todoDocument.isCompleted
      );
    });
  }

  save() {
    if (this.id) {
      const todoId = mongodb.ObjectId.createFromHexString(this.id);
      return db
        .getDb()
        .collection("todos")
        .updateOne({ _id: todoId }, { $set: { text: this.text } });
    } else {
      return db.getDb().collection("todos").insertOne({
        title: this.title,
        text: this.text,
        isCompleted: this.isCompleted,
      });
    }
  }

  static async findTodoById(todoId) {
    let todoid;
    try {
      todoid = mongodb.ObjectId.createFromHexString(todoId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const todo = await db.getDb().collection("todos").findOne({ _id: todoid });
    if (!todo) {
      const error = new Error("Could not find product with provided id");
      error.code = 404;
      throw error;
    }
    return todo;
  }

  delete() {
    if (!this.id) {
      throw new Error("Trying to delete a todo with no Id");
    }

    const todoId = new mongodb.ObjectId(this.id);
    return db.getDb().collection("todos").deleteOne({ _id: todoId });
  }

  changeStatus() {
    if (!this.id) {
      throw new Error("Trying to delete a todo with no Id");
    }
    if (this.isCompleted === null) {
      const todoId = new mongodb.ObjectId(this.id);
      return db
        .getDb()
        .collection("todos")
        .updateOne({ _id: todoId }, { $set: { isCompleted: "Completed" } });
    }
  }
}

module.exports = Todo;
