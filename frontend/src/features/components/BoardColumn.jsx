import { ColumnDropdown } from "./ColumnDropdown.jsx";
import { moveSvg } from "./TaskCard.jsx";
import { useSortable } from "@dnd-kit/sortable";
import { ColumnBody } from "./ColumnBody.jsx";
import { CSS } from "@dnd-kit/utilities";


export function Column({ col, onCreateTask, onOpenTaskCreation, onDeleteTask, onDeleteColumn }) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: col.id,
    data: {
      type: "Column",
      col,
    },
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };




  return (
    <div
      className="text-white h-[100%] min-w-[320px] w-1/3 rounded bg-[rgba(120,120,120,0.25)] flex flex-col relative"
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div 
        className="text-center w-[100%] bg-[rgba(255,255,255,0.05)] py-[0.5rem] rounded text-xl shadow-xl relative z-10 sticky top-0"
      >
        <button
          className="absolute top-1/2 -translate-y-2/3 left-1 m-1 bg-[rgba(44,44,44,0.85)] hover:bg-[rgba(44,44,44,0.95)] transition rounded-sm p-[0.2rem] cursor-move select-none z-90"
          title="Hold & drag to move task"
          {...listeners}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 380 380">
            <path
              fill="white"
              fillRule="evenodd"
              d={moveSvg}
            />
          </svg>
        </button>
        {col.title}
        <ColumnDropdown
          props={col}
          onCreateTask={onCreateTask}
          defaultColumnId={col.id}
          onOpenTaskCreation={onOpenTaskCreation}
          onDeleteColumn={onDeleteColumn}
        />
      </div>

      <ColumnBody
        col={col}
        onDeleteTask={onDeleteTask}
      />
    
    </div>
  );
}
