import * as TYPES from "../action-types";
import { getTaskList } from "@/api";
const taskAction = {
  //异步派发
  async queryAllList() {
    let tableList = [];
    try {
      let { code, list } = await getTaskList(0);
      if (+code === 0) {
        tableList = [...list];
      }
      return {
        type: TYPES.TASK_LIST,
        list: tableList,
      };
    } catch (_) {}
  },
  //同步派发:删除执行任务
  deleteTaskById(id) {
    return {
      type: TYPES.TASK_REMOVE,
      id,
    };
  },
  updateTaskById(id) {
    return {
      type: TYPES.TASK_UPDATE,
      id,
    };
  },
};
export default taskAction;
