import { Bounce, toast } from "react-toastify";
import React, { useState, useContext, useEffect } from "react";
import { postColumn } from "../../api/columnApi.js";
import { AuthContext } from "../../AuthContext";

export function CreateColumnForm({ board, onCloseForm, onCreatedNewColumn }) {
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(0);
  const { accessToken } = useContext(AuthContext);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(delay);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const postCurrentColumn = async () => {
      try {
        const response = await postColumn({
          title: title,
          order: order || 0,
          tasks: [],
          board: board.id,
        }, accessToken);
        if (response.status === 201) {
          toast.success(`Created column ${response.data.title}`, toastOptions);

          setTitle("");
          setOrder(0);

          onCreatedNewColumn(response.data);
        } else {
          toast.error(`Error creating column: ${response.message}`, toastOptions);
        }
      } catch (error) {
        toast.error(`Error creating column: ${error.message}`, toastOptions);
      }
    };

    postCurrentColumn();
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
        Create new column
      </h2>

      <div className="grid grid-cols-[33%_66%] grid-rows-[1fr_50%_1fr] w-[100%] h-[75%] gap-[1rem]">
        <div className="flex items-center">
          <label
            className="text-2xl block text-center w-[100%]"
            htmlFor="title-input"
          >
            New column's title:
          </label>
        </div>
        <input
          className="border-2 border-[rgba(212,212,212,0.5)] rounded-md w-[75%] text-2xl text-center"
          placeholder="My new column, woa..."
          onChange={(e) => setTitle(e.target.value)}
          value={ title }
          maxLength={52}
          minLength={1}
          type="text"
          required
          id="title-input"
          name="title-input"
        />

        <div className="flex items-center">
          <label
            className="text-2xl block text-center w-[100%]"
            htmlFor="order-select"
          >
            New column's position:
          </label>
        </div>
        <div className="flex items-center">
          <select
            className="border-2 border-[rgba(212,212,212,0.5)] bg-[rgb(12,12,12)] rounded-md w-[75%] text-center text-2xl text-white p-4"
            required
            id="order-select"
            name="order-select"
            defaultValue={0}
            onChange={(e) => setOrder(e.target.value)}
          >
              <option value={1}>First</option>
              <option value={0}>Last</option>
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
}