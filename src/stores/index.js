import { observable, action } from "mobx";

class Store {
  @observable toDoState = {
    completed: [],
    toBeDone: [],
    originalList: [],
    taskList: [],
    toggleAll: false,
    activeBtn: "all"
  };

  @action("update all the list on addition of new task")
  updateListOnAdd = obj => {
    this.toDoState.originalList.push(obj);
    this.toDoState.toBeDone.push(obj);
  };

  @action("update all the list on removal of individual task")
  updateListOnRemove = index => {
    this.toDoState.originalList.splice(index, 1);
    this.toDoState.toBeDone = this.toDoState.originalList.filter(
      elem => elem.completed !== true
    );
    this.toDoState.completed = this.toDoState.originalList.filter(
      elem => elem.completed === true
    );
  };

  @action("change the active button state")
  changeActiveBtn = string => {
    this.toDoState.activeBtn = string;
  };

  @action("update the list on removing all the completed task")
  removeCompletedTask = () => {
    this.toDoState.completed.length = 0;
    this.toDoState.originalList = this.toDoState.originalList.filter(
      elem => elem.completed !== true
    );
  };

  @action("toggle task status")
  toggleStatus = index => {
    this.toDoState.originalList.map((elem, pos) =>
      pos === index ? (elem.completed = !elem.completed) : elem.completed
    );
  };

  @action("update toBeDone and Completed list")
  updateAll = () => {
    this.toDoState.completed = this.toDoState.originalList.filter(
      elem => elem.completed === true
    );
    this.toDoState.toBeDone = this.toDoState.originalList.filter(
      elem => elem.completed !== true
    );
  };

  @action("change the status of toggleAll button")
  toggleAllStatus = bool => {
    this.toDoState.toggleAll = bool;
  };

  @action("update the taskList based on selected footer button")
  updateOriginalList = newList => {
    this.toDoState.originalList = newList ? newList : [];
  };

  @action("update the taskList based on selected footer button")
  updateTaskList = newList => {
    this.toDoState.taskList = newList ? newList : [];
  };
}

export default new Store();
