import React, { useEffect, useState, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoveButton } from "./MoveButton.jsx";
import { TaskCardOptions } from "./TaskCardOptions.jsx";

export function TaskCard({ task, onEditTask, onDeleteTask }) {

  const [poppedOut, setPoppedOut] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openDescription, setOpenDescription] = useState(false);

  const descriptionContainerRef = useRef(null);
  const descriptionRef = useRef(null);
  const [descriptionIsCutOff, setDescriptionIsCutOff] = useState(false);

  const handleToggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  useEffect(() => {
    if (descriptionContainerRef.current && descriptionRef.current) {
      setDescriptionIsCutOff(
        descriptionContainerRef.current.clientHeight <
        descriptionRef.current.scrollHeight
      );
    }
    const delay = setTimeout(() => setPoppedOut(true), 10);
    return () => clearTimeout(delay);
  }, [task]);

  const handleDelete = () => {
    onDeleteTask(task.id);
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `task-${task.id}`,
    data: {
      type: "Task",
      task,
    },
    handle: true,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <article  
      className={`bg-[rgba(112,112,112,0.75)] rounded py-[0.5rem] border-2 border-[rgba(14,14,50,0.75)] relative z-0  transition-transform duration-100 motion-reduce:transition-none
      ${poppedOut ? "scale-100" : "scale-105"}
      ${dropdownOpen ? "z-10" : "z-0"}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <h2 
        className="text-lg px-2 pb-1 z-1 max-w-8/9 text-left"           
      >
        {task.title}
      </h2>
      <TaskCardOptions
        props={task}
        onEditTask={onEditTask}
        onDeleteTask={handleDelete}
        dropdownOpen={dropdownOpen}
        onToggleDropdown={handleToggleDropdown}
      />
      <hr className="border-t-2 border-[rgba(14,14,50,0.5)] w-[98%] m-auto"></hr>
      <div
        ref={descriptionContainerRef}
        className={`overflow-hidden relative transition-max-h duration-300 motion-reduce:transition-none
          ${openDescription ? "max-h-[100%]" : "max-h-[5rem] cursor-pointer"}
        `}
      >
        <p ref={descriptionRef} className="wrap-break-word w-19/20 mx-1 px-2 pt-1 break-normal">
          {task.description}
        </p>
      </div>
      <div className="w-3/5 mx-auto">
        { descriptionIsCutOff &&
          <button
            className="text-center w-full bg-[rgba(12,12,12,0.45)] rounded hover:bg-[rgba(12,12,12,0.5)] transition text-white py-[0.1rem] my-[0.1rem]"
            onClick={ () => setOpenDescription(prev => !prev) }
          >
            { openDescription ? "Show less ↑" : "Show full ↓" } 
          </button> }
      </div>
      <MoveButton
        position="bottom-0 right-0 mb-1 mr-1"
        title="Hold & drag to move task"
        listeners={{...listeners}}
      />
    </article>
  );
}