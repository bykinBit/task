import axios from "axios";
import qs from "qs";
import { message } from "antd";
import { isPlainObject } from "@/assets/utils";

const http = axios.create({
  baseURL: "/api",
  timeout: 6000,
});
http.defaults.transformRequest = (data) => {
  if (isPlainObject(data)) data = qs.stringify(data);
  return data;
};
http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (reson) => {
    message.error("当前网络繁忙，请稍后重试～");
    return Promise.reject(reson);
  }
);
export default http;
