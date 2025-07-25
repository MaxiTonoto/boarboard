import VanillaTilt from 'vanilla-tilt';
import React, { useRef, useEffect } from 'react';

export function TaskCard({ task }) {
  const currentCard = useRef(null);
/*
  useEffect(() => {
    if (currentCard.current) {
      VanillaTilt.init(currentCard.current, {
        max: 10,
        speed: 150,
        glare: false,
        reverse: true,
      });
    }

    return () => {
      currentCard.current?.vanillaTilt && currentCard.current.vanillaTilt.destroy();
    };
  }, []);
*/
  return (
    <article 
      ref={currentCard}
      className="bg-[rgba(137,137,137,0.5)] rounded py-[0.5rem]
                 border-2 border-[rgba(14,14,50,0.75)] relative"
    >
      <h2 className="text-lg px-2 pb-1">{task.title}</h2>
      <span
        className='absolute top-0 right-0 m-1 bg-[rgba(0,0,0,0.25)] rounded-sm p-[0.2rem] cursor-pointer select-none'
      >🗑️</span>
      <hr className="border-t-2 border-[rgba(14,14,50,0.5)] w-[98%] m-auto"></hr>
      <p className="px-2 pt-1">{task.description}</p>
    </article>
  );
}
