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
import { Progress, Badge, Tooltip, Avatar, Image, Flex } from "antd";
import dayjs from "dayjs";
import { AntDesignOutlined, UserOutlined } from "@ant-design/icons";

interface DraggableItemProps {
  index: number;
  item: any;
}

export const DraggableItemMobile = ({ index, item }: DraggableItemProps) => {
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
    // onFinish: (_, { context }) => {
    //   showAlert(context);
    // },
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
            >
              <li
                style={{ borderTop: `3px solid ${item.color}` }}
                className={`w-full bg-darkGrey
                 rounded-lg mb-1 list-none p-2 item relative overflow-hidden`}
                key={index}
              >

                <div className="flex flex-col space-y-2">
                  <p className="max-w-[248px] text-white font-bold text-[12px] leading-5 truncate flex gap-1  justify-between">
                    <Flex gap={3}>
                      <Badge
                        size='small'
                        color={priorityColors[item.priority] || "default"}
                      />
                      {item.title}
                    </Flex>
                    до: {dayjs(item.dueDate).format("MMM DD, YYYY")}
                  </p>
                  <p className="text-mediumGrey leading-4 font-bold text-xs m-0">
                    {`${completedSubTasks.length} of ${item.subTask.length} subtasks done`}
                  </p>
                  <Progress
                    percent={Math.round((completedSubTasks.length / item.subTask.length) * 100)}
                    size="small"
                    status="active"
                  />
                </div>
                <Avatar.Group>
                  {item?.assignedUsers.map((user: any) =>
                    <Tooltip title={user.userName}>
                      <Avatar size='small' key={user.id} src={user.avatar ? user.avatar : 'https://api.dicebear.com/9.x/adventurer/svg?seed=Aidan'} />
                    </Tooltip>
                  )}
                </Avatar.Group>
              </li>
            </div>
          );
        }}
      </Draggable>
    </>
  );
};
