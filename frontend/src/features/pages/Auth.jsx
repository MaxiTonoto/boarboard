import React, { useContext, useState } from "react";
import { LoginForm } from "../components/LoginForm.jsx";
import { RegisterForm } from "../components/RegisterForm.jsx";
import { AuthContext, CurrentUserContext } from '../../AuthContext.jsx';
import { logoutUser } from "../../api/authApi.js";
import { Bounce, toast } from "react-toastify";

export function Auth({ onBack }) {
  const { setCurrentUser, currentUser } = useContext(CurrentUserContext);
  const { setAccessToken, accessToken } = useContext(AuthContext);
  // login is default auth action
  const [login, setLogin] = useState(true);

  const handleLogOut = async () => {
    const response = await logoutUser(accessToken);
    console.log(response);
    if (response.status === 200) {
      toast.warning(response.data.message, toastOptions);
      setCurrentUser(null);
      setAccessToken(null);
      onBack();
    }
  };

  return (
    <>
      <button 
        className="bg-red-500 hover:bg-red-700 text-white p-2 px-3 rounded absolute top-0 left-0 m-12 z-5"
        onClick={ onBack }
      >
        &lArr;
      </button>
      { currentUser ? 
        <div
          className="absolute top-[50%] left-[50%] -translate-1/2 w-[50%] h-[75%] shadow-2xl text-white p-[1rem] rounded-md border-2 border-[rgba(52,52,52,0.75)] bg-[linear-gradient(to_top,rgba(12,12,12,0.75)_33%,rgba(24,24,24,0.5)_50%,rgba(12,12,12,0.95)_66%)] z-1"
        >
          <h1 
            className="text-white text-4xl text-center w-full mb-4 absolute top-1/4 left-1/2 -translate-1/2"
          >
            Curretly logged in as {currentUser}
          </h1>
          <button
            className="bg-red-600 rounded px-2 py-4 text-xl text-white absolute top-1/2 left-1/2 -translate-1/2 cursor-pointer"
            onClick={ handleLogOut }
          >
            LOG OUT
          </button>
        </div>
      :
        login ? 
        <LoginForm swapAuthAction={ () => setLogin(prev => !prev) } /> 
        : 
        <RegisterForm swapAuthAction={ () => setLogin(prev => !prev) } /> 
      }

    </>
  );
}
const toastOptions = {
  position: "bottom-left",
  autoClose: 4000,
  closeOnClick: true,
  pauseOnHover: false,
  theme: "dark",
  transition: Bounce,
};