import { Column } from "../components/BoardColumn.jsx";

export function Board({ props, onBack }) {


  return (
    <>
      <button
        onClick={ onBack }
        className="bg-red-500 hover:bg-red-700 text-white p-2 px-3 rounded absolute top-0 left-0 m-4"
      >
        &lArr;
      </button>
      <h1
        className="text-5xl text-white text-center w-[100%] py-[0.5rem]"
      >
        {props.title}
      </h1>
      <main className="h-[85%] w-[98%] m-auto bg-[rgba(0,0,0,0.25)] rounded shadow-[0_0_16px_#000] relative flex flex-row gap-[0.5rem]">
        {
          props.columns.map((col, index) => {
            return (
              <Column
                key={col.id}
                col={col}
              />
            );
          })
        }
      </main>
    </>
  );
}
