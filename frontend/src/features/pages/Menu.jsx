import React, { useEffect, useState, useContext } from "react";
import { getBoards, getUserBoards } from "../../api/boardApi.js";
import { BoardThumbnail } from "../components/BoardThumbnail.jsx";
import { BoardPageButtons } from "../components/BoardPageButtons.jsx";
import { CreateBoardForm } from "../components/CreateBoardForm.jsx";
import { AuthContext, CurrentUserContext } from "../../AuthContext.jsx";
import { refreshUser } from "../../api/authApi.js";
import boarImage from "../../assets/boar.webp";

export function Menu({ onOpenBoard, onGoToAuth }) {
  const { accessToken, setAccessToken } = useContext(AuthContext);
  const { currentUser } = useContext(CurrentUserContext);
  const [publicBoards, setPublicBoards] = useState([]);
  const [userBoards, setUserBoards] = useState([]);
  const [creatingBoard, setCreatingBoard] = useState(false); 

  const fetchBoards = async () => {
    let boards = await getBoards(accessToken);
    setPublicBoards(boards.data);
  }; 
  useEffect(() => {
    fetchBoards()
  }, []);

  const fetchUserBoards = async (retry = true) => {
    try {
      const boards = await getUserBoards(accessToken);
      setUserBoards(boards.data);
    } catch (error) {
      if (error?.status === 403 && retry) {
        const newToken = await refreshUser();
        setAccessToken(newToken?.data?.access_token);
        return fetchUserBoards(false);
      } 
    }
  };
  useEffect(() => {
    if (!accessToken || !currentUser) return;
    fetchUserBoards();
  }, [accessToken, currentUser, setAccessToken]);


  return (
    <>
      { creatingBoard && 
        <CreateBoardForm
          onCloseForm={() => setCreatingBoard(false)}
          onCreateBoard={ () => fetchUserBoards() }
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
        <section className="w-[98%] h-[88%] m-auto p-[0.5rem] bg-[rgba(0,0,0,0.25)] rounded shadow-[0_0_8px_#000] relative">
          { (currentUser && accessToken) &&
            <BoardPageButtons
              title="Create a new board"
              label="New board"
              top="0"
              right="0"
              bgColor="rgb(102,102,240)"
              onClick={() => setCreatingBoard(true)}
            />
          }
          <h2 className="text-left text-2xl py-[0.5rem] text-white w-[100%] pl-[1rem] pb-5">
            Your boards
          </h2>
          <section className="h-[25%] w-[100%] bg-[rgba(255,255,255,0.1)] flex flex-row p-[0.5rem] gap-[0.75rem] rounded overflow-x-auto">
          { (userBoards && (userBoards.length > 0)) ? (
              userBoards.map((board, index) => {
                return (
                  <button
                    key={index}
                    className="min-h-[100%] min-w-[182px] bg-[rgba(12,12,18,0.25)] rounded overflow-hidden p-[0.5rem] relative cursor-pointer aspect-4/3 shadow-[0px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-[0px_0px_3px_rgba(0,0,0,0.75)] transition hover:scale-103"
                    onClick={ () => {onOpenBoard(board)} }
                    title={board.title}
                  >
                    <BoardThumbnail
                      props={board}
                    />
                  </button>
                );
              })
            ) : (
              (!currentUser && !accessToken) ?
              <p className="text-left text-white text-lg m-auto">
                Register / Log in to create your own boards!
              </p> :
              <p className="text-left text-white text-lg m-auto">
                Nothing here yet...
              </p>
            ) }

          </section>
          


          <h2 className="text-left text-2xl py-[0.5rem] text-white w-[100%] pl-[1rem] pt-[3rem]">
            Example boards
          </h2>
          <section className="h-[25%] w-[100%] bg-[rgba(255,255,255,0.1)] flex flex-row p-[0.5rem] gap-[0.75rem] rounded overflow-x-auto">
            { publicBoards.length > 0 ? (
              publicBoards.map((board, index) => {

                return (
                  <button
                    key={index}
                    className="min-h-[100%] min-w-[182px] bg-[rgba(12,12,18,0.25)] rounded overflow-hidden p-[0.5rem] relative cursor-pointer aspect-4/3 shadow-[0px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-[0px_0px_3px_rgba(0,0,0,0.75)] transition hover:scale-103"
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
          <p
            className="absolute bottom-3/100 left-2 text-white text-3xl w-full text-center opacity-50"
            style={{ filter: "sepia(100%) hue-rotate(180deg)", userSelect: "none", }}
          >
            <span className="mr-20">BOAR</span> BOARD
          </p>
          <img
            className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1/4 w-auto opacity-50"
            style={{ filter: "sepia(100%) hue-rotate(180deg)", userSelect: "none", }}
            src={boarImage}
          />
        </section>
      </main>
    </>
  );
}