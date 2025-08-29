import { Column } from "../components/BoardColumn.jsx";
import { TaskCard } from "../components/TaskCard.jsx";
import { CreateTaskForm } from "../components/CreateTaskForm.jsx";
import { CreateColumnForm } from "../components/CreateColumnForm.jsx";
import { BoardPageButtons } from "../components/BoardPageButtons.jsx";
import { BoardTitle } from "../components/BoardTitle.jsx";
import React, { useState, useContext } from "react";
import { Bounce, toast } from "react-toastify";
import {
  deleteTask,
  patchTaskOrder,
  patchTaskColumnAndOrder,
} from "../../api/taskApi.js";
import { patchColumnOrder } from "../../api/columnApi.js";
import { getBoard, deleteBoard } from "../../api/boardApi.js";
import { AuthContext } from "../../AuthContext.jsx";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { EditTaskForm } from "../components/EditTaskForm.jsx";

export function Board({ props, onBack }) {
  const { accessToken } = useContext(AuthContext);
  const [boardColumns, setBoardColumns] = useState(props.columns);
  const [activeTask, setActiveTask] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);
  const [creatingColumn, setCreatingColumn] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [creatingTaskColId, setCreatingTaskColId] = useState(
    () => props.columns?.[0]?.id ?? null
  );

  const downloadCurrentBoard = async () => {
    const currentBoard = await getBoard(props.id, accessToken);
    const blob = new Blob([JSON.stringify(currentBoard.data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = props.title.replace(".", "") + ".json";
    link.click();
  };

  const deleteCurrentBoard = async () => {
    try {
      const response = await deleteBoard(props.id, accessToken);
      if (response.status === 204) {
        toast.warning(`Deleted board ${props.title}`, toastOptions);
        onBack();
      } else {
        toast.warning(
          `Error deleting board ${props.title}: ${response.message}`,
          toastOptions
        );
      }
    } catch (error) {
      toast.warning(`Error deleting board ${props.title}`, toastOptions);
    }
  };

  const closeForm = () => {
    setCreatingTask(false);
    setCreatingColumn(false);
    setIsEditingTask(false);
    setEditingTask(null);
  };

  const handleCreateTask = (columnId, task) => {
    setBoardColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? // add new task only to modified column
            { ...col, tasks: [...col.tasks, task] }
          : col
      )
    );
  };
  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsEditingTask(true);
  };
  const handleEditedTask = (task, title, description) => {
    setBoardColumns((cols) => {
      cols.forEach((col) => {
        if (col.id === task.column) {
          col.tasks.forEach((colTask) => {
            if (colTask.id === task.id) {
              colTask.title = title;
              colTask.description = description;
            }
          });
        }
      });
      return cols;
    });
  };
  const handleDeleteTask = (taskId) => {
    deleteTask(taskId, accessToken);
    setBoardColumns((prev) => {
      const newColumns = prev.map((col) => {
        return {
          ...col,
          tasks: col.tasks.filter((task) => task.id !== taskId),
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

  const handleCreateColumn = (newColumn) => {
    setBoardColumns([...boardColumns, newColumn]);
    setCreatingTaskColId(newColumn.id);
  };
  const handleDeleteColumn = (deletedColId) => {
    setBoardColumns((prev) => prev.filter((col) => col.id !== deletedColId));
  };

  const handleDragStart = (e) => {
    const { active } = e;

    active.data.current?.type === "Task" &&
      setActiveTask(active.data.current.task);
    active.data.current?.type === "Column" &&
      setActiveColumn(active.data.current.column);
  };

  const handleDragEnd = (e) => {
    setActiveTask(null);
    setActiveColumn(null);
    const { active, over } = e;
    if (!over) return;

    const activeId = Number((active.id).replace(/\D/g, ""));
    const overId = Number((over.id).replace(/\D/g, ""));
    if (activeId === overId) return; // exit if was only a click

    const previousColumnsCopy = [...boardColumns];

    if (active.data.current?.type === "Task") {   // moved a task
      // dragged task's original column
      const activeColumn = boardColumns.find((col) =>
        col.tasks.some((task) => task.id === activeId)
      );

      // find the column where the task was dropped
      const overColumn = boardColumns.find(
        (col) => col.id === overId && over.data.current?.type === "Column"
        || // if it was dropped over a task, get it's column
        col.tasks.some((task) => task.id === overId && over.data.current?.type === "Task")
      ) 

      // guard clause in case a column wasn't found
      if (!activeColumn || !overColumn) return boardColumns;

      // helper function
      const assignOrder = (tasks) =>
        tasks.map((task, index) => ({ ...task, order: index + 1 }));

      // reorder tasks on same column
      if (activeColumn.id === overColumn.id) {
        // index of the dragged task before the drag
        const activeIndex = activeColumn.tasks.findIndex(
          (t) => t.id === activeId
        );

        // index of the task that got the dragged task dropped over
        let overIndex = overColumn.tasks.findIndex((t) => t.id === overId);
        overIndex === -1 && (overIndex = overColumn.tasks.length - 1);

        // apply reordering of tasks on a copy
        const newTasks = arrayMove(activeColumn.tasks, activeIndex, overIndex);

        // column set with modified one
        const newColumns = boardColumns.map((col) =>
          col.id === activeColumn.id
            ? { ...col, tasks: assignOrder(newTasks) }
            : col
        );

        // set new columns on the UI, before making api call
        setBoardColumns(newColumns);

        // make API call to save change
        patchTaskOrder(activeId, overIndex + 1, accessToken).catch((error) => {
          toast.error(`Error reordering task: ${error.message}`, toastOptions);
          setBoardColumns(previousColumnsCopy);
        });

      // dragged task to another column
      } else {
        const movedTask = activeColumn.tasks.find((t) => t.id === activeId);

        // get dragged task's original column's tasks except for itself
        const newActiveTasks = activeColumn.tasks.filter(
          (t) => t.id !== activeId
        );

        // get index of the task that got the dragged one dropped over
        let overIndex = overColumn.tasks.findIndex((t) => t.id === overId);
        // if dropped over the column (not a task), place at the end
        overIndex === -1 && (overIndex = overColumn.tasks.length);

        const newOverTasks = [...overColumn.tasks];

        // target column's task list with changes
        newOverTasks.splice(overIndex, 0, {
          ...movedTask,
          columnId: overColumn.id,
        });

        const newColumns = boardColumns.map((col) => {
          if (col.id === activeColumn.id) {
            // update origin column's task list
            return { ...col, tasks: assignOrder(newActiveTasks) };
          } else if (col.id === overColumn.id) {
            // update target column's task list
            return { ...col, tasks: assignOrder(newOverTasks) };
          } else return col; // for all other columns
        });

        setBoardColumns(newColumns);

        // api call to move task and update orders in both columns
        patchTaskColumnAndOrder(
          movedTask.id,
          overColumn.id,
          overIndex + 1,
          accessToken
        ).catch((error) => {   // rollback if there's an error
          toast.error(`Error moving task: ${error.message}`, toastOptions);
          setBoardColumns(previousColumnsCopy);
        });
      }

    } else if (active.data.current?.type === "Column") {   // moved a col
      const activeIndex = boardColumns.findIndex((col) => col.id === activeId);
      const overIndex = boardColumns.findIndex((col) => col.id === overId);

      if (activeIndex === -1 || overIndex === -1) return;

      let newColumns = arrayMove(boardColumns, activeIndex, overIndex);
      newColumns = newColumns.map((col, index) => ({
        ...col,
        order: index + 1,
      }));

      setBoardColumns(newColumns);

      patchColumnOrder(activeId, overIndex, accessToken).catch((error) => {
        toast.error(`Error reordering column: ${error.message}`, toastOptions);
        setBoardColumns(previousColumnsCopy);
      });
    }
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <BoardPageButtons
        title="Create a new column"
        label="+▮"
        top="0"
        right="5rem"
        bgColor={"rgba(255,120,120,0.5)"}
        onClick={() => {
          setCreatingColumn(true);
        }}
      />
      <BoardPageButtons
        title="Create a new task"
        label="+📝"
        top="0"
        right="0"
        bgColor={"rgba(120,255,120,0.5)"}
        onClick={() => {
          setCreatingTask(true);
        }}
      />

      {creatingTask && (
        <CreateTaskForm
          columnList={boardColumns}
          onCloseForm={closeForm}
          defaultColumnId={creatingTaskColId}
          onCreatedNewTask={handleCreateTask}
        />
      )}
      {isEditingTask && editingTask && (
        <EditTaskForm
          task={editingTask}
          onCloseForm={closeForm}
          onTaskEdited={handleEditedTask}
        />
      )}
      {creatingColumn && (
        <CreateColumnForm
          board={props}
          onCloseForm={closeForm}
          onCreatedNewColumn={handleCreateColumn}
        />
      )}
      <button
        onClick={onBack}
        className="bg-red-500 hover:bg-red-700 transition text-white p-2 px-3 rounded absolute top-0 left-0 m-4"
      >
        &lArr;
      </button>
      <BoardTitle
        props={props}
        onDowloadBoard={downloadCurrentBoard}
        onDeleteBoard={deleteCurrentBoard}
      />
      <main className="h-[88%] w-[98%] m-auto bg-[rgba(0,0,0,0.25)] rounded shadow-[0_0_16px_#000] relative flex flex-row gap-[0.5rem] overflow-x-auto">
        {boardColumns && boardColumns.length > 0 ? (
          <SortableContext
            items={boardColumns.map((col) => `col-${col.id}`)}
            strategy={horizontalListSortingStrategy}
          >
            {boardColumns
              .sort((a, b) => a.order - b.order)
              .map((col) => {
                return (
                  <Column
                    key={col.id}
                    col={col}
                    onCreateTask={() => setCreatingTask(true)}
                    onOpenTaskCreation={setCreatingTaskColId}
                    onDeleteTask={handleDeleteTask}
                    onDeleteColumn={handleDeleteColumn}
                    onEditTask={handleEditTask}
                  />
                );
              })}
          </SortableContext>
        ) : (
          <p className="text-white text-2xl width-full absolute top-1/2 left-1/2 -translate-1/2 text-center">
            Nothing here yet.
            <br />
            <br />
            Use the&nbsp;
            <span
              title="Create a new column"
              className="bg-[rgba(255,120,120,0.5)] p-2 rounded cursor-pointer hover:brightness-95 hover:shadow-sm select-none"
              onClick={() => {
                setCreatingColumn(true);
              }}
            >
              +▮
            </span>
            &nbsp;button to create your first column!
            <br />
            <br />
            Then use the&nbsp;
            <span
              title="Create a new task (but not with this button, there's no columns yet. Use the one on the top-right corner instead)"
              className="bg-[rgba(120,255,120,0.5)] p-2 rounded cursor-pointer hover:brightness-95 hover:shadow-sm select-none"
            >
              +📝
            </span>
            &nbsp;button to add tasks!
          </p>
        )}
      </main>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
        {activeColumn ? <Column col={activeColumn} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

const toastOptions = {
  position: "bottom-left",
  autoClose: 3000,
  closeOnClick: true,
  pauseOnHover: false,
  theme: "dark",
  transition: Bounce,
};
