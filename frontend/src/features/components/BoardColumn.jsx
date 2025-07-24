import { TaskCard } from "./TaskCard.jsx";

export function Column({ col }) {

  

  return (
    <div
      className="text-white h-[100%] w-[33.33%] rounded overflow-visible bg-[rgba(120,120,120,0.25)]"
    >
      <div className="text-center w-[100%] bg-[rgba(255,255,255,0.05)] py-[0.5rem] rounded text-xl shadow-sm">
        {col.title}
      </div>
      <div className="flex flex-col gap-[0.5rem] p-[0.5rem]">
        {col.tasks.map((task) => {
          return (
            <TaskCard
              key={task.id}
              task={task} 
            />
          );
        })}
      </div>
    </div>
  );
}
