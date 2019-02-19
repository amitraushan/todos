import { observable, action } from "mobx";

class Store {
  @observable toDoState = {
    todos: [],
    activeBtn: "all"
  };
  @action("ADD_TODO")
  addToDo = todo => {
    this.toDoState.todos.push(todo);
  };

  @action("TOGGLE_TODO")
  toggleToDo = id => {
    this.toDoState.todos.map((elem) =>
      elem.id === id ? (elem.completed = !elem.completed) : elem.completed
    );
  };
  @action("REMOVE_TODO")
  removeToDo = id => {
    this.toDoState.todos = this.toDoState.todos.filter(
      (todo) => todo.id !== id
    );
  };

  @action("CHANGE_FILTER")
  changeActiveBtn = string => {
    this.toDoState.activeBtn = string;
  };

  @action("CLEAR_COMPLETED")
  removeCompletedToDos = () => {
    this.toDoState.todos = this.toDoState.todos.filter(
      elem => elem.completed !== true
    );
  };

  @action("TOGGLE_ALL")
  toggleAllStatus = status => {
    this.toDoState.todos.map(todo => (todo.completed = !status));
  };
  @action("GET_TODOS_FROM_LOCALSTORAGE")
  getTodosFromLocalStorage = todos => {
    this.toDoState.todos.push(...todos);
  };
}

export default new Store();
