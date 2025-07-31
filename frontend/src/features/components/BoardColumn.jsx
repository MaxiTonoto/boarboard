import { TaskCard } from "./TaskCard.jsx";
import { ColumnDropdown } from "./ColumnDropdown.jsx";
import React, { useMemo } from "react";

import { useDroppable } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";

export function Column({ col, onCreateTask, onOpenTaskCreation, onDeleteTask }) {

  const { setNodeRef, isOver } = useDroppable({
    id: col.id,
    data: {
      type: "Column",
    },
  });

  const taskIds = useMemo(() => 
    col.tasks.map((task) => task.id), [col.tasks]
  );

  return (
    <div
      className="text-white h-[100%] min-w-[33%] rounded bg-[rgba(120,120,120,0.25)] flex flex-col"
      ref={setNodeRef}
    >
      <div className="text-center w-[100%] bg-[rgba(255,255,255,0.05)] py-[0.5rem] rounded text-xl shadow-xl relative z-10 sticky top-0">
        {col.title}
        <ColumnDropdown
          props={col}
          onCreateTask={onCreateTask}
          defaultColumnId={col.id}
          onOpenTaskCreation={onOpenTaskCreation}
        />
      </div>

      
      <div
        className={`flex flex-col gap-[0.5rem] p-[0.5rem] flex-1 max-w-[100%] min-w-[100%] transition overflow-y-auto ${isOver ? "bg-blue-300/10" : ""}`}
      >
        <SortableContext
          items={taskIds} strategy={verticalListSortingStrategy}
        >
          {col.tasks.sort((a, b) => a.order - b.order).map((task) => (
            <TaskCard
              key={task.id}
              task={task} 
              onDeleteTask={onDeleteTask}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
