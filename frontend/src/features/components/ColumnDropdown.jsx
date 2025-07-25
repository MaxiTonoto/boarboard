import React, { useState } from "react";

export function ColumnDropdown({ props, onCreateTask }) {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <button
      className="absolute top-[50%] right-[3%] translate-y-[-50%] bg-[rgba(0,0,0,0.25)] px-[0.5rem] rounded-lg"
      onClick={toggleDropdown}
    >
      <p className="translate-y-[-15%]">⌄</p>
      {isDropdownOpen && (
        <ul
          className="absolute bg-[rgba(0,0,0,0.75)] shadow-xl p-[0.75rem] rounded-lg top-[82%] right-[2%] w-[9rem]"
          onMouseLeave={toggleDropdown}
        >
          <li className="hover:bg-[rgba(100,100,100,0.5)] transition px-[0.5rem] rounded cursor-pointer"
          onClick={ onCreateTask }>
            ➕ Create
          </li>
          <hr className="my-[0.5rem]"></hr>
          <li className="hover:bg-[rgba(100,100,100,0.5)] transition px-[0.5rem] rounded cursor-pointer">
            🗑️ Delete
          </li>
        </ul>
      )}
    </button>
  );
}
