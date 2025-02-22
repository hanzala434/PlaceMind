import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DialogForm from './components/DialogForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
<>
   <BrowserRouter>
      <Routes>
         <Route path='/home' element={<HomePage/>}/>
         <Route path='/' element={<LoginPage/>}/>
         <Route path='/dialog' element={<DialogForm/>}/>


      </Routes>
    </BrowserRouter>
</>
  );
}

export default App;
