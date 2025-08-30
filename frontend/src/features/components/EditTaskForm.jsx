import { patchTaskContent } from "../../api/taskApi.js";
import { Bounce, toast } from "react-toastify";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../AuthContext";

export function EditTaskForm({ task, onCloseForm, onTaskEdited }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const { accessToken } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(delay);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await patchTaskContent(task.id, title, description, accessToken);
      if (response.status === 200) {
        toast.success(`Edited task ${response.data.title}`, toastOptions);
        setTitle("");
        setDescription("");
        onCloseForm();
        onTaskEdited(task, title, description);
      } else {
        toast.error(`Error editing task: ${response}`, toastOptions);
      }
    } catch (error) {
      toast.error(`Error editing task: ${error?.response?.data?.title[0] || error.message}`, toastOptions);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`absolute top-[50%] left-[50%] -translate-1/2 w-[95%] h-[95%] shadow-xl z-1000 text-white p-[1rem] rounded-md border-2 border-[rgba(12,12,12,0.75)] bg-[linear-gradient(to_top,rgba(12,12,12,1)_33%,rgba(24,24,24,0.75)_50%,rgba(12,12,12,0.95)_66%)] transition-opacity duration-100 motion-reduce:transition-none ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <p
        onClick={onCloseForm}
        role="none"
        className="bg-red-500 hover:bg-red-700 text-white p-2 px-4 rounded absolute top-0 right-0 m-4 cursor-pointer select-none"
      >
        &rArr;
      </p>
      <h2 className="text-center text-5xl py-[0.5rem] text-white w-[100%] mb-[1.5rem]">
        Edit task
      </h2>

      <div className="grid grid-cols-[25%_75%] grid-rows-[25%_75%] w-[100%] h-[70%] gap-[1rem]">
        <div className="flex items-center">
          <label
            className="text-2xl block text-center w-[100%]"
            htmlFor="title-input"
          >
            Task's title:
          </label>
        </div>
        <input
          className="border-2 border-[rgba(212,212,212,0.5)] rounded-md w-[80%] text-2xl text-center"
          placeholder="New title for this task"
          onChange={(e) => setTitle(e.target.value)}
          defaultValue={ task.title }
          maxLength={150}
          minLength={1}
          type="text"
          required
          id="title-input"
          name="title-input"
        />

        <div className="flex items-center">
          <label
            className="text-2xl block text-center w-[100%]"
            htmlFor="description-input"
          >
            Task's description:
          </label>
        </div>
        <textarea
          className="border-2 border-[rgba(212,212,212,0.5)] text-xl p-[0.5rem] rounded-md w-[80%] min-h-[3rem] resize-none"
          placeholder="This task is very interesting, wiwi..."
          onChange={(e) => setDescription(e.target.value)}
          defaultValue={ task.description }
          maxLength={1024}
          minLength={1}
          required
          id="description-input"
          name="description-input"
        />
      </div>

      <input
        className="rounded text-black text-2xl bg-[rgba(102,212,102,0.75)] px-6 py-3 hover:bg-[rgba(102,212,102,0.95)] transition absolute bottom-[5%] right-[5%] border-3 border-[rgba(47,185,93,0.75)] rounded-xl"
        type="submit"
        value="Submit"
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