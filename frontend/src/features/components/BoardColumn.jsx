import { TaskCard } from "./TaskCard.jsx";
import { ColumnDropdown } from "./ColumnDropdown.jsx";

import { useDroppable } from "@dnd-kit/core";

export function Column({ col, onCreateTask, onOpenTaskCreation }) {

  const sortedTasks = [...col.tasks].sort((a, b) => a.order - b.order);

  const { setNodeRef, isOver } = useDroppable({
    id: col.id,
  });

  return (
    <div className="text-white h-[100%] min-w-[33%] rounded bg-[rgba(120,120,120,0.25)] flex flex-col">
      <div className="text-center w-[100%] bg-[rgba(255,255,255,0.05)] py-[0.5rem] rounded text-xl shadow-xl relative z-10 sticky top-0">
        {col.title}
        <ColumnDropdown
          props={col}
          onCreateTask={onCreateTask}
          defaultColumnId={col.id}
          onOpenTaskCreation={onOpenTaskCreation}
        />
      </div>

      <ul
        className={`flex flex-col gap-[0.5rem] p-[0.5rem] flex-1 max-w-[100%] min-w-[100%] transition ${isOver ? "bg-[rgba(100,100,200,0.2)]" : ""}`}
        ref={setNodeRef}
      >
        {sortedTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
}
