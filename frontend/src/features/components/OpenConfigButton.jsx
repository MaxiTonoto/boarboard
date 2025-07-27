

export function OpenConfigButton({ onOpenConfig }) {

  return (
    <button 
      className="bg-gray-500 hover:bg-gray-600 transition text-white p-2 px-3 rounded absolute top-0 right-0 m-4"
      onClick={ onOpenConfig }
    >
      ⚙
    </button>
  );
}