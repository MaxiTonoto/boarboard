import { Column } from "../components/BoardColumn.jsx";
import { CreateTaskForm } from "../components/CreateTaskForm.jsx";
import { OpenConfigButton } from "../components/OpenConfigButton.jsx";
import React, { useState } from "react";

export function Board({ props, onBack }) {

  const [creatingTask, setCreatingTask] = useState(false);
  const [creatingTaskColId, setCreatingTaskColId] = useState(props.columns[0].id);
  const openCreateTaskForm = () => {setCreatingTask(true);};
  const closeForm = () => {setCreatingTask(false);};

  return (
    <>
      <OpenConfigButton />
      { creatingTask && 
        <CreateTaskForm
          columnList={props.columns}
          onCloseForm={ closeForm }
          defaultColumnId = { creatingTaskColId }
        />
      }
      <button
        onClick={ onBack }
        className="bg-red-500 hover:bg-red-700 transition text-white p-2 px-3 rounded absolute top-0 left-0 m-4"
      >
        &lArr;
      </button>
      <h1
        className="text-4xl text-white text-center w-[100%] py-[0.5rem]"
      >
        {props.title}
      </h1>
      <main className="h-[88%] w-[98%] m-auto bg-[rgba(0,0,0,0.25)] rounded shadow-[0_0_16px_#000] relative flex flex-row gap-[0.5rem] overflow-x-scroll">
        {
          props.columns.map((col, index) => {
            return (
              <Column
                key={col.id}
                col={col}
                onCreateTask={ openCreateTaskForm }
                onOpenTaskCreation={ setCreatingTaskColId }
              />
            );
          })
        }
      </main>
    </>
  );
}
