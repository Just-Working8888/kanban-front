import api from "./axios_client";
import { useMutation } from "react-query";

export const updateSubTaskStatus = () => {
  return useMutation((data: any) => {
    return api.put("/subTask/updateSubtaskStatus", {
      data: {
        status: data.status,
        subTaskId: data.taskId,
      },
      params: {
        taskId: data.taskId,
      },
    });
  });
};
export const updateTaskImage = () => {
  return useMutation((data: any) => {
    return api.patch(`/task/${data.taskId}/updateImage/`, data.data);
  });
};
