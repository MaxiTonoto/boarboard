import React, { useEffect, useState } from 'react';
import { Menu } from './features/pages/Menu.jsx';
import { Auth } from './features/pages/Auth.jsx';
import { Board } from './features/pages/Board.jsx';

function App() {
  
  const [currentScreen, setCurrentScreen]  = useState("menu");
  const [openBoard, setOpenBoard] = useState(null);
  const gotoMainMenu = () => {setCurrentScreen("menu");};
  const gotoBoardView = () => {setCurrentScreen("board");};

  return (
    <> 
      { currentScreen === "auth" && 
        <Auth
          onBack={ gotoMainMenu } 
        /> 
      }
      
      { currentScreen === "menu" && 
        <Menu
          onOpenBoard={ (board) => { 
            gotoBoardView();
            setOpenBoard(board);
          }} 
        /> 
      }

      { currentScreen === "board" && 
        <Board
          onBack={ gotoMainMenu }
          props={ openBoard }
        /> 
      }
    </>
  );
}

export default App
