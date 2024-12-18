import { useEffect, useRef, useState } from "react";
import { ListsContainer } from "./ListContainer/ListsContainer";
import { Header } from "./Header/Header";
import { Sidebar } from "./Sidebar";
import { BsClipboard, BsEye } from "react-icons/bs";
import { BooleanParam, StringParam, useQueryParam } from "use-query-params";
import { CreateTask } from "./Modals/CreateTask";
import { ListsContainerMobile } from "./ListContainerMobile/ListsContainer";
import { ListsContainerTable } from "./ListContainerTable/ListsContainer";
import { Flex, Tabs, TabsProps } from "antd";
import { TableOutlined } from "@ant-design/icons";
import ProjectStages from "./ProjectStages/ProjectStages";

// TODO: change the max-width dynamically
export const Container = () => {
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useQueryParam("EditBoard", BooleanParam);
  const [taskId, setTaskId] = useQueryParam("taskId", StringParam);
  const componentRef = useRef<HTMLDivElement>(null);
  const [updateTaskModalOpen, setUpdateTaskModalOpen] = useState(false);

  // const handleUpdateTaskModalClose = () => {
  //   setEditTask(undefined);
  //   setUpdateTaskModalOpen(false);
  //   setTaskId(undefined);
  // };

  // useEffect(() => {
  //   if (editTask) setUpdateTaskModalOpen(true);
  // }, [editTask]);

  /* This is for the side menu bar */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [componentRef, open]);

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: <Flex align="center" gap={10}>Доска <BsClipboard /></Flex>,
      children: <>
        <div className="desk">
          <ListsContainer />
        </div>
        <div className="mob">
          <ListsContainerMobile />
        </div>
      </>,
    },
    {
      key: '2',
      label: <Flex align="center" gap={10}>Таблица <TableOutlined /></Flex>,
      children: <ListsContainerTable />
      ,
    },
    {
      key: '3',
      label: 'Tab 3',
      children: <ProjectStages/>,
    },
  ];
  return (
    <>
      <div className={`w-full bg-darkBG `}>
        <Header />
        <div
          className={`fixed bottom-[30px] rounded-r-lg w-[56px] ml-[-10px] text-white z-10 bg-[#635FC7] pl-5 py-3 rounded-lg`}
          onClick={() => setOpen(!open)}
        >
          <BsEye size={20} />
        </div>

        <div className="flex">
          <div ref={componentRef}>
            <Sidebar open={open} />
          </div>
          <div
            className={`overflow-x-scroll p-5  w-full transition-all duration-300 ease-in-out ${open
              ? "ml-5 translate-x-[240px] max-w-[1150px]"
              : "translate-x-0"
              } ${"md:mt-0 mt-16"}`}
          >
            <Tabs style={{ marginTop: '6rem' }} defaultActiveKey="1" items={items} onChange={onChange} />;
          </div>
        </div>
      </div>
    </>
  );
};
