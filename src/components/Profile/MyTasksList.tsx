import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { deleteTask } from "../../requests/task";
import { useQueryClient } from "react-query";
import { ShowItem } from "../Modals/ShowItem";
import { showToast } from "../Common/Toast";
import { BooleanParam, StringParam, useQueryParam } from "use-query-params";
import { Progress, Badge, Tooltip, Avatar } from "antd";
import dayjs from "dayjs";

interface TaskItemProps {
    item: any;
}

export const TaskItem = ({ item }: TaskItemProps) => {
    const [isLongPress, setIsLongPress] = useState(false);
    const queryClient = useQueryClient();

    const [_, setTaskId] = useQueryParam("taskId", StringParam);
    const [editTask, setEditTask] = useQueryParam("EditBoard", BooleanParam);
    const completedSubTasks = item.subTask?.filter((subtask: any) => subtask.status === "COMPLETE");

    const [showItemModalOpen, setShowItemModalOpen] = useState(false);
    const customClass = `bg-darkGrey text-white`;

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

            <div
                className=" w-96 bg-darkGrey rounded-lg mb-5 p-5 item"
                style={{ borderTop: `5px solid ${item.color}` }}
                onClick={handleOnClick}
            >
                <div className="flex flex-col space-y-2">
                    {/* Title */}
                    <p className="min-w-[248px] max-w-[248px] text-white font-bold text-[15px] leading-5 truncate">
                        {item.title}
                    </p>

                    {/* Priority */}
                    <Tooltip title={`Priority: ${item.priority}`}>
                        <Badge
                            color={priorityColors[item.priority] || "default"}
                            text={item.priority}
                        />
                    </Tooltip>

                    {/* Due Date */}
                    {item.dueDate && (
                        <Tooltip title="Due Date">
                            <p className="text-mediumGrey text-xs font-bold">
                                Due: {dayjs(item.dueDate).format("MMM DD, YYYY")}
                            </p>
                        </Tooltip>
                    )}

                    {/* Subtasks */}
                    <p className="text-mediumGrey leading-4 font-bold text-xs">
                        {`${completedSubTasks?.length} of ${item?.subTask?.length} subtasks done`}
                    </p>
                    <Progress
                        percent={(completedSubTasks?.length / item?.subTask?.length) * 100}
                        size="small"
                        status="active"
                    />
                </div>
                <br />
                <Avatar.Group>
                    {item?.assignedUsers.map((user: any) => (
                        <Tooltip title={user.userName} key={user.id}>
                            <Avatar
                                src={user.avatar || "https://api.dicebear.com/9.x/adventurer/svg?seed=Aidan"}
                            />
                        </Tooltip>
                    ))}
                </Avatar.Group>
            </div>
        </>
    );
};

// Компонент списка задач
interface TaskListProps {
    tasks: any[];
}

export const TaskList = ({ tasks }: TaskListProps) => {
    return (
        <div className="flex gap-3 flex-wrap">
            {tasks?.map((task, index) => (
                <TaskItem key={task.id} item={task} />
            ))}
        </div>
    );
};
