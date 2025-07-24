import VanillaTilt from 'vanilla-tilt';
import React, { useRef, useEffect } from 'react';

export function TaskCard({ task }) {
  const currentCard = useRef(null);

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

  return (
    <article 
      ref={currentCard}
      className="bg-[rgba(200,2002,200,0.25)] rounded py-[0.5rem]
                 border-2 border-[rgba(6,6,52,0.75)]"
    >
      <h2 className="text-lg px-2 pb-1">{task.title}</h2>
      <hr className="border-t-2 border-[rgba(0,0,0,0.5)] w-[98%] m-auto"></hr>
      <p className="px-2 pt-1">{task.description}</p>
    </article>
  );
}
