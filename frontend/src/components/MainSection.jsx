import React, { useEffect } from 'react';
import MapComponent from './MapComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, fetchTasksByUserId,deleteTask,reset } from '../features/tasks/taskSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MainSection = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const {user}=useSelector((state)=>state.auth)
  const tasks=useSelector((state)=>state.task.tasks)
  //  console.log(tasks)
  useEffect(()=>{
    if(user){

      dispatch(fetchTasksByUserId(user._id))
    }
    dispatch(reset())
  },[dispatch])

  const handleClick=(id)=>{
    dispatch(deleteTask(id))
  } 


    return (
     <section className='mt-5 m-2'>
      <div className='m-4 bg-slate-950'>
      <MapComponent tasks={tasks} />
      </div>

        <div className='mb-10 mt-8 flex flex-col p-8 bg-slate-950 rounded-2xl m-auto divide-y divide-gray-100'>
        <h1 className='flex justify-center text-2xl text-white '>Your Tasks</h1>
        <div className='m-2 p-2 flex justify-between '>
          <h1 className='text-white font-bold mx-1'>Title</h1>
          <h1 className='text-white font-bold'>Alert Type</h1>
          <h1 className='text-white font-bold'>Status</h1>

        </div>
        <ul role='list' className="divide-y w-full divide-gray-100 ">
          {tasks.map((task)=>(

            <li key={task._id}>
              <div className='m-2 p-2 flex justify-between flex-wrap '>
                <div>
              <p className='text-white'>
              {task.title}
              </p>
                </div>
              <div >
              <p className='text-white '>
                {task.alertType}
              </p>
              </div>
              <p>
              <div className='bg-red-700 hover:bg-red-500 m-1 p-1 rounded'>
                <button  onClick={() => handleClick(task._id)} type='button' className=' text-white'>Remove</button>
              </div>
              </p>
              </div>
            </li>
          ))}
        </ul>
        </div>
        <div onClick={()=>{navigate('/dialog')}} className='flex justify-center my-4 m-auto p-2 bg-blue-700 rounded-full hover:bg-blue-600 w-1/2 '>
          <button  className=' text-white font-bold' type='button'>Add New Task</button>
        </div>
      </section>
    );
};

export default MainSection;
