import react, { useState, useEffect, useContext } from 'react';
import { patchColumnTitle } from '../../api/columnApi.js';
import { AuthContext } from '../../AuthContext.jsx';
import { Bounce, toast } from "react-toastify";


export function ColumnTitle({ title, colId }) {
  const { accessToken } = useContext(AuthContext);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(title);

  const updateTitle = async () => {
    if (titleValue === title) {
        setEditingTitle(false);
        return;
    };

    try {
      const response = await patchColumnTitle(colId, titleValue, accessToken);
      if (response.status === 200) {
        toast.success("Updated column title!", toastOptions);
      } else {
        toast.error("Error updating column title", toastOptions)
      }
      setEditingTitle(false);
    } catch (error) {
      console.log(error);
    } 
  };

  return (
    <div>
      
      { !editingTitle ?
      <p
        className='cursor-pointer'
        onClick={ () => {setEditingTitle(prev => !prev)} }
      >
        { titleValue }
      </p>
      :
      <>
        <button
          className='cursor-pointer'
          onClick={ () => {
            setEditingTitle(prev => !prev);
            setTitleValue(title);
          } }
        >
          ❌
        </button>
        <input
          className='bg-gray-200/20 rounded w-1/2 mr-1 px-1 outline-1 outline-gray-800/80'
          defaultValue={titleValue}
          onChange={ (e) => setTitleValue(e.target.value) }
          type='text'
        />
        <button
          className='cursor-pointer'
          onClick={ () => updateTitle() }
        >
          ✅
        </button>
      </>
      }
      
    </div>
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