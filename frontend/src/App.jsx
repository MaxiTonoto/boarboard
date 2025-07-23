import React, { useEffect, useState } from 'react';
import { Menu } from './features/pages/Menu.jsx';
import { Auth } from './features/pages/Auth.jsx';

function App() {
  
  const [currentScreen, setCurrentScreen]  = useState("auth");
  const gotoMainMenu = () => {setCurrentScreen("menu");};

  return (
    <> 
      { currentScreen === "menu" && <Auth onBack={ gotoMainMenu } /> }
      { currentScreen === "auth" && <Menu /> }
    </>
  );
}

export default App
