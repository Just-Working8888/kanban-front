import { useEffect, useState } from "react";
import { TbTemplate } from "react-icons/tb";
import { useQuery } from "react-query";
import { StringParam, useQueryParam } from "use-query-params";
import { getAllBoards } from "../requests/board";
import { CreateBoard } from "./Modals/CreateBoard";

interface SidebarProps {
  open: boolean;
}

export const Sidebar = ({ open }: SidebarProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [_, setBoardId] = useQueryParam("boardId", StringParam);
  const [openCreateBoardModal, setOpenCreateBoardModal] = useState(false);

  const [boardData, setBoardData] = useState([]);

  const { data } = useQuery(["allBoards"], getAllBoards, {
    staleTime: Infinity,
  });

  const onRequestClose = () => {
    setOpenCreateBoardModal(false);
  };

  const onCreateModalClick = () => {
    setOpenCreateBoardModal(true);
  };

  // TODO: what happens if there is no board
  useEffect(() => {
    setBoardData(data?.data.data);
    setBoardId(data?.data.data[0]?.id);
    setActiveIndex(0);
  }, [data]);

  const handleClick = (index: number, boardId: string) => {
    setActiveIndex(index);
    setBoardId(boardId);
  };

  return (
    <>
      <CreateBoard
        isOpen={openCreateBoardModal}
        onRequestClose={onRequestClose}
      />

      {boardData && (
        <div
          className={`w-[265px] absolute z-[2]  top-24 bg-darkGrey transition-all duration-300 ease-in-out ${
            open ? "translate-x-0" : "translate-x-[-400px]"
          }`}
        >
          <div className="flex flex-col h-screen w-full mt-5 ml-6">
            <p className="text-mediumGrey text-[14px] leading-[15.12px] font-bold">
              All Boards ({boardData.length})
            </p>

            <div className="flex flex-col mt-5 space-y-5">
              {boardData.map((board: any, index) => (
                <div
                  key={index}
                  className={`flex flex-row space-x-2 items-center ${
                    index === activeIndex
                      ? "bg-mainPurple rounded-lg p-2 w-[200px]"
                      : ""
                  } hover:cursor-pointer`}
                  onClick={() => handleClick(index, board.id)}
                >
                  <TbTemplate
                    size={20}
                    color={`${index === activeIndex ? "white" : "#828FA3"}`}
                  />
                  <p
                    className={`text-[12px]  font-bold ${
                      index === activeIndex ? "text-white" : "text-mediumGrey"
                    }  max-w-[200px] truncate`}
                  >
                    {board?.name}
                  </p>
                </div>
              ))}
              <div
                className="flex flex-row space-x-2 items-center"
                onClick={onCreateModalClick}
              >
                <TbTemplate size={20} color="#635FC7" />
                <p className="text-[12px] font-bold text-mainPurple max-w-[200px] truncate hover:underline hover:cursor-pointer ">
                  + Create New Board
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
