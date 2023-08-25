import { configureStore } from "@reduxjs/toolkit";
import reduxLogger from "redux-logger";
import reduxThunk from "redux-thunk";
import taskReducer from "./features/taskSlice";
const store = configureStore({
  reducer: { task: taskReducer },
  middleware: [reduxLogger, reduxThunk],
});
export default store;
