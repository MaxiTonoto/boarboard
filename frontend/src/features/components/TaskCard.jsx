import VanillaTilt from "vanilla-tilt";
import React, { useRef, useEffect, useState } from "react";
import { deleteTask } from "../../api/taskApi.js";
import { Bounce, toast } from "react-toastify";

export function TaskCard({ task }) {
  const currentCard = useRef(null);
  const [deletingCardStep, setDeletingCardStep] = useState(0);
  /*
    deletingCardStep = 0   =>   delete button
    deletingCardStep = 1   =>   ask for confirmation
    deletingCardStep = 2   =>   delete forever :/
  */

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

  return (
    <>
      {deletingCardStep !== 2 && (
        <article
          ref={currentCard}
          className="bg-[rgba(137,137,137,0.5)] rounded py-[0.5rem] border-2 border-[rgba(14,14,50,0.75)] relative"
        >
          <h2 className="text-lg px-2 pb-1 z-1">{task.title}</h2>
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
        </article>
      )}
    </>
  );
}
