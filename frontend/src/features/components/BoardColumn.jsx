import { TaskCard } from "./TaskCard.jsx";
import { ColumnDropdown } from "./ColumnDropdown.jsx";

export function Column({ col, onCreateTask }) {


  return (
    <div className="text-white h-[100%] min-w-[33%] rounded overflow-hidden bg-[rgba(120,120,120,0.25)]">
      <div className="text-center w-[100%] bg-[rgba(255,255,255,0.05)] py-[0.5rem] rounded text-xl shadow-sm relative">
        {col.title}
        <ColumnDropdown
          props={col}
          onCreateTask={ onCreateTask }
        />
      </div>
      <div className="flex flex-col gap-[0.5rem] p-[0.5rem]">
        {col.tasks.map((task) => {
          return <TaskCard key={task.id} task={task} />;
        })}
      </div>
    </div>
  );
}
