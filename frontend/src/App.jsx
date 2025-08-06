import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import { Menu } from './features/pages/Menu.jsx';
import { Auth } from './features/pages/Auth.jsx';
import { Board } from './features/pages/Board.jsx';

import { AuthContext, CurrentUserContext } from './AuthContext.jsx';

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen]  = useState("menu");
  const [openBoard, setOpenBoard] = useState(null);
  const gotoMainMenu = () => {setCurrentScreen("menu");};
  const gotoBoardView = () => {setCurrentScreen("board");};


  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
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
      </CurrentUserContext.Provider>
    </AuthContext.Provider>
  );
}

export default App
