import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard.jsx";
import React, { useMemo } from "react";
import {
  SortableContext,
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";

export function ColumnBody ({ col, onEditTask, onDeleteTask }) {
    const taskIds = useMemo(() => 
        col.tasks.map((task) => task.id), [col.tasks]
      );
    const { setNodeRef, isOver } = useDroppable({
        id: col.id,
        data: {
          type: "Column",
        },
      });

    return (
        <div
          className={`flex flex-col gap-[0.5rem] p-[0.5rem] flex-1 max-w-[100%] min-w-[100%] transition overflow-y-auto ${isOver ? "bg-blue-300/10" : ""}`}
          ref={setNodeRef}
        >
          <SortableContext
            items={taskIds} strategy={verticalListSortingStrategy}
          >
          {col.tasks.sort((a, b) => a.order - b.order).map((task) => (
            <TaskCard
              key={task.id}
              task={task} 
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
            />
          ))}
        </SortableContext>
      </div>
    );

}