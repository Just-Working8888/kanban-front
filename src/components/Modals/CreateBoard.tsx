import { Modal, Progress } from "antd";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { createBoard } from "../../requests/board";
import { showToast } from "../Common/Toast";
import { useQueryClient } from "react-query";
import { Input, Button, Typography } from "antd";
import { useEffect, useState } from "react";

const { Text } = Typography;

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const CreateBoardValidationSchema = Yup.object().shape({
  name: Yup.string().required("Please provide name"),
});

export const CreateBoard = ({ isOpen, onRequestClose }: ModalProps) => {
  const { mutate, isLoading } = createBoard();
  const queryClient = useQueryClient();
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
      visible={isOpen}
      onCancel={onRequestClose}
      footer={null}
      title="Add New Board"
      centered
    >
      <Formik
        initialValues={{ name: "" }}
        validationSchema={CreateBoardValidationSchema}
        onSubmit={(values, { resetForm }) => {
          mutate({ ...values, userId: localStorage.getItem('userId') }, {
            onSuccess: () => {
              showToast.success("New board added");
              resetForm();
              onRequestClose();
              queryClient.invalidateQueries("allBoards");
            },
            onError: () => {
              showToast.error("Something went wrong");
            },
          });
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: "bold" }}>Name</label>

              <Field className="mt-2" name="name">
                {({ field }: any) => (
                  <input
                    {...field}
                    className="bg-darkGrey border border-lines text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

                    placeholder="e.g., Todo"
                    status={errors.name && touched.name ? "error" : ""}
                  />
                )}
              </Field>
              {errors.name && touched.name ? (
                <Text type="danger">{errors.name}</Text>
              ) : null}
            </div>
            {isLoading ? (
              <Progress style={{ color: 'white' }} percent={progress} status="active" />
            ) :
              <button
                type="submit"
                className="hidden md:block text-white text-xs bg-mainPurple hover:bg-mainPurpleHover font-bold px-6 py-4 rounded-3xl w-[100%]"
              >
                Create Board
              </button>}
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
