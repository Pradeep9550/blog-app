import axios from 'axios';
import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify';

const ForgetPassword = () => {

    const [msg, setMsg] = useState('');
    let emailRef = useRef();

    const handleSubmit =async ()=>{
       let value  = emailRef.current.value;
       console.log(value)
       let res = await axios.post('https://blog-app-backend-ianr.onrender.com/api/auth/resetPassword',{email:value})
       let data = res.data;
       console.log(data)
       setMsg(data.msg)
    }
  return (
    <>
        <h1 className='text-2xl mt-28 w-max mx-auto'>{msg}</h1>
        <div className='dark:bg-slate-700 px-5 py-3 rounded-md-20 mt-40 w-max mx-auto'>
      
      <h1 className='text-white mb-3'>Forget Password Page</h1>
     <input ref={emailRef} className='px-3 py-2 rounded-md' type="text" placeholder='Enter Your Email' />
     <button onClick={handleSubmit} className='bg-green-950 text-white px-3 py-2 rounded-md ml-5'>Submit</button>
   </div>
    </>
  )
}

export default ForgetPassword
