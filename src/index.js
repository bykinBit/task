import React from "react";
import ReactDOM from "react-dom/client";
import "./index.less";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import Task from "./views/Task";
import store from "./store";
import { Provider } from "mobx-react";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ConfigProvider locale={zhCN}>
    <Provider {...store}>
      <Task />
    </Provider>
  </ConfigProvider>
);
