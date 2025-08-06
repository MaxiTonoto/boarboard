import React, { useEffect, useState, useContext } from "react";
import { getBoards, getUserBoards } from "../../api/boardApi.js";
import { BoardThumbnail } from "../components/BoardThumbnail.jsx";
import { BoardPageButtons } from "../components/BoardPageButtons.jsx";
import { CreateBoardForm } from "../components/CreateBoardForm.jsx";
import { AuthContext, CurrentUserContext } from "../../AuthContext.jsx";

export function Menu({ onOpenBoard, onGoToAuth }) {
  const { accessToken } = useContext(AuthContext);
  const { currentUser } = useContext(CurrentUserContext);
  const [publicBoards, setPublicBoards] = useState([]);
  const [userBoards, setUserBoards] = useState([]);
  const [creatingBoard, setCreatingBoard] = useState(false); 

  useEffect(() => {
    const fetchBoards = async () => {
      let boards = await getBoards(accessToken);
      setPublicBoards(boards.data);
    }; fetchBoards();
  }, []);

  useEffect(() => {
    if (!accessToken || !currentUser) return;
    
    const fetchUserBoards = async () => {
      let boards = await getUserBoards(accessToken);
      setUserBoards(boards.data);
    }; fetchUserBoards();
  }, []);

  return (
    <>
      { creatingBoard && 
        <CreateBoardForm
          onCloseForm={() => setCreatingBoard(false)}
        />
      }
      <main className="w-[100%] h-[100%]">
        <BoardPageButtons
          title="Register or log in"
          label={currentUser ? currentUser : "👤" }
          top="0"
          left="0"
          bgColor="rgb(45, 130, 45)"
          onClick={() => onGoToAuth()}
        />
        <h1 className="text-center text-4xl py-[0.5rem] my-[0.25rem] text-white w-[100%]">
          Main Menu
        </h1>
        <section className="w-[98%] h-[88%] m-auto p-[0.5rem] bg-[rgba(0,0,0,0.25)] rounded shadow-[0_0_8px_#000]">
          <BoardPageButtons
            title="Create a new board"
            label="New board"
            top="0"
            right="0"
            bgColor="rgb(102,102,240)"
            onClick={() => setCreatingBoard(true)}
          />
          <h2 className="text-left text-2xl py-[0.5rem] text-white w-[100%] pl-[1rem]">
            Your boards
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
              <p className="text-left text-white text-lg">
                - Nothing here yet :p
              </p>
            ) }

          </section>
          


          <h2 className="text-left text-2xl py-[0.5rem] text-white w-[100%] pl-[1rem] pt-[3rem]">
            Example boards
          </h2>
          <section className="h-[20%] w-[100%] bg-[rgba(255,255,255,0.1)] flex flex-row p-[0.5rem] gap-[0.52rem] rounded">
            { publicBoards.length > 0 ? (
              publicBoards.map((board, index) => {

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
    </>
  );
}


