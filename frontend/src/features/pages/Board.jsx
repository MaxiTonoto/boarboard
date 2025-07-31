import { Column } from "../components/BoardColumn.jsx";
import { TaskCard } from "../components/TaskCard.jsx";
import { CreateTaskForm } from "../components/CreateTaskForm.jsx";
import { OpenConfigButton } from "../components/OpenConfigButton.jsx";
import React, { useState } from "react";
import { 
  patchTaskColumn, 
  patchTaskOrder,
  patchTaskColumnAndOrder,
} from "../../api/taskApi.js";

import { DndContext, closestCorners, DragOverlay } from "@dnd-kit/core";
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

  const findColumn = (id) => boardColumns.find((col) => col.id === id);

  const handleDragStart = (e) => {
    const { active } = e;
    if (active.data.current?.type === "Task") {
      setActiveTask(active.data.current.task);
    }
  };

  const handleDragEnd = (e) => {
    setActiveTask(null);
    const { active, over } = e;
    if (!active || !over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;
    const activeColumn = boardColumns.find((col) =>
      col.tasks.some((task) => task.id === activeId)
    );

    // find the column where the task was dropped
    let overColumn = boardColumns.find((col) => col.id === overId);
    if (!overColumn) {
      // if it was dropped over a task, look for its column
      overColumn = boardColumns.find((col) =>
        col.tasks.some((task) => task.id === overId)
      );
    }

    if (!activeColumn || !overColumn) return;

    // reordering tasks in same column
    if (activeColumn.id === overColumn.id) {
      setBoardColumns((prev) => {
        const columnIndex = prev.findIndex((col) => col.id === activeColumn.id);
        const taskIndex = activeColumn.tasks.findIndex(
          (t) => t.id === activeId
        );
        const overTaskIndex = overColumn.tasks.findIndex(
          (t) => t.id === overId
        );

        const newTasks = arrayMove(
          activeColumn.tasks,
          taskIndex,
          overTaskIndex
        );

        const newColumns = [...prev];
        newColumns[columnIndex] = {
          ...newColumns[columnIndex],
          tasks: newTasks.map((task, index) => ({ ...task, order: index })),
        };

        // MAKE API CALL TO UPDATE TASK ORDER IN SAME COLUMN

        return newColumns;
      });
    } else {
      // move to different column
      setBoardColumns((prev) => {
        const activeTasks = [...activeColumn.tasks];
        const overTasks = [...overColumn.tasks];

        const movedTaskIndex = activeTasks.findIndex((t) => t.id === activeId);
        const [movedTask] = activeTasks.splice(movedTaskIndex, 1);

        // find what task of the new column the dragged one was dropped into
        let overIndex = overTasks.findIndex((t) => t.id === overId);
        if (overIndex === -1) {
          // if it wasn't dropped into a task, place at end of new column
          overIndex = overTasks.length;
        }
        overTasks.splice(overIndex, 0, {
          ...movedTask,
          columnId: overColumn.id,
        });

        // MAKE API CALL TO MOVE TASK TO DIFFERENT COLUMN AND UPDATE ORDER

        // make new array with updated columns
        return prev.map((col) => {
          if (col.id === activeColumn.id) {
            return {   // column that had the task that was dragged out
              ...col,
              tasks: activeTasks.map((task, index) => ({
                ...task,
                order: index,
              })),
            };
          } else if (col.id === overColumn.id) {
            return {   // column that welcomes incoming task :)
              ...col,
              tasks: overTasks.map((task, index) => ({
                ...task,
                order: index,
              })),
            };
          } else {
            // unaltered columns stay the same ewqjqjwqe
            return col;
          }
        });
      });
    }
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      <OpenConfigButton />
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
