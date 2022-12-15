import React, { Component } from "react";
import "./TodoList.css";

export default class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      todos: [],
      editingTodo: "",
      editingTodoIndex: null,
      newTodo: "",
    };
  }

  componentDidMount() {
    this.getTodos();
  }

  handleInputChange = (input) => {
    this.setState({
      newTodo: input.target.value,
    });
  };

  handleEditButton = (index, todo) => {
    this.setState({
      editingTodoIndex: index,
      editingTodo: todo,
    });
  };

  handleEditInputChange = (input) => {
    this.setState({
      editingTodo: input.target.value,
    });
  };

  getTodos() {
    fetch("http://localhost:3000/todo")
      .then((response) => response.json())
      .then((data) => this.setState({ todos: data["todos"] }));
  }

  addTodo = () => {
    fetch("http://localhost:3000/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todo: this.state.newTodo }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          todos: data["todos"],
          newTodo: "",
        });
      });
  };

  updateTodo() {
    fetch("http://localhost:3000/todo", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todoIndex: this.state.editingTodoIndex,
        newDesc: this.state.editingTodo,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          todos: data["todos"],
        });
      })
      .then(() =>
        this.setState({
          editingTodo: "",
          editingTodoIndex: null,
        })
      );
  }

  deleteTodo = (todoIndex) => {
    fetch("http://localhost:3000/todo", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todoIndex: todoIndex }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          todos: data["todos"],
        });
      });
  };

  render() {
    const editModeButton = (index, todo) => {
      if (this.state.editingTodoIndex === index) {
        return (
          <button onClick={() => this.updateTodo()} className="confirm-button">
            Confirm
          </button>
        );
      } else {
        return (
          <button
            onClick={() => this.handleEditButton(index, todo)}
            className="edit-button"
          >
            edit
          </button>
        );
      }
    };

    const editModeInput = (index, todo) => {
      if (this.state.editingTodoIndex === index) {
        return (
          <span className="todo-desc">
            <input
              value={this.state.editingTodo}
              onChange={this.handleEditInputChange}
            />
          </span>
        );
      } else {
        return (
          <span className="todo-desc">
            {index + 1}. {todo}
          </span>
        );
      }
    };

    const todoElement = (index, todo) => (
      <div key={`${index}${todo}`} className="todos-list">
        {editModeInput(index, todo)}
        <span className="todo-buttons">
          {editModeButton(index, todo)}
          <button
            className="delete-button"
            onClick={() => this.deleteTodo(Number(index))}
          >
            X
          </button>
        </span>
      </div>
    );

    const todos = this.state.todos.map((todo, index) =>
      todoElement(index, todo)
    );
    return (
      <div>
        <h1>TODO List</h1>
        <div>
          <input onChange={this.handleInputChange} value={this.state.newTodo} />
          <button onClick={this.addTodo} className="create-button">
            {" "}
            Create TODO{" "}
          </button>
        </div>
        <div className="todos">{todos}</div>
      </div>
    );
  }
}
