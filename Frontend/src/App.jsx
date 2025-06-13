import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { updateUser } from './store/UserSlice'
import ForgetPassword from './pages/ForgetPassword'
import Slidebar from './components/Slidebar'
import Profile from './pages/Profile'
import FriendProfile from './pages/FriendProfile'
import Chat from './pages/Chat'


function App() {
  let dispatch = useDispatch();

  let userStore = useSelector((state)=>state.user);
  // console.log(userStore)
  let login = userStore.login;
  // console.log(login)

  const getUserDetails =async ()=>{
  let res = await axios.get('https://blog-app-backend-ianr.onrender.com/api/auth/getuser',{
    headers: {
      'Authorization' : userStore.token
    }
  })
   let data = res.data;
  //  console.log(data)
  dispatch(updateUser(data))
  }

  useEffect(()=>{
    if(userStore.token){
      getUserDetails();
    }
  },[userStore.token])

  return (
   <>
    <BrowserRouter>
    <div className='mb-20'>
      <Navbar/>
    </div>
      <Routes>
        <Route path="/" element={login===true? <Home/> : <Navigate to={'/login'}/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path='/profile' element={login===true? <Profile getUserDetails={getUserDetails}/> :<Navigate to={'/login'}/>}/>
        <Route path="/login" element={login===false? <Login/>:<Navigate to='/'/>}/>
        <Route path='/forgetPassword' element={login===false? <ForgetPassword/>: <Navigate to='/'/>}/>
        <Route path='/friendProfile' element={login===true? <FriendProfile getUserDetails={getUserDetails}/> :<Navigate to='/login'/>}/>
        <Route path='/chat' element={login===true ?<Chat getUserDetails={getUserDetails}/> :<Navigate to='/login'/>}/>
      </Routes>

      <ToastContainer/>
    </BrowserRouter>
    
   </>
  )
}

export default App
