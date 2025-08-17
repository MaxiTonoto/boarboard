import React, { useState, useContext } from "react";
import { deleteColumn } from "../../api/columnApi.js";
import { Bounce, toast } from "react-toastify";
import { AuthContext } from "../../AuthContext.jsx";

export function ColumnDropdown({ props, onCreateTask, onOpenTaskCreation, onDeleteColumn }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDeleteInput, setConfirmDeleteInput] = useState(""); 
  const { accessToken } = useContext(AuthContext);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    setIsDeleting(false);
  };

  const handleDeleteColumn = () => {
    const deleteCurrentColumn = async () => {
      try {
        const response = await deleteColumn(props.id, accessToken);
        if (response.status === 204) {
          toast.success(`Deleted column ${props.title}`, {
            position: "bottom-left",
            autoClose: 3000,
            closeOnClick: true,
            pauseOnHover: false,
            theme: "dark",
            transition: Bounce,
          });
          onDeleteColumn(props.id);
        }
      } catch (error) {
        toast.error(`Error deleting column: ${error.message}`, {
          position: "bottom-left",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: false,
          theme: "dark",
          transition: Bounce,
        });
      }

    };
    deleteCurrentColumn();
  };

  return (
    <>
      <button
        className="absolute top-[50%] right-[3%] translate-y-[-50%] bg-[rgba(0,0,0,0.25)] px-[0.5rem] rounded-lg z-100 cursor-pointer"
        onClick={toggleDropdown}
      >
        <p className="translate-y-[-15%]">⌄</p>
      </button>

      {isDropdownOpen && (
        <ul
          className={`absolute bg-[rgba(0,0,0,0.85)] shadow-xl p-[0.75rem] rounded-lg top-[82%] right-[2%] z-100
          ${isDeleting ? "w-7/8" : "w-[9rem]"}`}
        >
          <li className="hover:bg-[rgba(72,72,72,0.45)] transition px-[0.5rem] rounded cursor-pointer"
          title="Create a new task"
          onClick={ () => {
            onCreateTask();
            onOpenTaskCreation(props.id);
          }}>
            ➕ Task
          </li>
          <hr className="my-[0.5rem]"></hr>
          <li className="hover:bg-[rgba(72,72,72,0.45)] transition px-[0.5rem] rounded cursor-pointer"
          
          >
            {!isDeleting && 
              <span
                onClick={() => setIsDeleting(true)}
                title="Delete this column and its tasks"
              >
                🗑️ Delete
              </span>
            }
            {isDeleting &&
              <>
                <p>Type "CONFIRM" to delete this column and its contents <span className="bg-[rgb(128,0,0)]">FOREVER</span></p>
                <input
                  className="my-4 border-2 border-grey rounded p-2 text-center w-full"
                  type="text"
                  onChange={e => setConfirmDeleteInput(e.target.value)}
                />

                <div className="flex flex-wrap justify-evenly pb-2">
                  <button
                    className="rounded bg-green-600 p-2 hover:bg-green-500 transition shrink-0"
                    onClick={() => {
                      setConfirmDeleteInput("");
                      setIsDeleting(false);
                    }}
                  >
                    CANCEL
                  </button>
                  {confirmDeleteInput === "CONFIRM" &&
                    <>
                      <br/>
                      <button
                        className="rounded bg-red-600 p-2 hover:bg-red-500 transition shrink-0"
                        onClick={ handleDeleteColumn }
                      >
                        DELETE
                      </button>
                    </>
                  }
                </div>
                
              </>
            }
          </li>
        </ul>
      )}
    </>
  );
}
