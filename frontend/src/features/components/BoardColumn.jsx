import { ColumnDropdown } from "./ColumnDropdown.jsx";
import { useSortable } from "@dnd-kit/sortable";
import { ColumnBody } from "./ColumnBody.jsx";
import { CSS } from "@dnd-kit/utilities";
import { MoveButton } from "./MoveButton.jsx";
import { ColumnTitle } from "./ColumnTitle.jsx";

export function Column({ col, onCreateTask, onOpenTaskCreation, onDeleteTask, onDeleteColumn, onEditTask }) {

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
        className="text-center w-[100%] bg-[rgba(255,255,255,0.05)] py-[0.5rem] rounded text-xl shadow-xl relative z-900 sticky top-0"
      >
        <MoveButton
          position="top-1/2 -translate-y-2/3 left-1 m-1"
          title="Hold and drag to move this column"
          listeners={{...listeners}}
        />
        <ColumnTitle
          title={col.title}
          colId={col.id}
        />
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
        onEditTask={onEditTask}
      />
    
    </div>
  );
}
