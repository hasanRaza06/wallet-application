import React from 'react'
import SignUp from './components/SignUp'
import LogIn from './components/LogIn'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import Home from './components/Home';

const App = () => {
  return (
    <div className='bg-slate-200'>
      <Toaster position="top-right" reverseOrder={false} />
    <BrowserRouter >
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={< LogIn/>} />
      <Route path='/' element={<Home/>}/>
    </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App