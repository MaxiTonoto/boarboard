import { Bounce, toast } from "react-toastify";
import React, { useState, useContext } from "react";
import { BoardPageButtons } from "../components/BoardPageButtons.jsx";
import { loginUser } from "../../api/authApi.js";
import { AuthContext, AuthExpiryContext, CurrentUserContext } from "../../AuthContext.jsx";

export function LoginForm({ swapAuthAction }) {
  const { setAccessToken } = useContext(AuthContext);
  const { accessTokenExp, setAccessTokenExp } = useContext(AuthExpiryContext);
  const { setCurrentUser } = useContext(CurrentUserContext);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ username, password });

      toast.success(`Successfully logged in user ${username}!`, toastOptions);
      setCurrentUser(username);
      setAccessToken(response.data?.access_token);
      setAccessTokenExp(response.data?.access_token_exp);

      setUsername("");
      setPassword("");

    } catch (error) {

      const data = error?.response?.data;

      if (data) {
        if (data.username) toast.error(`Username: ${data.username[0]}`, toastOptions);
        if (data.password) toast.error(`Password: ${data.password[0]}`, toastOptions);
        if (data.non_field_errors) toast.error(`Error: ${data.non_field_errors[0]}`, toastOptions);
        if (data.error) toast.error(`Error: ${data.error}`, toastOptions);
      } else {
        toast.error(`Login error: ${error?.message || "An unexpected error occurred."}`, toastOptions);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute top-[50%] left-[50%] -translate-1/2 w-[50%] h-[75%] shadow-2xl text-white p-[1rem] rounded-md border-2 border-[rgba(52,52,52,0.75)] bg-[linear-gradient(to_top,rgba(12,12,12,0.75)_33%,rgba(24,24,24,0.5)_50%,rgba(12,12,12,0.95)_66%)] z-1"
    >
      <div
        className="relative h-full w-full"
      >     
        <h2
          className="text-center text-5xl py-[0.5rem] text-white w-[100%] mb-[4rem]"
        >
          Login
        </h2>

        <div
          className="flex flex-col justify-center items-center py-4"
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
              value={username}
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
              type="password"
              required
              id="password-input"
              name="password-input"
              value={password}
              onChange={ e => setPassword(e.target.value) }
            />
          </div>
        </div>
        <BoardPageButtons
          role="submit"
          label="Login"
          title="Try login with entered data"
          bottom="0"
          right="0"
          bgColor="rgb(72,152,72)"
        />
        <BoardPageButtons
          label="Register instead"
          bottom="0"
          left="0"
          className="absolute bottom-0 left-0"
          onClick={ () => swapAuthAction() }
        />
      </div>
    </form>
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