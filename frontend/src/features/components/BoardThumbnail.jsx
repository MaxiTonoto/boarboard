import React, { useEffect } from 'react';


export function BoardThumbnail({ props }) {


    return (
        <>
          <h2 className='text-center text-[0.5rem] text-white h-[15%] w-[100%]'>{props.title}</h2>
          <div className='h-[85%] w-[100%] flex flex-row gap-[5px]'>
          {
            props.columns.map((item, index) => {
                
                const thisR = Math.floor(Math.random() * 255 + 1);
                const thisG = Math.floor(Math.random() * 255 + 1);
                const thisB = Math.floor(Math.random() * 255 + 1);

                return (
                    <section
                      key={index}
                      className='h-[100%] min-w-[25%] w-[25%] max-w-[25%] rounded bg-red-200'
                      style={{ 
                        backgroundColor:`rgba(${thisR},${thisG},${thisB},0.25)` 
                      }}
                    >
                    </section>
                );
            })
          }
          </div>
        </>
    );
}