import { postTask } from "../../api/taskApi";
import { Bounce, toast } from "react-toastify";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../AuthContext.jsx";

export function CreateTaskForm({ columnList, onCloseForm, defaultColumnId, onCreatedNewTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetColumn, setTargetColumn] = useState(defaultColumnId);
  const { accessToken } = useContext(AuthContext);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(delay);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const postCurrentTask = async () => {
      try {
        const response = await postTask({
          column: targetColumn,
          title: title,
          description: description,
          order: 0,
        }, accessToken);
        if (response.status === 201) {
          toast.success(`Created task ${response.data.title}`, toastOptions);
          setTitle("");
          setDescription("");
          onCreatedNewTask(targetColumn, response.data);
        } else {
          toast.error(`Error creating task: ${response.message}`, toastOptions);
        }
      } catch (error) {
        toast.error(`Error creating task: ${error.message}`, toastOptions);
      }
    };

    postCurrentTask();
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
        Create task
      </h2>

      <div className="grid grid-cols-[33%_66%] grid-rows-[1fr_50%_1fr] w-[100%] h-[75%] gap-[1rem]">
        <div className="flex items-center">
          <label
            className="text-2xl block text-center w-[100%]"
            htmlFor="title-input"
          >
            New task's title:
          </label>
        </div>
        <input
          className="border-2 border-[rgba(212,212,212,0.5)] rounded-md w-[75%] text-2xl text-center"
          placeholder="My new task, yada yada..."
          onChange={(e) => setTitle(e.target.value)}
          value={ title }
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
            New task's description:
          </label>
        </div>
        <textarea
          className="border-2 border-[rgba(212,212,212,0.5)] text-xl p-[0.5rem] rounded-md w-[75%] min-h-[3rem] resize-none"
          placeholder="This task is very interesting, wiwi..."
          onChange={(e) => setDescription(e.target.value)}
          value={ description }
          maxLength={1024}
          minLength={1}
          required
          id="description-input"
          name="description-input"
        />

        <div className="flex items-center">
          <label
            className="text-2xl block text-center w-[100%]"
            htmlFor="column-select"
          >
            New task's column:
          </label>
        </div>
        <div className="flex items-center">
          <select
            className="border-2 border-[rgba(212,212,212,0.5)] bg-[rgb(12,12,12)] rounded-md w-[75%] text-center text-2xl text-white p-4"
            required
            id="column-select"
            name="column-select"
            defaultValue={defaultColumnId}
            onChange={(e) => setTargetColumn(e.target.value)}
          >
            {columnList.map((item, index) => (
              <option key={index + 1} value={item.id}>
                {index+1}. {item.title}
              </option>
            ))}
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