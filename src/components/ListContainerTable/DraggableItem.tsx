import { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useLongPress } from "use-long-press";
import Swal from "sweetalert2";
import "@sweetalert2/theme-dark/dark.css";
import { deleteTask } from "../../requests/task";
import { useQueryClient } from "react-query";
import { ShowItem } from "../Modals/ShowItem";
import { showToast } from "../Common/Toast";
import { BooleanParam, StringParam, useQueryParam } from "use-query-params";
import { Progress, Badge, Tooltip, Avatar } from "antd";
import dayjs from "dayjs";
import { AntDesignOutlined, UserOutlined } from "@ant-design/icons";

interface DraggableItemProps {
  index: number;
  item: any;
}

export const DraggableItemTable = ({ index, item }: DraggableItemProps) => {
  const [isLongPress, setIsLongPress] = useState(false);
  const queryClient = useQueryClient();

  const [_, setTaskId] = useQueryParam("taskId", StringParam);
  const [editTask, setEditTask] = useQueryParam("EditBoard", BooleanParam);
  const completedSubTasks = item.subTask?.filter((subtask: any) => {
    return subtask.status === "COMPLETE";
  });

  const [showItemModalOpen, setShowItemModalOpen] = useState(false);
  const customClass = `
  bg-darkGrey
  text-white
  `;

  const { mutate } = deleteTask();

  const showAlert = async (data: any) => {
    const result = await Swal.fire({
      title: "Are you sure, you want to delete the selected task?",
      text: "You are about to delete this item. This action cannot be undone.",
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

    if (result.isConfirmed) {
      mutate(data, {
        onSuccess: () => {
          showToast.success("Data deleted successfully");
        },
        onError: () => {
          showToast.error("Sorry something went wrong");
        },
        onSettled: () => {
          queryClient.invalidateQueries("allColumnData");
        },
      });
    }
    setIsLongPress(false);
  };

  const onRequestClose = () => {
    if (!editTask) setTaskId(undefined);
    setShowItemModalOpen(false);
  };

  const handleOnClick = () => {
    if (!isLongPress) {
      setEditTask(undefined);
      setShowItemModalOpen(true);
      setTaskId(item?.id);
    }
  };

  const bind = useLongPress(() => { }, {
    onStart: () => {
      setIsLongPress(true);
    },
    onCancel: () => {
      setIsLongPress(false);
    },
    filterEvents: (event) => true,
    threshold: 300,
    captureEvent: true,
    cancelOnMovement: false,
  });

  useEffect(() => {
    if (editTask) {
      onRequestClose();
    }
  }, [editTask]);

  // Priority color mapping
  const priorityColors: Record<string, string> = {
    HIGH: "red",
    MEDIUM: "orange",
    LOW: "green",
  };

  return (
    <>
      <ShowItem
        isOpen={showItemModalOpen}
        setShowItemModalOpen={setShowItemModalOpen}
        onRequestClose={onRequestClose}
      />

      <Draggable draggableId={item.id} key={item.id} index={index}>
        {(provided) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.dragHandleProps}
              {...provided.draggableProps}
              {...bind({
                taskId: item.id,
                columnId: item.columnId,
              })}
              onClick={handleOnClick}
              className="transition-all duration-300 ease-in-out hover:bg-darkGrey-800 cursor-pointer rounded-lg mb-2"
            >
              <li
                style={{ borderTop: `3px solid ${item.color}` }}
                className="w-full flex items-center p-4 bg-darkGrey rounded-lg mb-3 overflow-hidden shadow-lg hover:shadow-xl relative"
              >
                <div className="flex flex-grow justify-between items-center">
                  <div className="flex flex-col flex-grow max-w-[220px]">
                    <p className="text-white font-bold text-[16px] leading-5 truncate">{item.title}</p>
                    <p className="text-mediumGrey text-xs">{dayjs(item.dueDate).format("MMM DD, YYYY")}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Badge
                      size="small"
                      color={priorityColors[item.priority] || "default"}
                      className="mb-2"
                    />
                    <span className="text-white text-sm font-semibold">{item.priority}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-mediumGrey text-xs">
                      {`${completedSubTasks.length} of ${item.subTask.length} subtasks done`}
                    </p>
                    <Progress
                      percent={Math.round((completedSubTasks.length / item.subTask.length) * 100)}
                      size="small"
                      status="active"
                      type="circle"
                    />
                  </div>
                  <div className="ml-4">
                    <Avatar.Group maxCount={3}>
                      {item?.assignedUsers.map((user: any) =>
                        <Tooltip title={user.userName} key={user.id}>
                          <Avatar size="small" src={user.avatar || 'https://api.dicebear.com/9.x/adventurer/svg?seed=Aidan'} />
                        </Tooltip>
                      )}
                    </Avatar.Group>
                  </div>
                </div>
              </li>
            </div>
          );
        }}
      </Draggable>
    </>
  );
};
