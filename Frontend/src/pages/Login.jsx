import axios from 'axios';
import React, { useRef } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setState } from '../store/UserSlice';

const Login = () => {

  let dispatch = useDispatch()

  let navigate = useNavigate();
  
  let emailRef = useRef();
  let passwordRef = useRef();

  const handleSubmit =async (e)=>{
     e.preventDefault();
     let obj = {
      email:emailRef.current.value,
      password:passwordRef.current.value
     }
    //  console.log(obj)

     let res = await axios.post('https://blog-app-backend-ianr.onrender.com/api/auth/login',obj)
     

     if(res.data.success){
            // alert(res.data.msg)
            console.log(res.data)
            dispatch(setState(res.data))
            toast.success(res.data.msg,{position:'top-center',theme:"dark"})
            navigate('/')
        }
        else{
            toast.error(res.data.msg,{position:'top-center',theme:"dark"})
        }
  }
  return (
    <div>
      
     <div className="bg-white dark:bg-gray-900">
  <div className="flex justify-center h-screen">
    <div className="hidden bg-cover lg:block lg:w-2/3" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)'}}>
      <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
        
      </div>
    </div>
    <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
      <div className="flex-1">
       
        <div className="mt-8">
          <form>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Email Address</label>
              <input ref={emailRef} type="email" name="email" id="email" placeholder="example@example.com" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
            </div>
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-200">Password</label>
                <Link to="/forgetPassword" className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline">Forgot password?</Link>
              </div>
              <input ref={passwordRef} type="password" name="password" id="password" placeholder="Your Password" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
            </div>
            <div className="mt-6">
              <button onClick={handleSubmit} className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                Sign in
              </button>
            </div>
          </form>
          <p className="mt-6 text-sm text-center text-gray-400">Don't have an account yet? <Link to="/signup" className="text-blue-500 focus:outline-none focus:underline hover:underline">Sign up</Link>.</p>
        </div>
      </div>
    </div>
  </div>
</div>

    </div>
  )
}

export default Login
