import react, { useState } from 'react';
import { BoardTitleDropdown } from './BoardTitleDropdown';



export const BoardTitle = ({ props, onDowloadBoard, onDeleteBoard }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  
  return (
      <div className='relative'>
        <h1 
          className="text-4xl text-white text-center py-2 mt-2 cursor-pointer select-none"
          onClick={ () => {setDropdownOpen(prev => !prev)} }
        >
          {props.title} 
        </h1>
        {dropdownOpen &&
          <BoardTitleDropdown
            onMouseLeave={ () => {setDropdownOpen(false)} }
            onDowloadBoard={onDowloadBoard}
            onDeleteBoard={onDeleteBoard}
          />
        }
      </div>

  );
}