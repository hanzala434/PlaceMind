import React, { useEffect } from 'react'
import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import MapComponent2 from './MapComponent2'
import {useSelector,useDispatch} from 'react-redux'
import { addTask,reset } from '../features/tasks/taskSlice'
import { useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";


const DialogForm = () => {
    const [open, setOpen] = useState(true)
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const userId=useSelector((state)=>state.auth.user._id)
    // console.log(userId)
    const [formData,setFormData]=useState({
        title:'',
        alertType:'',
        location:'',
         })
         const {title,alertType,location}=formData

      useEffect(()=>{
        //  if(isError)
        //   {  
        //     toast.error(message)
        //   }
          dispatch(reset())

      })

       const onChange=(e)=>{
              setFormData((prevState)=>({
                 ...prevState,
                 [e.target.name]:e.target.value,
              }))
          }

          const handleLocationUpdate = (loc) => {
            setFormData((prevState) => ({
              ...prevState,
              location: loc,
            }));
          };
          const onSubmit=(e)=>{
              e.preventDefault()
              
              const taskData={
                  title,
                  location,
                  alertType:"notification",
                  userId,

              }
              console.log(taskData)

              if(!taskData){
                toast.error('Complete all the fields')
                navigate('/dialog')
              }
              else{

                dispatch(addTask(taskData))
                navigate('/home')
              }
          }
      

  return (
  <>
  <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 ">
              <div className="sm:flex sm:items-start ">
                {/* <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                  <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" />
                </div> */}
                <div className="mt-3 w-96 text-center sm:m-auto sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                    Add New Task
                  </DialogTitle>
                  <div className="m-auto ">
  <form className="space-y-4" onSubmit={onSubmit}>
    {/* Email Address Field 1 */}
    <div>
      <label htmlFor="email1" className="block text-sm font-medium text-gray-900">
        Add Title
      </label>
      <input
        name="title"
        type="text"
        value={title}
        onChange={onChange}
        className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>


    {/* Map Component */}
    <div className="mt-4 w-full">
      <label className="block text-sm font-medium text-gray-900">Location</label>
      <MapComponent2   onLocationUpdate={(loc) => handleLocationUpdate(loc)} className="mt-2 h-48 w-full border border-gray-300 rounded-md"  />
    </div>
    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 sm:ml-3 sm:w-auto"
              >
                Add Task
              </button>
              <button
                onClick={()=>{navigate('/home')}}
                type="button"
                data-autofocus
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
  </form>
</div>

                </div>
              </div>
            </div>
         
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  </>
  )
}

export default DialogForm
