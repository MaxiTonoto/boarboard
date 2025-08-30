import React, { useState } from "react";

export function TaskCardOptions({ props, onEditTask, onDeleteTask, dropdownOpen, onToggleDropdown }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <>
      <button
        className="absolute top-0 right-0 bg-[rgba(0,0,0,0.5)] px-[0.5rem] py-[0.12rem] rounded-lg z-1 cursor-pointer m-1"
        onClick={onToggleDropdown}
      >
        <p 
          className={`translate-y-[-12%] transition-transform duration-50 motion-reduce:transition-none ${ dropdownOpen ? "rotate-90" : "" }`}
        >
          ⌄
        </p>
      </button>
      <ul
        className={`absolute top-1 right-6 z-[999] bg-[rgba(0,0,0,0.85)] shadow-xl p-[0.75rem] rounded-lg mr-1 min-w-1/2 min-h-[fit-content] text-lg text-center transition-transform duration-100 motion-reduce:transition-none origin-top-right
        ${dropdownOpen ? "scale-[100%]" : "scale-0 pointer-events-none"}
        `}
      >
        <li 
          className="cursor-pointer hover:bg-[rgba(72,72,72,0.45)] transition rounded"
          onClick={ () => onEditTask(props) }
        >
          ✏️ Edit
        </li>
        <hr className="my-[0.5rem]"/>
        <li 
          className="cursor-pointer hover:bg-[rgba(72,72,72,0.45)] transition rounded"
        >
          <button
            className="cursor-pointer"
          >
            {!confirmingDelete && (
              <span
                title="Delete task?"
                onClick={() => setConfirmingDelete(true)}
              >
                🗑️ Delete
              </span>
            )}
            {confirmingDelete && (
              <>
                <span
                  className="bg-[rgba(0,0,0,0.25)] hover:bg-[rgba(0,0,0,0.35)] transition"
                  onClick={ onDeleteTask }
                >
                  ✔️
                </span>
                <span> Sure? </span>
                <span
                  className="bg-[rgba(0,0,0,0.25)] hover:bg-[rgba(0,0,0,0.35)] transition rounded"
                  onClick={() => setConfirmingDelete(false)}
                >
                  ❌
                </span>
              </>
            )}
          </button>
        </li>
      </ul>
    </>
  );
}

