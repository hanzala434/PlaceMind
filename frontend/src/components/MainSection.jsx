import React, { useEffect } from 'react';
import MapComponent from './MapComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, fetchTasksByUserId } from '../features/tasks/taskSlice';

const MainSection = () => {
  const dispatch=useDispatch()
  const userId=useSelector((state)=>state.auth.user._id)
  const tasks=useSelector((state)=>state.task.tasks)
  //  console.log(tasks)
  useEffect(()=>{
    dispatch(fetchTasksByUserId(userId))
  },[dispatch])
    return (
     <section className='mt-5'>
      <div className='m-4 bg-slate-950'>
      <MapComponent tasks={tasks} />
      </div>

        <div className='mt-8 flex flex-col w-2/3 p-8 bg-slate-950 rounded-2xl m-auto'>
        <div className='m-2 p-2 flex justify-between'>
          <h1 className='text-white font-bold'>Title</h1>
          <h1 className='text-white font-bold'>Alert Type</h1>
        </div>
        <ul role='list' className="divide-y w-full divide-gray-100">
          {tasks.map((task)=>(

            <li key={task._id}>
              <div className='m-2 p-2 flex justify-between'>
              <h1 className='text-white mr-2'>
              {task.title}
              </h1>

              <p className='text-white '>
                {task.alertType}
              </p>
              </div>
            </li>
          ))}
        </ul>
        </div>
      </section>
    );
};

export default MainSection;
