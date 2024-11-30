import api from "./axios_client";
import { useMutation } from "react-query";

export const createTask = () => {
  return useMutation((data: any) => {
    return api.post("/task", { data });
  });
};

export const deleteTask = () => {
  return useMutation((data: any) => {
    return api.delete("/task", {
      params: {
        taskId: data.taskId,
      },
      data: { data: { columnId: data.columnId } },
    });
  });
};

export const getTask = async (queryParams: any) => {
  const taskId = queryParams;

  const response = await api.get("/task", {
    params: {
      taskId: taskId,
    },
  });

  return response;
};

export const updateTask = () => {
  return useMutation((postData: any) => {
    const data = {
      title: postData.title,
      description: postData.description,
      subTasks: postData.subTasks,
      columnId: postData.columnId,
    };
    return api.put(
      "/task/updateTask",
      { data },
      {
        params: {
          taskId: postData.taskId,
        },
      }
    );
  });
};
