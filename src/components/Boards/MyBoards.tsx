import { useEffect, useState } from "react";
import { TbTemplate } from "react-icons/tb";
import { useQuery } from "react-query";
import { StringParam, useQueryParam } from "use-query-params";
import { Button, message } from "antd";
import { getAllBoards } from "../../requests/board";
import { CreateBoard } from "../Modals/CreateBoard";
import { Link, useNavigate } from "react-router-dom";


export const MyBoards = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [_, setBoardId] = useQueryParam("boardId", StringParam);
    const [openCreateBoardModal, setOpenCreateBoardModal] = useState(false);
    const navigate = useNavigate()
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

            <div className="flex flex-col  w-full mt-5 ">
                <p className="text-mediumGrey text-[14px] leading-[15.12px] font-bold">
                    All Boards ({boardData?.length})
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
                    {boardData?.map((board: any, index) => (
                        <div
                            key={index}
                            className={`card ${index === activeIndex ? "border-2 border-mainPurple" : "border border-gray-300"} 
                                p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer transform transition-all duration-300 ease-in-out`}
                            onClick={() => handleClick(index, board.id)}
                        >
                            <Link to="/">
                                <div className="flex items-center space-x-4">
                                    <TbTemplate
                                        size={30}
                                        color={`${index === activeIndex ? "white" : "#828FA3"}`}
                                    />
                                    <p
                                        className={`text-[14px] font-bold ${index === activeIndex ? "text-white" : "text-mediumGrey"}`}
                                        style={{ maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                    >
                                        {board?.name}
                                    </p>
                                </div>
                            </Link>

                        </div>
                    ))}
                    <div
                        className="card border border-mainPurple p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
                        onClick={onCreateModalClick}
                    >
                        <div className="flex items-center space-x-4">
                            <TbTemplate size={30} color="#635FC7" />
                            <p className="text-[14px] font-bold text-mainPurple hover:underline">
                                + Create New Board
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
