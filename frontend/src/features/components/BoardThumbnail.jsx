import React, { useEffect } from 'react';


export function BoardThumbnail({ props }) {


    return (
        <>
          <h2 className='text-center text-[0.5rem] text-white h-[15%] w-[100%]'>{props.title}</h2>
          <div className='h-[85%] w-[100%] flex flex-row gap-[5px]'>
          {
            props.columns.map((item) => {
                
                const thisR = Math.floor(Math.random() * 100 + 155);
                const thisG = Math.floor(Math.random() * 100 + 155);
                const thisB = Math.floor(Math.random() * 100 + 155);

                return (
                    <section
                      key={item.id}
                      style={{ backgroundColor:`rgba(${thisR},${thisG},${thisB},0.1)` }}
                      className='h-[100%] min-w-[25%] w-[25%] max-w-[25%] rounded p-[0.25rem] flex flex-col gap-[0.25rem]'>
                      
                      {
                        item.tasks.map((task) => {
                          
                          const anotherR = Math.floor(Math.random() * 100 + 155);
                          const anotherG = Math.floor(Math.random() * 100 + 155);
                          const anotherB = Math.floor(Math.random() * 100 + 155);
                        
                          return (
                            <span
                            key={task.id}
                            style={{ backgroundColor:`rgba(${anotherR},${anotherG},${anotherB},0.15)` }}
                            className='min-h-[20%] h-[20%] max-h-[20%] w-[100%] rounded block overflow-hidden'>
                              <p
                              className='text-[0.25rem]'
                              >{ task.title }</p>
                            </span>
                          );
                        })
                      }

                    </section>
                );
            })
          }
          </div>
        </>
    );
}