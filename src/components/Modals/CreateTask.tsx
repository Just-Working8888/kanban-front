import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { getColumnNames } from "../../requests/column";
import { useQuery, useQueryClient } from "react-query";
import { createTask, getTask, updateTask } from "../../requests/task";
import {
  Modal,
  Input,
  Button,
  Select,
  Typography,
  Divider,
  Space,
  Progress,
  Form as AntForm,
  ColorPicker,
  Image,
} from "antd";
import { BooleanParam, StringParam, useQueryParam } from "use-query-params";
import { showToast } from "../Common/Toast";
import { DeleteOutlined, InboxOutlined, PlusOutlined } from "@ant-design/icons";
import { ErrorMessage } from "formik";
import updateTaskImageFunction from "../../helpers/UpdateImage";
const priorities = [
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
];
const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  columnId?: string;
}

const subTasksPlaceHolders = [
  "Make coffee",
  "Make presentation",
  "Assign task",
  "Schedule interview",
];

export const CreateTask = ({ isOpen, onRequestClose, columnId }: ModalProps) => {
  const [columnsName, setColumnNames]: any = useState(null);

  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    }
  };
  const [queryParams] = useQueryParam("boardId", StringParam);
  const [taskId, setTaskId] = useQueryParam("taskId", StringParam);
  const [editTask, setEditTask] = useQueryParam("EditBoard", BooleanParam);
  const [color, setColor] = useState('#fff')

  const { data: taskData, isLoading: taskDataLoading } = useQuery(
    ["getTaskByIdForUpdate", taskId],
    () => getTask(taskId),
    {
      staleTime: Infinity,
      enabled: Boolean(editTask),
    }
  );

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
    setColumnNames(data?.data?.data?.columns || []);
  }, [data]);

  const initialData = {
    subTasks: editTask && !taskDataLoading
      ? taskData?.data.data.subTask.map((subTask: any) => subTask.title)
      : ["Make coffee", "Make presentation"], // Задаём несколько шаблонных подзадач
    title: editTask && !taskDataLoading ? taskData?.data.data.title : "Sample Task", // Пример заголовка
    color: '#fff',
    description:
      editTask && !taskDataLoading
        ? taskData?.data.data.description
        : "This is a sample description to give an idea.", // Пример описания
    columnId: editTask && !taskDataLoading ? taskData?.data.data.columnId : columnId || "",
    dueDate: editTask && !taskDataLoading ? taskData?.data.data.dueDate : "", // Оставляем пустым, так как это дата
    priority: editTask && !taskDataLoading ? taskData?.data.data.priority : "LOW", // Устанавливаем низкий приоритет по умолчанию
  };

  const handleFinish = (values: any) => {
    const data = {
      ...values,
      columnId: columnId,
      color: color,
      image: "",
      dueDate: values.dueDate ? new Date(values.dueDate) : null, // Преобразование строки в объект Date
      subTasks: values.subTasks.map((subTask: any) =>
        typeof subTask === "string" ? { title: subTask } : { title: subTask.title }
      ),
    };

    if (editTask) {
      const editTaskData = {
        ...data,
        priority: data.priority.priority,
        taskId: taskData?.data.data.id,
      };
      editTaskMutate(editTaskData, {
        onSuccess: () => {
          showToast.success("Task updated successfully");
          onRequestClose();
        },
        onError: () => {
          showToast.error("Something went wrong");
        },
        onSettled: () => {
          queryClient.invalidateQueries("allColumnData");
        },
      });
    } else {
      mutate(data, {
        onSuccess: (response) => {
          const taskId = response?.data.id;

          showToast.success("Task created successfully");
          if (taskId && file) {
            updateTaskImageFunction(taskId, file)
              .then(() => {
                showToast.success("Image updated successfully");
              })
              .catch((error) => {
                showToast.error("An error occurred while updating the image");
                console.error(error);
              });
          }

          onRequestClose();
        },
        onError: () => {
          showToast.error("An error occurred");
        },
        onSettled: () => {
          queryClient.invalidateQueries("allColumnData");
        },
      });
    }
  };
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
      open={isOpen || Boolean(editTask)}
      onCancel={onRequestClose}
      footer={null}
      centered
      width={700}
    >

      {imagePreview ? (
        <div className="w-full h-40 rounded-lg border-2 overflow-hidden" style={{ marginTop: 16 }}>
          <Image style={{ objectFit: 'contain' }} src={imagePreview} />
        </div>
      ) : <div className="flex flex-col items-center w-full">
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex items-center justify-center w-full h-40 rounded-lg border-2 border-dashed border-blue-500 bg-darkGrey hover:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
        >
          <InboxOutlined style={{ fontSize: '40px' }} />

        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>}
      {/* Превью картинки */}


      <br /><br />
      {taskDataLoading ? (
        <Text>Loading...</Text>
      ) : (
        <AntForm
          initialValues={initialData}
          onFinish={handleFinish}
          layout="vertical"
          style={{ width: "100%" }}
        >

          <AntForm.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please provide a title" }]}
          >
            <input className="bg-darkGrey border border-lines text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="e.g., Take coffee break" />
          </AntForm.Item>
          <AntForm.Item
            label="Color"
            name="color"
            rules={[{ required: true, message: "Please provide a color" }]}
          >
            <ColorPicker
              defaultFormat='hex'
              format='hex'
              onChange={(color) => {
                const hexColor = color.toHexString(); // Преобразуем в строку формата #RRGGBB
                setColor(hexColor)
              }}
              className="bg-darkGrey border border-lines text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              defaultValue="#1677ff"
              showText />
          </AntForm.Item>
          <AntForm.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please provide a description" },
            ]}
          >
            <textarea
              className="bg-darkGrey border border-lines text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

              rows={4}
              placeholder="e.g., It’s always good to take a break."
            />
          </AntForm.Item>



          <AntForm.Item label="Due Date" name="dueDate">
            <input className="bg-darkGrey border border-lines text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="date" />
          </AntForm.Item>
          <AntForm.Item label="priority" name="priority">

            <Select
              dropdownStyle={{ backgroundColor: '#2b2c37' }}

              placeholder="Select priority"
              style={{ width: "100%" }}
            >
              {priorities.map((priority) => (
                <Select.Option key={priority.value} value={priority.value}>
                  {priority.label}
                </Select.Option>
              ))}
            </Select>
          </AntForm.Item>

          <AntForm.List name="subTasks">
            {(fields, { add, remove }) => (
              <>
                <label>Subtasks</label>
                {fields.map((field, index) => (
                  <Space
                    key={field.key}
                    style={{
                      display: "flex",
                      marginBottom: 8,
                      justifyContent: "space-between",
                    }}
                    align="baseline"
                  >
                    <AntForm.Item
                      {...field}
                      name={[field.name]}
                      rules={[
                        { required: true, message: "Please provide a subtask" },
                      ]}
                      style={{ width: "90%" }}
                    >
                      <input
                        className="bg-darkGrey border border-lines text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

                        placeholder={`e.g., ${subTasksPlaceHolders[index % subTasksPlaceHolders.length]
                          }`}
                      />
                    </AntForm.Item>
                    <Button
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => remove(field.name)}
                    />
                  </Space>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: "100%" }}
                  icon={<PlusOutlined />}
                >
                  Add Subtask
                </Button>
              </>
            )}
          </AntForm.List>

          <Divider />
          {isLoading ? (
            <Progress style={{ color: "white" }} percent={progress} />
          ) : (
            <button
              type="submit"
              className="focus:outline-none w-full text-white bg-mainPurple hover:bg-mainPurpleHover focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              {editTask ? "Edit Task" : "Create Task"}
            </button>
          )}
        </AntForm>
      )}
    </Modal>
  );
};
