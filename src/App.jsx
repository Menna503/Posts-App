import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SignUP from './pages/SignUp'
import Login from './pages/Login.jSX'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [count, setCount] = useState(0)
 
  const [token,setToken]=useState(localStorage.getItem('token'));
   const handelLogout=()=>{
    localStorage.removeItem('token');
    setToken(null);

  }
  const handelSignin=(tokenValue)=>{
    localStorage.setItem('token',tokenValue);
    setToken(tokenValue);
  }

  return (
    <>
    {/* <SignUP></SignUP> */}
    {/* <Login></Login> */}
    {/* <Home></Home> */}
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home token={token} handelLogout={handelLogout} />}/>
      <Route path='signup' element={<SignUP/>}/>
      <Route path='login' element={<Login handelSignin={handelSignin}/>}/>
    </Routes>
    </BrowserRouter>
     <ToastContainer />
    </>
  )
}

export default App
