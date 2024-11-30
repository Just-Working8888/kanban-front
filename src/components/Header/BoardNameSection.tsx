import { useEffect, useRef, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useQuery, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import { StringParam, useQueryParam } from "use-query-params";
import { deleteBoard, getOneBoard } from "../../requests/board";
import { showToast } from "../Common/Toast";
import { CreateTask } from "../Modals/CreateTask";
import { UpdateBoard } from "../Modals/UpdateBoard";
import { Avatar, Flex } from "antd";

export const BoardNameSection = () => {
  const [isOpenTaskModal, setIsOpenTaskModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [oneColumnData, setOneColumnData]: any = useState(null);
  const [isUpdateTaskModal, setIsUpdateTaskModal] = useState(false);
  const queryClient = useQueryClient();
  const [queryParams, setQueryParam] = useQueryParam("boardId", StringParam);

  const { data } = useQuery(
    ["oneColumnData", queryParams],
    () => getOneBoard(queryParams),
    {
      staleTime: Infinity,
      enabled: !queryParams === false,
    }
  );

  const { mutate } = deleteBoard();

  const onRequestClose = () => {
    setIsOpenTaskModal(false);
  };

  const handleUpdateBoardModal = () => {
    setIsUpdateTaskModal(true);
  };

  const closeUpdateBoardModal = () => {
    setIsUpdateTaskModal(false);
  };

  useEffect(() => {
    setOneColumnData(data?.data.data);
  }, [data]);

  const handleModalOpen = () => {
    setIsMenuOpen(false);
    setIsUpdateTaskModal(true);
  };

  const handleOnClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const customClass = `
  bg-darkGrey
  text-white
  `;

  const componentRef = useRef<HTMLDivElement>(null);

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
  }, [componentRef, isMenuOpen]);

  const showAlert = async () => {
    const result = await Swal.fire({
      title: "Are you sure, you want to delete the board?",
      text: `You are about to delete the ${oneColumnData.name}. This action cannot be undone. This action will remove all columns and tasks and cannot be reversed.`,
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
      const data = {
        boardId: queryParams,
      };

      mutate(data, {
        onSuccess: () => {
          showToast.success("Data deleted successfully");
        },
        onError: () => {
          showToast.error("Sorry something went wrong");
        },
        onSettled: () => {
          queryClient.invalidateQueries("allColumnData");
          queryClient.invalidateQueries("allBoards");
          setQueryParam(undefined);
        },
      });
    }
  };

  return (
    <>
      {oneColumnData && (
        <>
          {/* Don't handle the state here, as this modal is used somewhere else in the code,
            might do the unnecessary re-rendering,
            so you can add a param here that will be used to trigger this modal,
            similarly can do the same for the updateBoard. 
          */}

          <UpdateBoard
            isOpen={isUpdateTaskModal}
            onRequestClose={closeUpdateBoardModal}
            item={oneColumnData}
          />
          <div className="w-full  z-[100] flex flex-row px-4 md:px-8 items-center">
            <div className="w-full flex flex-row  items-center justify-between">

              <Flex align="center" gap={10}>
               
                <h1 className="text-xl max-w-[200px] md:max-w-[400px] truncate md:text-2xl text-white font-bold leading-7">
              {oneColumnData.name}
                </h1>
              </Flex>

              <div className="flex flex-row space-x-3">
                <a
                  href="/login"
                  className="text-mediumGrey text-sm font-semibold leading-[23px] hover:underline cursor-pointer"
                >
                  Войти
                </a>
                <p
                  className="text-mediumGrey text-sm font-semibold leading-[23px] hover:underline cursor-pointer"
                  onClick={handleModalOpen}
                >
                  Edit Board
                </p>
                <p
                  className="text-red text-sm font-semibold leading-[23px] hover:underline cursor-pointer"
                  onClick={() => showAlert()}
                >
                  Delete Board
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
