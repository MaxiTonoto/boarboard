import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import { Menu } from './features/pages/Menu.jsx';
import { Auth } from './features/pages/Auth.jsx';
import { Board } from './features/pages/Board.jsx';

import { AuthContext } from './AuthContext.jsx';

function App() {
  const [accessToken, setAccessToken] = useState(null);

  const [currentScreen, setCurrentScreen]  = useState("menu");
  const [openBoard, setOpenBoard] = useState(null);
  const gotoMainMenu = () => {setCurrentScreen("menu");};
  const gotoBoardView = () => {setCurrentScreen("board");};


  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}> 
      <ToastContainer/>
      
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
          onGoToAuth={ () => setCurrentScreen("auth") }
        /> 
      }

      { currentScreen === "board" && 
        <Board
          onBack={ gotoMainMenu }
          props={ openBoard }
        /> 
      }
    </AuthContext.Provider>
  );
}

export default App
