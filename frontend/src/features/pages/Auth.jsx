import React, { useState } from "react";
import { LoginForm } from "../auth/LoginForm.jsx";
import { RegisterForm } from "../auth/RegisterForm.jsx";

export function Auth({ onBack }) {
  // login is default auth action
  const [login, setLogin] = useState(true);

  const toggleAuthAction = () => {
    login ? setLogin(false) : setLogin(true);
  };

  return (
    <>
      <button 
        className="bg-red-500 hover:bg-red-700 text-white p-2 px-3 rounded absolute top-0 left-0 m-12"
        onClick={ onBack }
      >
        &lArr;
      </button>
      <h1 className='text-center text-3xl mt-1rem text-white absolute w-[100%] top-[10%]'>{ login ? "Login" : "Register" }</h1>
      {login ? <LoginForm /> : <RegisterForm />}
      <button
        onClick={toggleAuthAction}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute bottom-0 left-0 m-12 w-[12rem]">
        {login ? "Register instead?" : "Login instead?"}
      </button>
    </>
  );
}
