import React, { useState } from "react";
import { LoginForm } from "../components/LoginForm.jsx";
import { RegisterForm } from "../components/RegisterForm.jsx";

export function Auth({ onBack }) {
  // login is default auth action
  const [login, setLogin] = useState(true);

  return (
    <>
      <button 
        className="bg-red-500 hover:bg-red-700 text-white p-2 px-3 rounded absolute top-0 left-0 m-12 z-5"
        onClick={ onBack }
      >
        &lArr;
      </button>
      { login ? <LoginForm/> : <RegisterForm/> }
    </>
  );
}
