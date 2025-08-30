import { Bounce, toast } from "react-toastify";
import React, { useState, useContext, useEffect } from "react";
import { postBoard } from "../../api/boardApi.js";
import { AuthContext, CurrentUserContext } from "../../AuthContext.jsx";


export function CreateBoardForm({ onCloseForm, onCreateBoard }) {
  const [title, setTitle] = useState("");
  const [columnsPreset, setColumnsPreset] = useState(0);
  const { accessToken } = useContext(AuthContext);
  const { currentUser } = useContext(CurrentUserContext);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(delay);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.warning(
        "Can't create a board. Log in or register first!", 
        toastOptions
      );
      return;
    }

    const postCurrentBoard = async () => {
      try {
        let response = await postBoard(
          accessToken, 
          {
            title: title,
            columnsPreset: columnsPreset,
          });
        if (response.status === 201) {
          toast.success(`Created board ${response.data.title}`, toastOptions);
          onCloseForm();
          onCreateBoard();
        } else {
          toast.error(`Error creating board: ${response.message}`, toastOptions);
        }
      } catch (error) {
        toast.error(`Error creating board: ${error.message}`, toastOptions);
      }
    };

    postCurrentBoard();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`absolute top-[50%] left-[50%] -translate-1/2 w-[90%] h-[85%] shadow-xl z-1000 text-white p-[1rem] rounded-md border-2 border-[rgba(12,12,12,0.75)] bg-[linear-gradient(to_top,rgba(12,12,12,1)_33%,rgba(24,24,24,0.85)_50%,rgba(12,12,12,0.95)_66%)] transition-opacity duration-100 motion-reduce:transition-none ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <p
        onClick={onCloseForm}
        role="none"
        className="bg-red-500 hover:bg-red-700 text-white p-2 px-4 rounded absolute top-0 right-0 m-4 cursor-pointer select-none"
      >
        &rArr;
      </p>
      <h2 className="text-center text-5xl py-[0.5rem] text-white w-[100%] mb-[4rem]">
        Create new board
      </h2>

      <div className="grid grid-cols-[33%_66%] grid-rows-[1fr_50%_1fr] w-[100%] h-[75%] gap-[1rem]">
        <div className="flex items-center">
          <label
            className="text-2xl block text-center w-[100%]"
            htmlFor="title-input"
          >
            New board's title:
          </label>
        </div>
        <input
          className="border-2 border-[rgba(212,212,212,0.5)] rounded-md w-[75%] text-2xl text-center"
          placeholder="My new board is named..."
          onChange={(e) => setTitle(e.target.value)}
          value={ title }
          maxLength={200}
          minLength={1}
          type="text"
          required
          id="title-input"
          name="title-input"
        />

        <div className="flex items-center">
          <label
            className="text-2xl block text-center w-[100%]"
            htmlFor="columns-preset-select"
          >
            Columns preset:
          </label>
        </div>
        <div className="flex items-center">
          <select
            className="border-2 border-[rgba(212,212,212,0.5)] bg-[rgb(12,12,12)] rounded-md w-[75%] text-center text-2xl text-white p-4"
            required
            id="columns-preset-select"
            name="columns-preset-select"
            defaultValue={0}
            onChange={(e) => setColumnsPreset(e.target.value)}
          >
              <option value={0}>Empty</option>
              <option value={1}>Pending + In Progress + Done</option>
              <option value={2}>Not Done + Done</option>
          </select>
        </div>
      </div>

      <input
        className="rounded text-black text-2xl bg-[rgba(102,212,102,0.75)] px-6 py-3 hover:bg-[rgba(102,212,102,0.95)] transition absolute bottom-[5%] right-[5%] border-3 border-[rgba(47,185,93,0.75)] rounded-xl"
        type="submit"
        value="Create"
      />
    </form>
  );
}

const toastOptions = {
  position: "bottom-left",
  autoClose: 3000,
  closeOnClick: true,
  pauseOnHover: false,
  theme: "dark",
  transition: Bounce,
};