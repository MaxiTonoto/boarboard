import React, { useEffect, useState } from "react";
import { getBoards } from "../../api/boardApi.js";
import { BoardThumbnail } from "../components/BoardThumbnail.jsx";
import { BoardPageButtons } from "../components/BoardPageButtons.jsx";

export function Menu({ onOpenBoard }) {
  const [userBoards, setUserBoards] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      let boards = await getBoards();
      setUserBoards(boards.data);
    }; fetchBoards();
  }, []);

  return (
    <main className="w-[100%] h-[100%]">
      <BoardPageButtons
        title="Create a new board"
        label="New board"
        top="0"
        right="0"
        bgColor="rgb(102,102,240)"
      />
      <h1 className="text-center text-4xl py-[0.5rem] my-[0.25rem] text-white w-[100%]">
        Main Menu
      </h1>
      <section className="w-[98%] h-[88%] m-auto p-[0.5rem] bg-[rgba(0,0,0,0.25)] rounded shadow-[0_0_8px_#000]">
        <h2 className="text-left text-2xl py-[0.5rem] text-white w-[100%] pl-[1rem]">
          Your boards
        </h2>
        <section>
          <p className="text-left text-white text-lg">
            - Nothing here yet :p
          </p>
        </section>
        


        <h2 className="text-left text-2xl py-[0.5rem] text-white w-[100%] pl-[1rem] pt-[3rem]">
          Example boards
        </h2>
        <section className="h-[20%] w-[100%] bg-[rgba(255,255,255,0.1)] flex flex-row p-[0.5rem] gap-[0.52rem] rounded">
          { userBoards.length > 0 ? (
            userBoards.map((board, index) => {

              return (
                <button
                  key={index}
                  className="w-[10rem] h-[100%] bg-[rgba(12,12,18,0.25)] rounded overflow-hidden p-[0.5rem] relative cursor-pointer"
                  onClick={ () => {onOpenBoard(board)} }
                >
                  <BoardThumbnail
                    props={board}
                  />
                </button>
              );
            })
          ) : (
            <>
              <a className="w-[10rem] h-[100%] bg-[rgba(12,12,18,0.25)] rounded"></a>
              <a className="w-[10rem] h-[100%] bg-[rgba(12,12,18,0.25)] rounded"></a>
              <a className="w-[10rem] h-[100%] bg-[rgba(12,12,18,0.25)] rounded"></a>
              <a className="w-[10rem] h-[100%] bg-[rgba(12,12,18,0.25)] rounded"></a>
            </>
          ) }
        </section>
      </section>
    </main>
  );
}
