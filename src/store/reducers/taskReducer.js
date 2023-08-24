import * as TYPES from "../action-types";
const inital = {
  taskList: null,
};
export default function taskReducer(state = inital, action) {
  state = { ...state };
  let { taskList } = state;
  switch (action.type) {
    case TYPES.TASK_LIST:
      state.taskList = action.list;
      break;
    case TYPES.TASK_UPDATE:
      if (Array.isArray(taskList)) {
        state.taskList = taskList.map((item) => {
          if (item.id === action.id) {
            item.state = 2;
            item.complete = new Date().toLocaleString("zh-CN", {
              hour12: true,
            });
          }
          return item;
        });
      }
      break;
    case TYPES.TASK_REMOVE:
      state.taskList = taskList.filter((item) => {
        return item.id !== action.id;
      });
      break;
    default:
  }
  return state;
}
