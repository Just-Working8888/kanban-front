import { Formik, Form, Field } from "formik";
import { useQueryClient } from "react-query";
import { createColumn } from "../../requests/column";
import * as Yup from "yup";
import { showToast } from "../Common/Toast";
import { Modal, Progress } from "antd"; // Импорт Modal и Progress из Ant Design
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const CreateColumnValidationSchema = Yup.object().shape({
  name: Yup.string().required("Please provide name"),
});

export const CreateNewColumn = ({ isOpen, onRequestClose }: ModalProps) => {
  const { mutate, isLoading } = createColumn(); // isLoading отслеживает состояние загрузки
  const queryClient = useQueryClient();

  // Прогресс как состояние для отслеживания загрузки
  const [progress, setProgress] = React.useState(0); // Прогресс от 0 до 100

  React.useEffect(() => {
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
      title="Add new column"
      visible={isOpen} // Модальное окно будет видно, если isOpen true
      onCancel={onRequestClose} // Закрытие окна при нажатии на "Cancel"
      footer={null} // Убираем стандартные кнопки внизу модального окна
    >
      <Formik
        initialValues={{ name: "" }}
        validationSchema={CreateColumnValidationSchema}
        onSubmit={(values, { resetForm }) => {
          mutate(values, {
            onSuccess: () => {
              showToast.success("New column added");
              resetForm();
              onRequestClose(); // Закрытие модального окна после успешного добавления
            },
            onError: () => {
              showToast.error("Something went wrong");
            },
            onSettled: () => {
              queryClient.invalidateQueries("allColumnData");
              queryClient.invalidateQueries("allColumnsNames");
            },
          });
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <div className="flex flex-col space-y-10">
              <div className="flex flex-col space-y-2">
                <label className="text-white text-xs leading-[15.12px] font-bold ">
                  Name
                </label>
                <Field
                  name="name"
                  placeholder="eg: Todo"
                  className="bg-darkGrey border border-lines text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.name && touched.name ? (
                  <p className="text-center p-0 text-[#FC1111] font-poppins font-[500] text-sm leading-[27px]">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col space-y-2">
                {/* Отображаем прогресс загрузки */}

              </div>

              <div className="flex flex-row justify-center items-center">
                {isLoading ? (
                  <Progress style={{ color: 'white' }} percent={progress} status="active" />
                ) : <button
                  type="submit"
                  disabled={isSubmitting || isLoading} // Блокируем кнопку при загрузке
                  className="focus:outline-none w-full text-white bg-mainPurple hover:bg-mainPurpleHover focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  {isSubmitting || isLoading ? "Creating..." : "Create Column"}
                </button>}

              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
