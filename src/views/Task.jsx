import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Modal,
  Popconfirm,
  Table,
  Tag,
  Input,
  DatePicker,
  message,
} from "antd";
import "./Task.less";
import { addTask, removeTask, completeTask } from "@/api";
//observer 状态更改让试图更新的
//inject基于上文出现的provider提供的状态而获取状态的
import { inject, observer } from "mobx-react";
const zero = function (text) {
  return String(text).length < 2 ? "0" + text : text;
};
const formatTime = function (time) {
  const [_, month, day, hours = "00", minutes = "00"] = time.match(/\d+/g);
  return `${zero(month)}-${zero(day)} ${zero(hours)}:${zero(minutes)}`;
};
const Task = function (props) {
  let { task } = props;
  //定义表的列数据
  const columns = [
    {
      title: "编号",
      dataIndex: "id",
      ellipsis: true,
      align: "center",
      with: "15%",
    },
    { title: "编号", dataIndex: "task", ellipsis: true, with: "43%" },
    {
      title: "编号",
      dataIndex: "state",
      align: "center",
      with: "10%",
      render: (text) => (+text === 1 ? "未完成" : "已完成"),
    },
    {
      title: "完成时间",
      dataIndex: "time",
      align: "center",
      with: "15%",
      render: (_, record) => {
        let { state, time, complete = "" } = record;
        if (+state === 1) time = complete;
        return formatTime(time);
      },
    },
    {
      title: "操作",
      render: (_, record) => {
        let { state, id } = record;
        return (
          <>
            <Popconfirm
              title="您确定要删除此任务吗？"
              onConfirm={() => {
                removeTaskFn(id);
              }}
            >
              <Button type="link">删除</Button>
            </Popconfirm>
            {+state !== 2 ? (
              <Popconfirm
                title="您确定要设置此任务状态为完成吗？"
                onConfirm={() => {
                  completeTaskFn(id);
                }}
              >
                <Button type="link">完成</Button>
              </Popconfirm>
            ) : null}
          </>
        );
      },
    },
  ];
  const [formIns] = Form.useForm();
  // 定义表的数据
  let [tableData, setTableData] = useState([]);
  let [showVisible, setShowVisible] = useState(false);
  let [selectedIndex, setSelectIndex] = useState(0);
  let [showLoading, setShowLoading] = useState(false);
  let [showButtonLoading, setShowButtonLoading] = useState(false);
  useEffect(() => {
    (async () => {
      if (!task.taskList) {
        setShowLoading(true);
        await task.queryAllTaskAction();
        setShowLoading(false);
      }
    })();
  }, []);
  useEffect(() => {
    let { taskList } = task;
    if (!taskList) taskList = [];
    if (selectedIndex !== 0) {
      taskList = taskList.filter((item) => {
        return +item.state === +selectedIndex;
      });
    }
    setTableData(taskList);
  }, [task.taskList, selectedIndex]);
  let addTaskFn = () => {
    setShowVisible(true);
  };
  let submit = async () => {
    try {
      await formIns.validateFields();
      let { task, time } = formIns.getFieldsValue();
      time = time.format("YYYY-MM-DD HH:mm:ss");
      setShowButtonLoading(true);
      updateTask(task, time);
    } catch (error) {
      message.error("新增任务失败，请稍后重试～");
    }
    setShowButtonLoading(false);
  };
  const close = () => {
    formIns.resetFields();
    setShowButtonLoading(false);
    setShowVisible(false);
  };
  //更新数据
  const updateTask = async (tasks, time) => {
    try {
      const { code } = await addTask(tasks, time);
      if (+code !== 0) {
        message.error("任务添加失败，请稍后重试～");
      }
      message.success("任务添加成功～");
      close();
      await task.queryAllTaskAction(0);
    } catch (error) {
      message.error("更新数据失败，请稍后重试～");
    }
  };
  //删除数据
  const removeTaskFn = async (id) => {
    try {
      const { code } = await removeTask(id);
      if (+code !== 0) {
        message.error("任务删除失败，请稍后重试～");
      }
      task.removeTaskAction(id);
      message.success("删除成功～");
    } catch (error) {
      message.error("数据删除失败，请稍后重试～");
    }
  };
  //完成任务
  const completeTaskFn = async (id) => {
    try {
      const { code } = await completeTask(id);
      if (+code !== 0) {
        message.error("操作失败，请稍后重试～");
      }
      task.updateTaskAction(id);
      message.success("操作成功～");
    } catch (error) {
      message.error("任务操作失败，请稍后重试～");
    }
  };
  return (
    <div className="task-box">
      <div className="header">
        <h2 className="title">TASK OA 任务管理系统</h2>
        <Button type="primary" onClick={addTaskFn}>
          新增任务
        </Button>
      </div>
      <div className="tag-box">
        {["全部", "未完成", "已完成"].map((val, index) => (
          <Tag
            onClick={() => {
              setSelectIndex(index);
            }}
            color={selectedIndex === index ? "#1677ff" : ""}
            key={index}
          >
            {val}
          </Tag>
        ))}
      </div>
      <Table
        dataSource={tableData}
        columns={columns}
        loading={showLoading}
        pagination={false}
        rowKey="id"
      ></Table>
      <Modal
        open={showVisible}
        onOk={submit}
        onCancel={close}
        confirmLoading={showButtonLoading}
        title="新增任务"
      >
        <Form
          layout="vertical"
          form={formIns}
          initialValues={{ task: "", time: "" }}
        >
          <Form.Item
            label="任务描述"
            name="task"
            rules={[
              { required: true, message: "仍务描述不可以为空" },
              { min: 6, message: "最少需要输入6个字符" },
            ]}
          >
            <Input.TextArea style={{ resize: "none" }} />
          </Form.Item>
          <Form.Item
            label="预计完成时间"
            name="time"
            rules={[{ required: true, message: "预计完成时间不可以为空" }]}
          >
            <DatePicker showTime />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default inject("task")(observer(Task));
