import { Column } from "../components/BoardColumn.jsx";
import { TaskCard } from "../components/TaskCard.jsx";
import { CreateTaskForm } from "../components/CreateTaskForm.jsx";
import { BoardPageButtons } from "../components/BoardPageButtons.jsx";
import React, { useState } from "react";
import { Bounce, toast } from "react-toastify";
import { 
  deleteTask,
  patchTaskOrder,
  patchTaskColumnAndOrder,
} from "../../api/taskApi.js";

import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export function Board({ props, onBack }) {
  const [boardColumns, setBoardColumns] = useState(props.columns);
  const [activeTask, setActiveTask] = useState(null);

  const [creatingTask, setCreatingTask] = useState(false);
  const [creatingTaskColId, setCreatingTaskColId] = useState(
    props.columns[0].id
  );
  const openCreateTaskForm = () => {
    setCreatingTask(true);
  };
  const closeForm = () => {
    setCreatingTask(false);
  };
  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
    setBoardColumns((prev) => {
      const newColumns = prev.map(col => {
        return {
          ...col,
          tasks: col.tasks.filter(task => task.id !== taskId),
        };
      });
      return newColumns;
    });
    toast.error(`Task deleted!`, {
      position: "bottom-left",
      autoClose: 3000,
      closeOnClick: true,
      pauseOnHover: false,
      theme: "dark",
      transition: Bounce,
    });
  };

  const handleDragStart = (e) => {
    const { active } = e;
    active.data.current?.type === "Task" && setActiveTask(active.data.current.task);
  };
  
  const handleDragEnd = (e) => {
    setActiveTask(null);
    const { active, over } = e;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    setBoardColumns(columns => {
      // dragged task's original column
      const activeColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === activeId)
      );
      // find the column where the task was dropped
      const overColumn = boardColumns.find((col) => col.id === overId ||
        // if it was dropped over a task, get it's column
        col.tasks.some((task) => task.id === overId)
      );

      // guard clause in case a column wasn't found
      if (!activeColumn || !overColumn) return columns;

      // helper function
      const assignOrder = (tasks) =>
        tasks.map((task, index) => ({ ...task, order: index + 1 }));

      // reorder tasks on same column
      if (activeColumn.id === overColumn.id) {
        // index of the dragged task before the drag
        const activeIndex = activeColumn.tasks.findIndex((t) => t.id === activeId);

        // index of the task that got the dragged task dropped over
        let overIndex = overColumn.tasks.findIndex((t) => t.id === overId);
        (overIndex === -1) && (overIndex = overColumn.tasks.length-1)

        // apply reordering of tasks on a copy
        const newTasks = arrayMove(activeColumn.tasks, activeIndex, overIndex);

        // make API call to save change
        patchTaskOrder(activeId, overIndex+1);

        // return columns as they are except for the modified one
        return columns.map((col) => col.id === activeColumn.id
            ? { ...col, tasks: assignOrder(newTasks) }
            : col
        );

      // dragged task to another column
      } else {
        const movedTask = activeColumn.tasks.find((t) => t.id === activeId);

        // get dragged task's original column's tasks except for itself
        const newActiveTasks = activeColumn.tasks.filter((t) => t.id !== activeId);

        // get index of the task that got the dragged one dropped over
        let overIndex = overColumn.tasks.findIndex((t) => t.id === overId);
        // if dropped over the column (not a task), place at the end
        (overIndex === -1) && (overIndex = overColumn.tasks.length);

        const newOverTasks = [...overColumn.tasks];

        // target column's task list with changes
        newOverTasks.splice(overIndex, 0, { ...movedTask, columnId: overColumn.id });

        // TODO: api call to move task and update orders in both columns
        patchTaskColumnAndOrder(movedTask.id, overColumn.id, overIndex+1);

        return columns.map((col) => {
          if (col.id === activeColumn.id) {
            // update origin column's task list
            return { ...col, tasks: assignOrder(newActiveTasks) };
          }
          else if (col.id === overColumn.id) {
            // update target column's task list
            return { ...col, tasks: assignOrder(newOverTasks) };
          } else return col;  // for all other columns
        });
      }
    });
  };


  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <BoardPageButtons
        label="+▮"
        top="0"
        right="0"
        bgColor={"rgba(255,120,120,0.5)"}
        onClick={() => {console.log("OPEN FORM TO CREATE A COLUMN")}}
      />
      <BoardPageButtons
        label="+📝"
        top="0"
        right="4.5rem"
        bgColor={"rgba(120,255,120,0.5)"}
        onClick={() => {setCreatingTask(true)}}
      />
      {creatingTask && (
        <CreateTaskForm
          columnList={props.columns}
          onCloseForm={closeForm}
          defaultColumnId={creatingTaskColId}
        />
      )}
      <button
        onClick={onBack}
        className="bg-red-500 hover:bg-red-700 transition text-white p-2 px-3 rounded absolute top-0 left-0 m-4"
      >
        &lArr;
      </button>
      <h1 className="text-4xl text-white text-center w-[100%] py-[0.5rem]">
        {props.title}
      </h1>
      <main className="h-[88%] w-[98%] m-auto bg-[rgba(0,0,0,0.25)] rounded shadow-[0_0_16px_#000] relative flex flex-row gap-[0.5rem] overflow-x-scroll">
        {boardColumns.map((col) => {
          return (
            <Column
              key={col.id}
              col={col}
              onCreateTask={openCreateTaskForm}
              onOpenTaskCreation={setCreatingTaskColId}
              onDeleteTask={handleDeleteTask}
            />
          );
        })}
      </main>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

