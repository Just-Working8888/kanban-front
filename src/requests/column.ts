import api from "./axios_client";
import { useMutation } from "react-query";
import { StringParam, useQueryParam } from "use-query-params";

export const getAllColumns = async (queryParams: any) => {
  const boardId = queryParams;

  const response = await api.get("/column/allColumns", {
    params: {
      boardId: boardId,
    },
  });

  return response;
};

export const moveWithInTheColumns = () => {
  return useMutation((data: any) => {
    return api.post("/column/moveWithInTheColumn", { data: data });
  });
};

export const moveDataInterColumn = () => {
  return useMutation((data: any) => {
    return api.post("/column/moveDataInterColumns", { data });
  });
};

export const createColumn = () => {
  const [queryParams, _] = useQueryParam("boardId", StringParam);
  return useMutation((data: any) => {
    return api.post(
      "/column",
      { data },
      {
        params: {
          boardId: queryParams,
        },
      }
    );
  });
};

export const getColumnNames = async (queryParams: any) => {
  const boardId = queryParams;

  const response = await api.get("/boardAndColumnUpdate/boardNameAndColumns", {
    params: {
      boardId: boardId,
    },
  });

  return response;
};
