import VanillaTilt from "vanilla-tilt";
import React, { useRef, useEffect, useState } from "react";
import { deleteTask } from "../../api/taskApi.js";
import { Bounce, toast } from "react-toastify";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";



export function TaskCard({ task }) {
  const currentCard = useRef(null);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      fromColumn: task.column,
    },
  })

  const styles = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: Boolean(transform) ? 100 : 1,
  }
  const [deletingCardStep, setDeletingCardStep] = useState(0);
  /*
    deletingCardStep = 0   =>   delete button
    deletingCardStep = 1   =>   ask for confirmation
    deletingCardStep = 2   =>   delete forever :/
  */

  useEffect(() => {
    if (deletingCardStep === 2) {
      const deleteCurrentTask = async () => {
        await deleteTask(task.id);
        toast.error(`Deleted task ${task.title}`, {
          position: "bottom-left",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: false,
          theme: "dark",
          transition: Bounce,
        });
      };
      deleteCurrentTask();
    }
  }, [deletingCardStep]);

  const assignRefs = (node) => {
    currentCard.current = node;
    setNodeRef(node);
  };

  return (
    <>
      {deletingCardStep !== 2 && (
        <article  
          ref={assignRefs}
          style={styles}
          className="bg-[rgba(112,112,112,0.75)] rounded py-[0.5rem] border-2 border-[rgba(14,14,50,0.75)] relative"
        >
          <h2 
            className="text-lg px-2 pb-1 z-1 w-full text-left"           
          >
            {task.title}
          </h2>
          <button className="absolute top-0 right-0 m-1 bg-[rgba(44,44,44,0.85)] hover:bg-[rgba(44,44,44,0.95)] transition rounded-sm p-[0.2rem] cursor-pointer select-none z-10">
            {deletingCardStep === 0 && (
              <span
                onClick={() => {
                  setDeletingCardStep(deletingCardStep + 1);
                }}
              >
                🗑️
              </span>
            )}
            {deletingCardStep === 1 && (
              <>
                <span
                  className="bg-[rgba(0,0,0,0.25)] hover:bg-[rgba(0,0,0,0.35)] transition"
                  onClick={() => {
                    setDeletingCardStep(deletingCardStep + 1);
                  }}
                >
                  ✔️
                </span>
                <span> Sure? </span>
                <span
                  className="bg-[rgba(0,0,0,0.25)] hover:bg-[rgba(0,0,0,0.35)] transition rounded"
                  onClick={() => {
                    setDeletingCardStep(deletingCardStep - 1);
                  }}
                >
                  ❌
                </span>
              </>
            )}
          </button>
          <hr className="border-t-2 border-[rgba(14,14,50,0.5)] w-[98%] m-auto"></hr>
          <p className="px-2 pt-1">{task.description}</p>
          <button
            className="absolute bottom-0 right-0 m-1 bg-[rgba(44,44,44,0.85)] hover:bg-[rgba(44,44,44,0.95)] transition rounded-sm p-[0.2rem] cursor-move select-none z-10"
            {...listeners}
            {...attributes}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 380 380">
              <path
                fill="white"
                fillRule="evenodd"
                d="m166.407 66.601-33.396 33.397 11.91 11.915 11.91 11.915 13.186-13.181 13.186-13.182v69.332h33.594V97.465l13.186 13.182 13.186 13.181 11.91-11.915 11.91-11.915-33.396-33.397C215.225 48.232 200.108 33.203 200 33.203c-.108 0-15.225 15.029-33.593 33.398M66.406 166.602l-33.397 33.399 33.494 33.494 33.495 33.495 11.915-11.911 11.915-11.91-13.181-13.186-13.182-13.186h69.332v-33.594H97.465l13.182-13.186 13.181-13.186-11.819-11.814c-6.5-6.498-11.906-11.814-12.012-11.814-.107 0-15.223 15.03-33.591 33.399m221.582-21.584-11.815 11.815 13.181 13.185 13.181 13.185h-69.332v33.594h69.332l-13.182 13.186-13.181 13.186 11.915 11.91 11.915 11.911 33.495-33.495 33.494-33.494-33.397-33.399c-18.368-18.369-33.486-33.399-33.594-33.399-.108 0-5.514 5.317-12.012 11.815M183.203 267.869v34.666l-13.186-13.182-13.186-13.181-11.91 11.915-11.911 11.915 33.495 33.495L200 366.992l33.495-33.495 33.495-33.495-11.911-11.915-11.91-11.915-13.186 13.181-13.186 13.182v-69.332h-33.594v34.666"
              />
            </svg>
          </button>
        </article>
      )}
    </>
  );
}



let addVanillaTilt = `
  useEffect(() => {
    if (currentCard.current) {
      VanillaTilt.init(currentCard.current, {
        max: 10,
        speed: 150,
        glare: false,
        reverse: true,
      });
    }
    return () => {
      currentCard.current?.vanillaTilt &&
        currentCard.current.vanillaTilt.destroy();
    };
  }, []);
`;