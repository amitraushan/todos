import React, { Component } from "react";
import "./todo.css";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
// import DevTools from "mobx-react-devtools";
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
    this.toggleAll = this.toggleAll.bind(this);
  }

  addToTable(e) {
    const { updateListOnAdd, checkFooterFlag } = this.props.Store;
    if (e.keyCode === 13 && e.target.value) {
      let obj = { value: e.target.value, completed: false };
      updateListOnAdd(obj);
      e.target.value = "";
      checkFooterFlag(1);
      this.changeToggleAllStatus();
    }
  }

  removeItem(index) {
    const { toDoState, checkFooterFlag, updateListOnRemove } = this.props.Store;
    updateListOnRemove(index);

    if (toDoState.originalList.length === 0) {
      checkFooterFlag("");
    }
    this.changeToggleAllStatus();
  }

  toggleTaskStatus(item, index) {
    const { toggleStatus, updateAll } = this.props.Store;
    toggleStatus(index);
    updateAll();
    this.changeToggleAllStatus();
  }

  changeToggleAllStatus() {
    const { toDoState, toggleAllStatus } = this.props.Store;
    if (toDoState.completed.length === toDoState.originalList.length) {
      toggleAllStatus(true);
    } else {
      toggleAllStatus(false);
    }
  }

  toggleAll() {
    console.log("toggle All");
    const { toDoState, updateAll, toggleAllStatus } = this.props.Store;
    toggleAllStatus(!toDoState.toggleAll);
    toDoState.originalList.map(elem =>
      toDoState.toggleAll ? (elem.completed = true) : (elem.completed = false)
    );
    updateAll();
  }

  showAll() {
    console.log("showAll");
    const { changeActiveBtn } = this.props.Store;
    changeActiveBtn("all");
  }

  showActive() {
    console.log("showActive");
    const { changeActiveBtn } = this.props.Store;
    changeActiveBtn("active");
  }

  showCompleted() {
    console.log("showCompleted");
    const { changeActiveBtn } = this.props.Store;
    changeActiveBtn("completed");
  }

  clearCompleted() {
    const {
      toDoState,
      checkFooterFlag,
      toggleAllStatus,
      removeCompletedTask
    } = this.props.Store;
    removeCompletedTask();
    if (!toDoState.toBeDone.length) {
      checkFooterFlag("");
      toggleAllStatus(false);
    }
  }

  componentDidUpdate() {
    // console.log("prevProps =>", prevProps.Store.toDoState.originalList);
    // console.log("Props =>", this.props.Store.toDoState.originalList);

    const { toDoState, updateTaskList } = this.props.Store;
    if (toDoState.activeBtn === "completed") {
      updateTaskList(toDoState.completed);
    } else if (toDoState.activeBtn === "active") {
      updateTaskList(toDoState.toBeDone);
    } else {
      updateTaskList(toDoState.originalList);
    }
    window.localStorage.setItem(
      "toDoList",
      JSON.stringify(toDoState.originalList)
    );
    window.localStorage.setItem(
      "footerFlag",
      JSON.stringify(toDoState.footerFlag)
    );
    // console.log(
    //   "originalList => ",
    //   toDoState.originalList.map(item => item.completed)
    // );
    // console.log(
    //   "completed =>",
    //   toDoState.completed.map(item => item.completed)
    // );
    // console.log("toBeDone =>", toDoState.toBeDone.map(item => item.completed));
    // console.log("taskList => ", toDoState.taskList.map(item => item.completed));
  }
  componentDidMount() {
    const { updateAll, updateOriginalList, checkFooterFlag } = this.props.Store;
    const newList = JSON.parse(window.localStorage.getItem("toDoList"));
    const footerStatus = JSON.parse(window.localStorage.getItem("footerFlag"));
    updateOriginalList(newList);
    updateAll();
    checkFooterFlag(footerStatus);
    this.changeToggleAllStatus();
  }

  render() {
    const { toDoState } = this.props.Store;

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
          {toDoState.footerFlag ? (
            <section className="main">
              <input
                type="checkbox"
                id="toggle-all"
                className="toggle-all"
                checked={toDoState.toggleAll}
                onChange={this.toggleAll}
              />
              <label htmlFor="toggle-all" />
              <ul className="todo-list">
                {toDoState.taskList.map((item, index) => (
                  <li key={index} className="view">
                    <input
                      type="checkbox"
                      id={`task-${index}`}
                      className="toggle"
                      checked={item.completed}
                      onChange={() => this.toggleTaskStatus(item, index)}
                    />
                    <label
                      htmlFor={`task-${index}`}
                      className={`${
                        item.completed ? `completed` : "not-completed"
                      } task-label`}
                    >
                      <span className="label-name">{item.value}</span>
                    </label>
                    <button
                      className="destroy"
                      onClick={() => this.removeItem(index)}
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
          {toDoState.footerFlag ? (
            <footer className="footer">
              <div className="items-left">
                {toDoState.toBeDone.length} items left
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
              {toDoState.completed.length !== 0 ? (
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
        {/* <div className="devtools">
          <DevTools />
        </div> */}
      </section>
    );
  }
}

ToDo.propTypes = {
  Store: PropTypes.object
};
export default ToDo;
