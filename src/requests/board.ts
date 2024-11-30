import api from "./axios_client";
import { useMutation } from "react-query";
import { StringParam, useQueryParam } from "use-query-params";

export const updateBoard = () => {
  const [queryParams, _] = useQueryParam("boardId", StringParam);
  return useMutation((data: any) => {
    return api.put(
      "/boardAndColumnUpdate",
      { data: data },
      {
        params: {
          boardId: queryParams,
        },
      }
    );
  });
};

export const deleteBoard = () => {
  return useMutation((data: any) => {
    return api.delete("/board", {
      params: {
        boardId: data.boardId,
      },
    });
  });
};

export const getAllBoards = async () => {
  const result = await api.get("/board");
  return result;
};

export const createBoard = () => {
  return useMutation((data: any) => {
    return api.post("/board", { data });
  });
};

export const getOneBoard = async (queryParams: any) => {
  const boardId = queryParams;

  const response = await api.get("/board/getOneBoard", {
    params: {
      boardId: boardId,
    },
  });

  return response;
};
