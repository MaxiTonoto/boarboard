import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthContext.jsx";
import { Bounce, toast } from "react-toastify";

export function TaskCardOptions({ props, onEditTask, onDeleteTask }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div>
      <button
        className="absolute top-0 right-0 bg-[rgba(0,0,0,0.5)] px-[0.5rem] py-[0.12rem] rounded-lg z-50 cursor-pointer m-1"
        onClick={ () => setDropdownOpen(prev => !prev) }
      >
        <p className="translate-y-[-12%]">⌄</p>
      </button>
      { dropdownOpen && 
        <ul
          className="absolute bg-[rgba(0,0,0,0.85)] shadow-xl p-[0.75rem] rounded-lg top-[41%] right-0 mr-1 z-80 min-w-1/2 min-h-1/2 text-lg text-center"
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
      }
    </div>
  );
}

