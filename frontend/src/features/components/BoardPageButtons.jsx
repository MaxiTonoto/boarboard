

export function BoardPageButtons({
  title, top, right, left, bottom, bgColor, label, onClick 
}) {

  const style = {
    ...(top && { top }),
    ...(right && { right }),
    ...(left && { left }),
    ...(bottom && { bottom }),
    backgroundColor: bgColor || "rgba(112,112,112,0.75)",
  };

  const handleClick = () => onClick();

  return (
    <button 
      title={title || undefined}
      className={`transition text-white p-2 px-3 rounded absolute m-4 min-w-[4rem] hover:brightness-95 shadow-sm hover:shadow-md cursor-pointer select-none`}
      style={style}
      onClick={ handleClick }
    >
      {label || " "}
    </button>
  );
}