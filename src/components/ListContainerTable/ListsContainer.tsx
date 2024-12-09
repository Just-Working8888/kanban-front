import { useEffect, useMemo, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { AddColumn } from "./AddColumn";
import { indicatorColor } from "./indicatorColor";
import { useQuery } from "react-query";
import {
  getAllColumns,
  moveDataInterColumn,
  moveWithInTheColumns,
} from "../../requests/column";
import { StringParam, useQueryParam } from "use-query-params";
import { showToast } from "../Common/Toast";
import { Button } from "flowbite-react";
import { DroppableColumnTable } from "./DroppableColumn";

interface WithInColumRequest {
  taskId: string;
  position: number;
}

export const ListsContainerTable = () => {
  const [columns, setColumns] = useState(null);

  const { mutate: moveWithInTheColumnMutate } = moveWithInTheColumns();

  const { mutate: moveDataInterColumnMutate } = moveDataInterColumn();

  const [queryParams, _] = useQueryParam("boardId", StringParam);

  const { data, isLoading, error } = useQuery(
    ["allColumnData", queryParams],
    () => getAllColumns(queryParams),
    {
      staleTime: Infinity,
      enabled: !queryParams === false,
    }
  );

  // TODO: remove this useEffect
  const memoizedColumnsData = useMemo(() => {
    return data?.data.data;
  }, [data]);

  useEffect(() => {
    setColumns(memoizedColumnsData);
  }, [memoizedColumnsData]);

  const onDragEnd = (result: any, columns: any, setColumns: any, _: any) => {
    const { source, destination } = result;

    if (!result.destination) return;

    const prevData = columns;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [remove] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, remove);

      // prepare data to send to server
      const data = {
        destinationColumnId: destination.droppableId,
        sourceColumnId: source.droppableId,
        sourceColData: sourceItems.map((item) => {
          return { id: item.id, position: item.position };
        }),
        destinationColData: destItems.map((item) => {
          return { id: item.id, position: item.position };
        }),
      };

      moveDataInterColumnMutate(data, {
        onError: (err: any) => {
          // TODO: make a toast error message
          // if error then go back to the previous state data
          setColumns(prevData);
          return;
        },
      });

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else if (source.index !== destination.index) {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      // prepare data to send to server
      const data: Array<WithInColumRequest> = [];
      copiedItems.map((item, index) => {
        data.push({ taskId: item.id, position: index });
      });

      moveWithInTheColumnMutate(data, {
        onError: () => {
          showToast.error("Something went wrong");
          setColumns(prevData);
          return;
        },
      });

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  return (
    <>
      {columns && (
        <div style={{ width: '100%' }} className="w-full h-[80vh]    overflow-y-scroll ">
          <DragDropContext
            onDragEnd={(result, provided) =>
              onDragEnd(result, columns, setColumns, provided)
            }
          >
            {columns &&
              Object.entries(columns).map(([id, column], index) => {
                return (
                  <DroppableColumnTable
                    id={id}
                    indicatorColor={
                      indicatorColor[index % indicatorColor.length]
                    }
                    index={index}
                    column={column}
                    key={index}
                  />
                );
              })}
          </DragDropContext>
          <AddColumn />

        </div>
      )}
    </>
  );
};
