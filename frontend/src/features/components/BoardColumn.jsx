import { TaskCard } from "./TaskCard.jsx";
import { ColumnDropdown } from "./ColumnDropdown.jsx";


export function Column({ col, onCreateTask, onOpenTaskCreation }) {

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

      
      <div
        className="flex flex-col gap-[0.5rem] p-[0.5rem] flex-1 max-w-[100%] min-w-[100%]"
      >
        {col.tasks
          .sort((a, b) => a.order - b.order)
          .map((task) => (
            <TaskCard key={task.id} task={task} />
          )
        )}
      </div>
    </div>
  );
}
