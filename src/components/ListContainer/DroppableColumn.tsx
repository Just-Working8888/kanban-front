import { useState } from "react";
import { DraggableItem } from "./DraggableItem";
import { StrictModeDroppable as Droppable } from "./StrictModeDroppable";
import { CreateTask } from "../Modals/CreateTask";

interface DroppableColumnProps {
  id: string;
  indicatorColor: string;
  column: any;
  index: number;
}

export const DroppableColumn = ({
  id,
  indicatorColor,
  column,
  index,
}: DroppableColumnProps) => {
  const [isOpenTaskModal, setIsOpenTaskModal] = useState(false);
  const onRequestClose = () => {
    setIsOpenTaskModal(false);
  };

  return (
    <div className="flex flex-col space-y-10  min-w-[380px] columsex" style={{height:'fit-content'}} key={index}>
      <p className="flex flex-row space-x-3 items-center">
        <span className={`flex w-3 h-3 ${indicatorColor} rounded-full`} />
        <span className="text-xs font-bold leading-4 text-mediumGrey tracking-widest uppercase">
          {column.name} ({column.items.length})
        </span>
      </p>
      <Droppable droppableId={id} key={id}>
        {(provided) => {
          return (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {column.items.map((item: any, index: number) => {
                return <DraggableItem item={item} index={index} key={index} />;
              })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
      <button
        data-modal-target="defaultModal"
        data-modal-toggle="defaultModal"
        className="md:block text-white text-xs bg-mainPurple hover:bg-mainPurpleHover font-bold px-6 py-4 rounded-3xl"
        onClick={() => setIsOpenTaskModal(true)}
      >
        + Add new task
      </button>
      <CreateTask
        columnId={id}
        isOpen={isOpenTaskModal}
        onRequestClose={onRequestClose}
      />
    </div>
  );
};
