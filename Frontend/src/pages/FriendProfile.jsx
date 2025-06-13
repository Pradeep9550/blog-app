
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaCameraRetro } from "react-icons/fa";
import UserProfileCard from '../components/UserProfileCard';

import { GoCommentDiscussion } from "react-icons/go";
import { FaHeart } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';

const FriendProfile = (props) => {

    let userStore = useSelector((state)=>state.user);
    let token = useSelector((state)=>state.user.token)
    // console.log(token)
    let original = userStore.user
    // console.log(original)

  let location = useLocation();
  let userId = location.state
//   console.log(userId)

  const [userDetails, setuserDetails] = useState('');
    async function getUserDetails (){
        let res = await axios.get(`http://localhost:5000/api/auth/getSingleUser/${userId}`);
        let data = res.data;
        console.log(data)
        setuserDetails(data.user)
    }

    useEffect(()=>{
        getUserDetails()
    },[userId])
  








    const [userPics, setuserPics] = useState({
      coverPic:"",
      profilePic:""
    });
    console.log(userPics)
    
    const [allPosts, setallPosts] = useState([]);
    const getUserPost = async()=>{
      let res = await axios.get(`http://localhost:5000/api/post/userPost/${userId}`)
      let data = res.data
    //   console.log(data)
      setallPosts(data.posts)
  }

  useEffect(()=>{
      getUserPost()
  },[userId])


  



    const [likesCount, setlikesCount] = useState(0);
    const getLikes = (ans)=>{
        // console.log(ans)
        setlikesCount(ans)
    }

    const handleFollow=async()=>{

      let res = await axios(`http://localhost:5000/api/auth/follow/${userId}`,{
        headers:{
          'Authorization':token
        }
      })

      let data = res.data
    //   console.log(data)
      if(data.success){
        getUserDetails()
        props.getUserDetails()
      }
    }
    
  return (
    <div>
     
      

<div className=" mx-auto w-[90%] bg-white shadow-xl rounded-lg text-gray-900">
  <div className="rounded-t-lg h-64 overflow-hidden relative">
    
    <img className="object-cover object-top w-full" src={ userDetails?.coverPic} alt="Mountain" />
  </div>
  <div className="mx-auto  w-32 h-32 relative -mt-16 border-4 border-white rounded-full ">
  
    <img className="object-cover object-center h-32 rounded-full" src={userDetails?.profilePic} alt="Woman looking front" />
  </div>
  <div className="text-center mt-2">
    <h2 className="font-semibold">{userDetails?.name}</h2>
    <p className="text-gray-500">{userDetails?.bio?userDetails?.bio:'enter a bio'}</p>
  {!original.followings.includes(userId)  && <button onClick={handleFollow} className='bg-green-950 text-white px-3 py-2 rounded-md'>Follow</button>}

   {original.followings.includes(userId) && <button onClick={handleFollow} className='bg-green-950 text-white px-3 py-2 rounded-md'>UnFollow</button>}
   <Link to="/chat" state={{friend:userDetails}} className="bg-blue-950 text-white px-3 py-2 mx-2 rounded-md hover:bg-blue-700">Chat</Link>
  </div>
  <ul className="py-4 mt-2 text-gray-700 flex items-center  justify-around">
    <li className="flex flex-col items-center justify-around">
    <p className='font-bold'>Followings</p>
    <div>{userDetails?.followings?.length}</div>
    </li>
    <li className="flex flex-col items-center -ms-10 justify-between">
     
      <p className='font-bold'>Followers</p>
      <div>{userDetails?.followers?.length}</div>
    </li>
    <li className="flex flex-col items-center justify-around">
     
      <FaHeart size={30} color='red'/>
      <div>{likesCount}</div>
    </li>
  </ul>

</div>

<div className='flex gap-5 mt-4 mx-auto w-[90%]'>


    <div className='w-full'>
      {/* <UserProfileCard getLikes={getLikes}/> */}
    { allPosts.length>0? <div className='w-[100%]'>
      
      {
        allPosts.map((ele)=>{
            return <article className="relative flex bg-white transition hover:shadow-xl mb-4">

                <div className='absolute right-4 top-4'>
                   <span className='flex'> <FaHeart color={ele.likes.includes(userStore.user._id)?'red':''} onClick={()=>handleLike(ele._id)} size={25}/> <sup>{ele.likes.length}</sup></span>
                    <span className='flex mt-6'><GoCommentDiscussion size={25} /> <sub>{ele.comments.length}</sub></span>
                </div>
         
          
            <div className="hidden sm:block sm:basis-56">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1609557927087-f9cf8e88de18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                className="aspect-square h-full w-full object-cover"
              />
            </div>
          
            <div className="flex flex-1 flex-col justify-between">
              <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
                <a href="#">
                  <h3 className="font-bold uppercase text-gray-900">
                    {ele.title}
                  </h3>
                </a>
          
                <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-700">
                 {ele.description}
                </p>
              </div>
          
              <div className="sm:flex sm:items-end sm:justify-end">
                <a
                  href="#"
                  className="block bg-yellow-300 px-5 py-3 text-center text-xs font-bold uppercase text-gray-900 transition hover:bg-yellow-400"
                >
                  Read Post
                </a>
              </div>
            </div>
          </article>
        })
      }
    </div> :<center><h1 className='text-center w-full mt-10 text-6xl'>No Posts To Show Yet</h1></center>}
    </div>
</div>

      
    </div>
  )
}

export default FriendProfile
