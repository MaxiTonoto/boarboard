

export function BoardThumbnail({ props }) {


    return (
        <>
          <h2 
            className='text-left text-md text-white w-full h-[20%] absolute bottom-0 left-0 pl-2 pb-2 pr-2 bg-[rgba(0,0,0,0.2)] rounded truncate'
            title={props.title}
          >
            {props.title}  
          </h2> 
          <div className='h-[100%] w-[100%] flex flex-row align-center justify-left gap-1'>
          {
            props.columns.sort((a, b) => (a.order - b.order)).map((item) => {
                
                const thisR = Math.floor(Math.random() * 100 + 155);
                const thisG = Math.floor(Math.random() * 100 + 155);
                const thisB = Math.floor(Math.random() * 100 + 155);

                return (
                    <section
                      key={item.id}
                      style={{ backgroundColor:`rgba(${thisR},${thisG},${thisB},0.1)` }}
                      className='h-[100%] min-w-[32%] w-[32%] max-w-[32%] rounded p-[0.25rem] flex flex-col gap-[0.25rem] overflow-hidden'>
                      
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