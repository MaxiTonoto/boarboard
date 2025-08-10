import react, { useState } from 'react';


export const BoardTitleDropdown = ({ props, onMouseLeave, onDowloadBoard, onDeleteBoard }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmDeleteInput, setConfirmDeleteInput] = useState(""); 

  return (
      <div
        onMouseLeave={onMouseLeave}
        className="absolute top-[100%] left-1/2 -translate-x-1/2 min-w-md w-full min-h-[8rem] z-100 rounded shadow-xl min-w-fit min-h-fit flex flex-row justify-center align-center p-6 gap-6 bg-gray-700 text-white"
      >
        {isConfirming ? 
        <div>
        <p>Type "CONFIRM" to delete this board and its contents <span className="bg-[rgb(128,0,0)]">FOREVER</span></p>
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
                onClick={ onDeleteBoard }
              >
                DELETE
              </button>
            </>
          }
        </div>
        
      </div>
        : 
        <button 
          className="rounded text-white bg-red-600 p-2 hover:bg-red-500 transition"
          onClick={ () => setIsConfirming(true) }
        >
          DELETE BOARD
        </button>
        }

        <button 
          className="rounded text-white bg-cyan-600 p-2 hover:bg-cyan-500 transition"
          onClick={onDowloadBoard}
        >
          EXPORT AS JSON
        </button>
      </div>
  );
}