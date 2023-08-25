import {
  action,
  makeAutoObservable,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { getTaskList } from "@/api";

export default class TaskStore {
  constructor(root) {
    this.root = root;
    makeObservable(this, {
      taskList: observable,
      queryAllTaskAction: action.bound,
      removeTaskAction: action.bound,
      updateTaskAction: action.bound,
    });
    // makeAutoObservable(this);
  }
  taskList = null;
  async queryAllTaskAction() {
    let taskList = [];
    try {
      const { code, list } = await getTaskList(0);
      if (+code === 0) {
        taskList = list;
      }
    } catch (error) {
      console.log(error);
    }
    runInAction(() => {
      this.taskList = taskList;
    });
  }

  removeTaskAction(id) {
    const { taskList } = this;
    this.taskList = taskList.filter((item) => {
      return item.id !== id;
    });
  }

  updateTaskAction(id) {
    const { taskList } = this;
    this.taskList = taskList.map((item) => {
      if (item.id === id) {
        item.state = 2;
        item.complete = new Date().toLocaleString("zh-CN");
      }
      return item;
    });
  }
}
