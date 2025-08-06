import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import { Menu } from './features/pages/Menu.jsx';
import { Auth } from './features/pages/Auth.jsx';
import { Board } from './features/pages/Board.jsx';

import { AuthContext, AuthExpiryContext, CurrentUserContext } from './AuthContext.jsx';
import { refreshUser } from './api/authApi.js';

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [accessTokenExp, setAccessTokenExp] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen]  = useState("menu");
  const [openBoard, setOpenBoard] = useState(null);
  const gotoMainMenu = () => {setCurrentScreen("menu");};
  const gotoBoardView = () => {setCurrentScreen("board");};

  useEffect(() => {
    if (!accessTokenExp) return;
    const expiresInMs = (accessTokenExp * 1000);
    
    // refresh 30s before the token expires
    const refreshBeforeExpiry = expiresInMs - Date.now() - 30000; 

    if (refreshBeforeExpiry > 0) {
      const timeoutId = setTimeout(() => {
        refreshToken();
      }, refreshBeforeExpiry);
  
      return () => clearTimeout(timeoutId);
    }
  }, [accessTokenExp]);

  const refreshToken = async () => {
    const newToken = await refreshUser();
    setAccessToken(newToken?.data?.access_token);
    setAccessTokenExp(newToken?.data?.access_token_exp);
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      <AuthExpiryContext.Provider value={{ accessTokenExp, setAccessTokenExp}}>
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
      </AuthExpiryContext.Provider>
    </AuthContext.Provider>
  );
}

export default App
