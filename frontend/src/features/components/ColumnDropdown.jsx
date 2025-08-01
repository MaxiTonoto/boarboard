import React, { useState } from "react";

export function ColumnDropdown({ props, onCreateTask, onOpenTaskCreation }) {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <button
      className="absolute top-[50%] right-[3%] translate-y-[-50%] bg-[rgba(0,0,0,0.25)] px-[0.5rem] rounded-lg z-10 cursor-pointer"
      onClick={toggleDropdown}
    >
      <p className="translate-y-[-15%]">⌄</p>
      {isDropdownOpen && (
        <ul
          className="absolute bg-[rgba(0,0,0,0.85)] shadow-xl p-[0.75rem] rounded-lg top-[82%] right-[2%] w-[9rem]"
          onMouseLeave={toggleDropdown}
        >
          <li className="hover:bg-[rgba(100,100,100,0.5)] transition px-[0.5rem] rounded cursor-pointer"
          title="Create a new task"
          onClick={ () => {
            onCreateTask();
            onOpenTaskCreation(props.id);
          }}>
            ➕ Create
          </li>
          <hr className="my-[0.5rem]"></hr>
          <li className="hover:bg-[rgba(100,100,100,0.5)] transition px-[0.5rem] rounded cursor-pointer"
          title="Delete this column"
          >
            🗑️ Delete
          </li>
        </ul>
      )}
    </button>
  );
}
