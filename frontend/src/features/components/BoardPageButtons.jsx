

export function BoardPageButtons({
  top, right, left, bottom, bgColor, label, onClick 
}) {

  const style = {
    ...(top && { top }),
    ...(right && { right }),
    ...(left && { left }),
    ...(bottom && { bottom }),
    backgroundColor: bgColor || "rgba(112,112,112,0.75)",
  };

  const handleClick = (e) => {
    onClick();
  };

  return (
    <button 
      className={`transition text-white p-2 px-3 rounded absolute m-4`}
      style={style}
      onClick={ handleClick }
    >
      {label || " "}
    </button>
  );
}