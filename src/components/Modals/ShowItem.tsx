import { Skeleton, Checkbox, Modal, Tooltip, Badge, Flex } from "antd"; // Импорт Skeleton из Ant Design
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useQuery, useQueryClient } from "react-query";
import { BooleanParam, StringParam, useQueryParam } from "use-query-params";
import { updateSubTaskStatus } from "../../requests/subtask";
import { deleteTask, getTask } from "../../requests/task";
import { showToast } from "../Common/Toast";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import UserSelect from "../UserSelect/UserSelect";

interface ShowItemModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  setShowItemModalOpen: any;
}

export const ShowItem = ({
  isOpen,
  onRequestClose,
  setShowItemModalOpen,
}: ShowItemModalProps) => {
  let completedSubTasks;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { mutate } = updateSubTaskStatus();
  const queryClient = useQueryClient();
  const [task, setTask]: any = useState(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const [queryParams, setQueryParam] = useQueryParam("taskId", StringParam);
  const [_, setEditTask] = useQueryParam("EditBoard", BooleanParam);
  const { mutate: deleteTaskMutate } = deleteTask();
  const customClass = `
  bg-darkGrey
  text-white
  `;

  const showAlert = async (task: any) => {
    const result = await Swal.fire({
      title: "Are you sure, you want to delete the task?",
      text: `You are about to delete the selected task? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        container: customClass,
        popup: customClass,
      },
    });

    if (result.isConfirmed && task) {
      const data = {
        taskId: queryParams,
        columnId: task.columnId,
      };

      deleteTaskMutate(data, {
        onSuccess: () => {
          onRequestClose();
          showToast.success("Task deleted successfully");
        },
        onError: () => {
          showToast.error("Sorry something went wrong");
        },
        onSettled: () => {
          queryClient.invalidateQueries("allColumnData");
          setQueryParam(undefined);
        },
      });
    }
  };

  const { data, isLoading } = useQuery(
    ["getTaskById", queryParams],
    () => getTask(queryParams),
    {
      staleTime: Infinity,
      enabled: !queryParams === false,
    }
  );

  const handleOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    taskId: string
  ) => {
    const data = {
      taskId: taskId,
      status: event.target.checked ? "COMPLETE" : "INCOMPLETE",
    };

    mutate(data, {
      onError: () => {
        showToast.error("Something went wrong");
      },
      onSettled: () => {
        queryClient.invalidateQueries("allColumnData");
        queryClient.invalidateQueries("getTaskById");
      },
    });
  };

  const memoizedTaskData = useMemo(() => {
    return data?.data.data;
  }, [data]);

  useEffect(() => {
    setTask(memoizedTaskData);
  }, [memoizedTaskData]);

  completedSubTasks = data?.data.data.subTask?.filter((subtask: any) => {
    return subtask.status === "COMPLETE";
  });

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEditItemClick = () => {
    setIsMenuOpen(false);
    setShowItemModalOpen(false);
    setEditTask(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [componentRef, isOpen]);
  const priorityColors: Record<string, string> = {
    HIGH: "red",
    MEDIUM: "orange",
    LOW: "green",
  };
  return (
    <Modal

      title={<Flex justify="space-between"> Task Details <Badge
        color={priorityColors[task?.priority] || "default"}
        text={task?.priority}
      /></Flex>
      }
      visible={isOpen} // Управление видимостью модального окна
      onCancel={onRequestClose} // Закрытие окна при нажатии на "Cancel"
      footer={null} // Убираем стандартные кнопки внизу
    >
      <div className="flex flex-col space-y-10  ">
        {isLoading ? (
          // Скелеон для загрузки данных
          <Skeleton active />
        ) : (
          task && (
            <>
              <div className="flex flex-row w-full justify-between items-center">
                <h1 className="text-2xl font-bold text-white  flex  items-center justify-between w-full tracking-wider leading-[24px] p-0 m-0 max-w-[387px]">
                  {task.title}
                  {task.dueDate && (
                    <p className="text-mediumGrey text-xs font-bold">
                      Due: {dayjs(task.dueDate).format("MMM DD, YYYY")}
                    </p>
                  )}
                </h1>
                <p
                  className="text-red text-sm font-semibold leading-[23px] hover:underline m-0"
                  onClick={() => showAlert(task)}
                >
                  Delete Task
                </p>
                {/* <div>
                  <BiDotsVerticalRounded
                    color="#828FA3"
                    size={40}
                    onClick={handleMenuClick}
                  />
                  <div
                    className={`absolute z-[10] ${isMenuOpen ? "visible" : "hidden z-[-10]"}`}
                    ref={componentRef}
                  >
                    <div className="flex flex-col space-y-5 w-[206px] rounded-[10px] p-5 bg-darkBG border-orange-100 border-[1px]">
                      <p
                        className="text-mediumGrey text-sm font-semibold leading-[23px] hover:underline"
                        onClick={handleEditItemClick}
                      >
                        Edit Task
                      </p>
                      
                      <p
                        className="text-red text-sm font-semibold leading-[23px] hover:underline"
                        onClick={() => showAlert(task)}
                      >
                        Delete Task
                      </p>
                    </div>
                  </div>
                </div> */}
              </div>
              <p className="text-[13px] font-medium text-mediumGrey leading-[23px]">
                {task.description}
              </p>
              <UserSelect />
              <div>
                {completedSubTasks && (
                  <p className="text-white leading-[15.12px] text-sm font-bold mb-5">
                    {`Subtasks (${completedSubTasks.length} of ${memoizedTaskData.subTask.length})`}
                  </p>
                )}
                <div className="h-28">
                  {task.subTask.map((subTask: any, index: number) => {
                    return (
                      <div
                        className="w-full bg-darkGrey p-2 rounded-lg mb-2 h-10 flex flex-row space-x-10 justify-left items-center"
                        key={index}
                      >
                        <Checkbox
                          checked={subTask.status === "COMPLETE"}
                          onChange={(event: any) => handleOnChange(event, subTask.id)}
                          style={{ marginRight: 8 }}
                        />
                        <p
                          className={`${subTask.status === "COMPLETE"
                            ? "line-through text-mediumGrey"
                            : "text-white"
                            }`}
                        >
                          {subTask.title}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )
        )}
      </div>
    </Modal >
  );
};
