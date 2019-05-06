import React, { Component } from "react";
import "./todo.css";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import DevTools from "mobx-react-devtools";
@inject("Store")
@observer
class ToDo extends Component {
  constructor(props) {
    super(props);
    this.addToTable = this.addToTable.bind(this);
    this.showAll = this.showAll.bind(this);
    this.showActive = this.showActive.bind(this);
    this.showCompleted = this.showCompleted.bind(this);
    this.clearCompleted = this.clearCompleted.bind(this);
    this.count = 0;
  }

  addToTable(e) {
    const { addToDo } = this.props.Store;
    if (e.keyCode === 13 && e.target.value) {
      let obj = { value: e.target.value, completed: false, id: (this.count+Math.random())};
      addToDo(obj);
      e.target.value = "";
      this.count++;
    }
  }

  toggleIndividualTodo(item) {
    this.props.Store.toggleToDo(item.id);
  }

  removeItem(id) {
    this.props.Store.removeToDo(id);
  }

  toggleAll(status) {
    this.props.Store.toggleAllStatus(status);
  }

  showAll() {
    this.props.Store.changeActiveBtn("all");
  }

  showActive() {
    this.props.Store.changeActiveBtn("active");
  }

  showCompleted() {
    this.props.Store.changeActiveBtn("completed");
  }

  clearCompleted() {
    this.props.Store.removeCompletedToDos();
  }

  componentDidUpdate() {
    const { toDoState } = this.props.Store;
    window.localStorage.setItem("toDoList", JSON.stringify(toDoState.todos));
  }
  componentDidMount() {
    const newList = JSON.parse(window.localStorage.getItem("toDoList"));
    console.log('newList===>', newList);
    if(newList) {
      this.props.Store.getTodosFromLocalStorage(newList);
    }
  }
  getvisibleTodos() {
    const { activeBtn, todos } = this.props.Store.toDoState;
    switch (activeBtn) {
      case "completed":
        return todos.filter(todo => todo.completed);
      case "active":
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  }

  render() {
    const { toDoState } = this.props.Store;
    const visibleTodos = this.getvisibleTodos();
    const isToggleALLChecked =
      toDoState.todos.length ===
      toDoState.todos.filter(todo => todo.completed).length;
    return (
      <section className="App-page">
        <h1>todos</h1>
        <div className="todo-app" react-id="table-0">
          <header>
            <input
              className="new-todo"
              placeholder="What needs to be done ?"
              onKeyDown={this.addToTable}
            />
          </header>
          {toDoState.todos.length ? (
            <section className="main">
              <input
                type="checkbox"
                id="toggle-all"
                className="toggle-all"
                checked={isToggleALLChecked}
                onChange={() => this.toggleAll(isToggleALLChecked)}
              />
              <label htmlFor="toggle-all" />
              <ul className="todo-list">
                {visibleTodos.map((item, index) => (
                  <li key={index} className="view">
                    <input
                      type="checkbox"
                      id={`task-${item.id}`}
                      className="toggle"
                      checked={item.completed}
                      onChange={() => this.toggleIndividualTodo(item)}
                    />
                    <label
                      htmlFor={`task-${item.id}`}
                      className={`${
                        item.completed ? `completed` : "not-completed"
                      } task-label`}
                    >
                      <span className="label-name">{item.value}</span>
                    </label>
                    <button
                      className="destroy"
                      onClick={() => this.removeItem(item.id)}
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            ""
          )}
          {toDoState.todos.length ? (
            <footer className="footer">
              <div className="items-left">
                {toDoState.todos.filter(todo => !todo.completed).length} items
                left
              </div>
              <button
                className={`${
                  toDoState.activeBtn === "all" ? `active-class` : ""
                } footer-btn`}
                onClick={this.showAll}
              >
                All
              </button>
              <button
                className={`${
                  toDoState.activeBtn === "active" ? `active-class` : ""
                } footer-btn`}
                onClick={this.showActive}
              >
                Active
              </button>
              <button
                className={`${
                  toDoState.activeBtn === "completed" ? `active-class` : ""
                } footer-btn`}
                onClick={this.showCompleted}
              >
                Completed
              </button>
              {toDoState.todos.filter(todo => todo.completed).length ? (
                <button
                  className="clear-completed"
                  onClick={this.clearCompleted}
                >
                  Clear completed
                </button>
              ) : (
                ""
              )}
            </footer>
          ) : (
            ""
          )}
        </div>
        <div className="devtools">
          <DevTools />
        </div>
      </section>
    );
  }
}

ToDo.propTypes = {
  Store: PropTypes.object
};
export default ToDo;
