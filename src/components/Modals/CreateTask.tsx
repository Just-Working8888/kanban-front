import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { getColumnNames } from "../../requests/column";
import { useQuery, useQueryClient } from "react-query";
import { createTask, getTask, updateTask } from "../../requests/task";
import { Modal, Input, Button, Select, Typography, Divider, Space, Progress, Flex } from "antd";
import { BooleanParam, StringParam, useQueryParam } from "use-query-params";
import { showToast } from "../Common/Toast";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import ScrollableFeed from "react-scrollable-feed";

const { TextArea } = Input;
const { Text } = Typography;


interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  columnId?: string;  // Добавляем columnId как необязательный пропс
}

const subTasksPlaceHolders = [
  "make coffee",
  "make presentation",
  "assign task",
  "schedule interview",
];

const validateSubTask = Yup.object().shape({
  title: Yup.string().min(1).required("Please provide title"),
  id: Yup.string().optional(),
  taskId: Yup.string().optional(),
  status: Yup.string().optional(),
  position: Yup.number().optional(),
});

const taskValidationSchema = Yup.object().shape({
  title: Yup.string().min(1).required("Please provide title"),
  description: Yup.string().min(1).required("Please provide description"),
  columnId: Yup.string().required("Please provide columnId"),
  subTasks: Yup.array().of(validateSubTask.required()),
});

export const CreateTask = ({ isOpen, onRequestClose, columnId }: ModalProps) => {
  const [columnsName, setColumnNames]: any = useState(null);

  const [queryParams] = useQueryParam("boardId", StringParam);
  const [taskId, setTaskId] = useQueryParam("taskId", StringParam);
  const [editTask, setEditTask] = useQueryParam("EditBoard", BooleanParam);

  const componentRef = useRef<HTMLDivElement>(null);

  const { data: taskData, isLoading: taskDataLoading } = useQuery(
    ["getTaskByIdForUpdate", taskId],
    () => getTask(taskId),
    {
      staleTime: Infinity,
      enabled: Boolean(editTask),
    }
  );

  useEffect(() => {
    componentRef?.current?.scrollIntoView();
  });

  const { data } = useQuery(
    ["allColumnsNames", queryParams],
    () => getColumnNames(queryParams),
    {
      staleTime: Infinity,
    }
  );

  const queryClient = useQueryClient();
  const { mutate, isLoading } = createTask();
  const { mutate: editTaskMutate } = updateTask();

  useEffect(() => {
    setColumnNames(data?.data.data);
  }, [data]);

  // Используем columnId из пропсов как начальное значение, если оно передано
  const initialData = {
    subTasks: editTask && !taskDataLoading ? taskData?.data.data.subTask : [""],
    title: editTask && !taskDataLoading ? taskData?.data.data.title : "",
    description:
      editTask && !taskDataLoading ? taskData?.data.data.description : "",
    columnId: editTask && !taskDataLoading ? taskData?.data.data.columnId : columnId || "",
  };
  // Прогресс как состояние для отслеживания загрузки
  const [progress, setProgress] = useState(0); // Прогресс от 0 до 100

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 100) {
            return prev + 10; // Увеличиваем прогресс на 10% каждые 300ms
          } else {
            clearInterval(interval); // Останавливаем прогресс, когда достигнут 100%
            return 100;
          }
        });
      }, 300);

      return () => clearInterval(interval); // Очистка интервала
    }
  }, [isLoading]);
  return (
    <Modal
      title={editTask ? "Edit Task" : "Add New Task"}
      visible={isOpen || Boolean(editTask)}
      onCancel={onRequestClose}
      footer={null}
      centered
      width={700}
    >
      {taskDataLoading ? (
        <Text>Loading...</Text>
      ) : (
        <Formik
          initialValues={initialData}
          validationSchema={taskValidationSchema}
          onSubmit={(values, { resetForm }) => {
            const data = {
              ...values,
              subTasks: values.subTasks.map((value: any) =>
                value.id ? { id: value.id, title: value.title } : { title: value.title }
              ),
            };

            if (editTask) {
              const editTaskData = {
                ...data,
                taskId: taskData?.data.data.id,
              };
              editTaskMutate(editTaskData, {
                onSuccess: () => {
                  showToast.success("Task updated successfully");
                  onRequestClose()
                  setProgress(0)
                },
                onError: () => {
                  showToast.error("Something went wrong");
                },
                onSettled: () => {
                  queryClient.invalidateQueries("allColumnData");
                  queryClient.invalidateQueries("getTaskByIdForUpdate");
                  queryClient.invalidateQueries("getTaskById");
                },
              });
            } else {
              mutate(data, {
                onSuccess: () => {
                  showToast.success("Task created successfully");
                  resetForm();
                  onRequestClose()
                  setProgress(0)
                },
                onError: () => {
                  showToast.error("An error occurred");
                },
                onSettled: () => {
                  queryClient.invalidateQueries("allColumnData");
                  resetForm();
                },
              });
            }
          }}
        >
          {({ values, errors, touched, dirty }) => (
            <Form>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <label>Title</label>
                <Field
                  className="bg-darkGrey border border-lines text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

                  name="title"
                  placeholder="e.g., Take coffee break"
                />

                <ErrorMessage name="title">
                  {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                </ErrorMessage>

                <label>Description</label>
                <Field
                  className="bg-darkGrey border border-lines text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

                  name="description"
                  placeholder="e.g., It’s always good to take a break."
                  rows={4}
                />
                <ErrorMessage name="description">
                  {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                </ErrorMessage>
                <label>Subtasks</label>
                <FieldArray name="subTasks">
                  {({ remove, push }) => (
                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                      <ScrollableFeed>
                        {values.subTasks.map((_: any, index: number) => (
                          <Space key={index} style={{ width: "100%", marginBottom: 8 }}>
                            <Field
                              className="bg-darkGrey border border-lines text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

                              placeholder={`e.g., ${subTasksPlaceHolders[index % subTasksPlaceHolders.length]}`}
                              name={`subTasks.${index}.title`}
                            />
                            <Button
                              type="text"
                              icon={<DeleteOutlined />}
                              onClick={() => remove(index)}
                              danger
                            />
                          </Space>
                        ))}
                      </ScrollableFeed>
                      <button
                        className="hidden md:block text-white text-xs bg-mainPurple hover:bg-mainPurpleHover font-bold px-6 py-4 rounded-3xl"

                        onClick={() => push("")}
                        style={{ width: "100%", marginTop: 8 }}
                      >
                        Add New Subtask
                      </button>
                    </div>
                  )}
                </FieldArray>

                {/* <label>Status</label>
                <Field name="columnId">
                  {({ field, form }: any) => (
                    <Select
                      {...field}
                      placeholder="Select column"
                      onChange={(value) => form.setFieldValue(field.name, value)}
                      style={{ width: "100%" }}
                    >
                      {columnsName?.columns.map((column: any) => (
                        <Option key={column.id} value={column.id}>
                          {column.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Field>

                <ErrorMessage name="columnId">
                  {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                </ErrorMessage> */}
                <Divider />
                {isLoading ? (
                  <Flex justify="center">
                    <Progress type='circle' style={{ color: 'white' }} percent={progress} status="active" />
                  </Flex>) :
                  <button
                    type="submit"
                    className="hidden md:block text-white text-xs bg-mainPurple hover:bg-mainPurpleHover font-bold px-6 py-4 rounded-3xl w-[100%]"
                  >
                    {editTask ? "Редактировать" : "Создать"}
                  </button>
                }
              </Space>
            </Form>
          )}
        </Formik>
      )}
    </Modal>
  );
};
