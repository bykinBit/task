import {} from "mobx";
import TaskStore from "./TaskStore";
class Store {
  constructor() {
    this.task = new TaskStore(this);
  }
}
export default new Store();
