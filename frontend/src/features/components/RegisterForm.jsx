import { Bounce, toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import { BoardPageButtons } from "../components/BoardPageButtons.jsx";

export function RegisterForm({ swapAuthAction }) {
 
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [valid, setValid] = useState(false);
  const [validations, setValidations] = useState({
    minChars: false,
    isNumeric: false,
    notSimilarUsername: false,
    match: false,
  });

  useEffect(() => {
    setValidations({
      minChars: password1.length >= 8,
      isNumeric: !/^\d+$/.test(password1) && password1.length > 0,
      notSimilarUsername:
        (username.length > 0 && password1.length > 0) &&
        (!password1.toLowerCase().includes(username.toLowerCase()) || 
        password1.length > username.length + 3)
        ? true
        : false,
    match: password1 === password2 && password1.length > 0,
    });


  }, [username, password1, password2]);

  useEffect(() => {
    if (validations.minChars && validations.isNumeric && validations.notSimilarUsername && validations.match) setValid(true);
    else setValid(false);
  }, [validations]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (valid) {
      // TODO: SEND DATA TO API ENDPOINT
      // TODO: CREATE TOAST NOTIF
    } else {
      toast.error("Password conditions are not met!", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: false,
        theme: "dark",
        transition: Bounce,
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute top-[50%] left-[50%] -translate-1/2 w-[65%] h-[95%] shadow-2xl text-white p-[1rem] rounded-md border-2 border-[rgba(52,52,52,0.75)] bg-[linear-gradient(to_top,rgba(12,12,12,0.75)_33%,rgba(24,24,24,0.5)_50%,rgba(12,12,12,0.95)_66%)] z-1"
    >
      <h2
        className="text-center text-5xl py-[0.5rem] text-white w-[100%] mb-[2rem]"
      >
        Register
      </h2>
      <div
        className="flex flex-col justify-center items-center"
      >
        <div className="w-3/4 m-auto">
          <label
            className="text-2xl block text-left w-[100%] pb-2"
            htmlFor="username-input"
          >
            Username *
          </label>

          <input
            className="border-2 border-[rgba(212,212,212,0.5)] rounded-md w-full text-2xl text-left p-2 mb-6"
            placeholder=""
            maxLength={50}
            minLength={1}
            type="text"
            required
            id="username-input"
            name="username-input"
            onChange={ e => setUsername(e.target.value) }
          />
        </div>

        <div className="w-3/4 m-auto">
          <label
            className="text-2xl block text-left w-[100%] pb-2"
            htmlFor="password-input"
          >
            Password *
          </label>

          <input
            className="border-2 border-[rgba(212,212,212,0.5)] rounded-md w-full text-2xl text-left p-2 mb-4"
            placeholder=""
            minLength={8}
            type="password"
            required
            id="password-input"
            name="password-input"
            onChange={ e => setPassword1(e.target.value) }
          />
        </div>

        <div className="w-3/4 m-auto">
          <label
            className="text-2xl block text-left w-[100%] pb-2"
            htmlFor="repeat-password-input"
          >
            Repeat password *
          </label>

          <input
            className="border-2 border-[rgba(212,212,212,0.5)] rounded-md w-full text-2xl text-left p-2 mb-4"
            placeholder=""
            minLength={8}
            type="password"
            required
            id="repeat-password-input"
            name="repeat-password-input"
            onChange={ e => setPassword2(e.target.value) }
          />
        </div>

        <ul className="list-disc">
          <li style={{ color : `${ validations.minChars ? "green" : "rgb(225,52,52)"}` }}>
            At least 8 characters
          </li>
          <li style={{ color : `${ validations.isNumeric ? "green" : "rgb(225,52,52)"}` }}>
            It can't be entirely numeric
          </li>
          <li style={{ color : `${ validations.notSimilarUsername ? "green" : "rgb(225,52,52)"}` }}>
            It can't be similar to your username
          </li>
          <li style={{ color : `${ validations.match ? "green" : "rgb(225,52,52)"}` }}>
            Passwords should match
          </li>
        </ul>

      </div>
      <BoardPageButtons
        role="submit"
        label="Register"
        title="Try to register with entered data"
        bottom="0.5rem"
        right="1rem"
        bgColor="rgb(102,225,102)"
      />
      <BoardPageButtons
        label="Login instead"
        title="Log in"
        bottom="0.5rem"
        left="1rem"
        className="absolute bottom-0 left-0"
        onClick={ () => swapAuthAction() }
      />
    </form>
  );
}
