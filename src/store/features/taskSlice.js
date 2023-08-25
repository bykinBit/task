import { createSlice } from "@reduxjs/toolkit";
import { getTaskList } from "@/api";

const taskSlice = createSlice({
  name: "task",
  initialState: {
    taskList: null,
  },
  reducers: {
    getAllTaskList(state, { payload }) {
      state.taskList = payload;
    },
    removeTaskItem(state, { payload }) {
      let taskList = state.taskList;
      if (!Array.isArray(taskList)) return;
      state.taskList = taskList.filter((item) => {
        return item.id !== payload;
      });
    },
    updateTaskItem(state, { payload }) {
      let taskList = state.taskList;
      if (!Array.isArray(taskList)) return;
      state.taskList = taskList.map((item) => {
        if (item.id === payload) {
          item.state = 2;
          item.complete = new Date().toLocaleString("zh-CN");
        }
        return item;
      });
    },
  },
});
export const { getAllTaskList, updateTaskItem, removeTaskItem } =
  taskSlice.actions;

export const getAllTaskListAsync = () => {
  return async (dispatch) => {
    let taskList = [];
    try {
      const { code, list } = await getTaskList(0);
      if (+code === 0) {
        taskList = [...list];
      } else {
        console.log("获取全部任务列表失败～");
      }
      dispatch(getAllTaskList(taskList));
    } catch (error) {
      console.log(error);
    }
  };
};
export default taskSlice.reducer;
