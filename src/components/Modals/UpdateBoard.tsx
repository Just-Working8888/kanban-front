import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { RxCross2 } from "react-icons/rx";
import { getColumnNames } from "../../requests/column";
import { useQuery, useQueryClient } from "react-query";
import { createTask } from "../../requests/task";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "./Modal";
import { updateBoard } from "../../requests/board";
import { showToast } from "../Common/Toast";

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  item?: any;
}

const updateColumnNamesSchema = Yup.object().shape({
  id: Yup.string().optional(),
  name: Yup.string().required(),
});

const taskValidationSchema = Yup.object().shape({
  name: Yup.string().min(1).required("Please provide name"),
  colNames: Yup.array().of(updateColumnNamesSchema).optional(),
});

// TODO: scroll to the last position of subtasks
export const UpdateBoard = ({ isOpen, onRequestClose, item }: ModalProps) => {
  const subtasksDivRef = useRef<HTMLDivElement>(null);

  const className =
    "absolute top-1/2  left-1/2 transform -translate-x-1/2  -translate-y-1/2 bg-darkBG rounded-lg p-8 h-[343px] w-[659px] md:min-h-[675px] md:min-w-[480px]";

  const { mutate } = updateBoard();
  const queryClient = useQueryClient();

  return (
    <Modal
      className={className}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      children={
        <div className="flex flex-col p-8 space-y-5">
          <h1 className="text-white leading-[22.68px] text-xl">Edit board</h1>

          <Formik
            initialValues={item}
            validationSchema={taskValidationSchema}
            onSubmit={(values, { resetForm }) => {
              const data = {
                name: values.name,
                colNames: values.columns.map((col: any) => {
                  if (col.id) return { id: col.id, name: col.name };
                  return { name: col.name };
                }),
              };

              mutate(data, {
                onSuccess: () => {
                  showToast.success("Updated board");
                },
                onError: () => {
                  showToast.error("Something went wrong");
                },
                onSettled: () => {
                  queryClient.invalidateQueries("allColumnData");
                  queryClient.invalidateQueries("boardNameAndColumnsNames");
                  queryClient.invalidateQueries("oneColumnData");
                },
              });
            }}
          >
            {({ values, errors, touched, dirty }) => (
              <Form>
                <div className="flex flex-col space-y-5">
                  <div className="flex flex-col space-y-2">
                    <label className="text-white text-xs leading-[15.12px] font-bold ">
                      Name
                    </label>
                    <Field
                      name="name"
                      placeholder="eg: my dashboard"
                      className="bg-darkGrey border border-lines text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    {errors.name && touched.name ? (
                      <p className="text-center p-0 text-[#FC1111] font-[500] text-sm   leading-[27px]">
                        Please fill this field
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col space-y-2  ">
                    <label className="text-white text-xs leading-[15.12px] font-bold">
                      Columns
                    </label>

                    <FieldArray name="columns">
                      {({ remove, push }) => (
                        <div>
                          {/* TODO: make last element in focus */}
                          <div className="max-h-[300px] overflow-y-auto">
                            {values.columns.map((_: any, index: number) => (
                              <div key={index} id={`item-${index}`}>
                                <div className="flex flex-row space-x-5 overflow-y-scroll justify-center items-center">
                                  <Field
                                    value={values.columns[index].name}
                                    placeholder={`eg: Todo`}
                                    className={`bg-darkGrey border mb-2 text-white border-lines  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                    name={`columns.${index}.name`}
                                  />

                                  <RxCross2
                                    color={"gray"}
                                    size="25px"
                                    onClick={() => {
                                      remove(index);
                                    }}
                                  />

                                  <ErrorMessage
                                    component="p"
                                    name={`columns.${index}`}
                                    className="text-red text-sm min-w-[150px] text-right"
                                  />
                                </div>
                                <div ref={subtasksDivRef} />
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              push("");
                              if (subtasksDivRef.current) {
                                subtasksDivRef.current.focus();
                              }
                            }}
                            className="w-full mt-5 flex justify-center items-center bg-white rounded-3xl font-bold h-10 text-mainPurple"
                          >
                            {`+`} Add Column
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  <div className="flex flex-row justify-center items-center">
                    <button
                      type="submit"
                      className={`${
                        dirty
                          ? "focus:outline-none w-full  text-white bg-mainPurple hover:bg-mainPurpleHover focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                          : "opacity-0"
                      }`}
                    >
                      Update Board
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      }
    />
  );
};
