import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../store/UserSlice'
import Slidebar from "./Slidebar.jsx"
import axios from 'axios'
import { Button, Modal, Dropdown } from 'antd'

const Navbar = () => {

  const dispatch = useDispatch();
  const userStore = useSelector((state) => state.user);
  const login = userStore.login;

  const [loading, setLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formDetails, setFormDetails] = useState({
    title: '',
    description: '',
    file: []
  })
  const [searchUsers, setsearchUsers] = useState([]);

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    let value = e.target.value
    let name = e.target.name
    setFormDetails({ ...formDetails, [name]: value })
  }

  const handleFileChange = (e) => {
    let filesArr = [...e.target.files]
    setFormDetails({ ...formDetails, file: filesArr })
  }

  const handleInputSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    let filesArr = formDetails.file
    let arr = filesArr.map(async (fileObj) => {
      let formData = new FormData();
      formData.append('file', fileObj)
      formData.append('upload_preset', 'TwitterAppProject')
      let res1 = axios.post(`https://api.cloudinary.com/v1_1/pradeepvermacloud/upload`, formData)
      return res1
    })
    let ans = await Promise.all(arr).then((ans) => ans).catch((ans) => console.log(ans))
    let modifiedArr = ans.map((item) => {
      return {
        url: item.data.secure_url,
        resource_type: item.data.resource_type
      }
    })
    let finalArr = {
      title: formDetails.title,
      description: formDetails.description,
      file: modifiedArr
    }
    let res = await axios.post("https://blog-app-backend-ianr.onrender.com/api/post/create", finalArr, {
      headers: {
        'Authorization': userStore.token
      }
    })
    let data = res.data
    if (data.success === true) {
      setFormDetails({ title: '', description: '', file: [] })
      setIsModalOpen(false);
      setLoading(false)
    }
  }

  const handleSearchChanger = async (e) => {
    let value = e.target.value
    let res = await axios.get(`https://blog-app-backend-ianr.onrender.com/api/auth/search?q=${value}`);
    let data = res.data;
    setsearchUsers(data.users)
  }

  const handleLinkCLick = () => setsearchUsers([])

  const handleLogout = () => {
    dispatch(logout());
  }

  const items = [
    {
      key: '1',
      label: (
        <Link to="/profile" className='block px-4 py-2'>Profile</Link>
      )
    },
    {
      key: '2',
      label: (
        <button onClick={handleLogout} className='w-full text-left block px-4 py-2'>Logout</button>
      )
    }
  ];

  return (
    <div>
      <nav className=" fixed z-50 top-0 left-0 right-0 border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">BlogApp</span>
          </Link>

          <div className="flex   items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <Dropdown
              menu={{ items }}
              placement="bottomRight"
              arrow
            >
              <button type="button" className="flex  text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
                <span className="sr-only">Open user menu</span>
                {login === true ? <img className="w-8 h-8 rounded-full" src={userStore.user.profilePic} alt="user" /> :
                  <img className="w-8 h-8 rounded-full" src="https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg" alt="" />}
              </button>
            </Dropdown>

            <button data-collapse-toggle="navbar-user" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 17 14" xmlns="http://www.w3.org/2000/svg">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
          </div>

          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:items-center md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {login === true && <li><Link to="/" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500">Home</Link></li>}
              {login === true && <li className='relative'>
                <input type="text" onChange={handleSearchChanger} className='px-4 py-2 m-1 rounded-md outline-none border-2 border-gray-400' placeholder='search a friend...' />
                <Button type="primary" className=' lg:hidden md:hidden' onClick={showModal}>Create</Button>
                <Modal title="Create Post" open={isModalOpen} onCancel={handleCancel} footer={null}>
                  {loading === true ? "loading" : <form className='flex flex-col'>
                    <label className='mb-2'>Title</label>
                    <input value={formDetails.title} name='title' onChange={handleInputChange} type="text" className='outline-none border my-2 border-gray-400 py-2 px-4 rounded-md bg-white' />
                    <label className='mb-2'>Description</label>
                    <textarea value={formDetails.description} name='description' onChange={handleInputChange} className='outline-none border my-2 border-gray-400 py-2 px-4 rounded-md bg-white'></textarea>
                    <label htmlFor="file" className='mb-2 py-2 px-4 bg-amber-800 w-max text-white rounded-md hover:bg-amber-700'>Image/Video</label>
                    <input multiple onChange={handleFileChange} id='file' hidden type="file" />
                    <div className='flex gap-5 justify-center'>
                      {formDetails.file.map((file, index) => {
                        const type = file.type.split("/")[0];
                        const url = URL.createObjectURL(file);
                        return type === "image" ? <img key={index} className='h-32 w-32' src={url} alt="preview" /> : <video key={index} className='h-32 w-32' src={url} controls></video>
                      })}
                    </div>
                    <button onClick={handleInputSubmit} className='bg-sky-950 py-2 px-4 mt-4 rounded-md text-white hover:bg-sky-700'>Submit Post</button>
                  </form>}
                </Modal>
                <div className='absolute top-full mt-1 w-full bg-white text-black'>
                  {searchUsers?.map((ele) => {
                    return ele._id !== userStore?.user?._id && <Link key={ele._id} onClick={handleLinkCLick} state={ele._id} to={'/friendProfile'} className='flex items-center gap-5 mt-3 p-2 cursor-pointer'>
                      <img className='w-10 h-10 rounded-full' src={ele.profilePic} alt="" />
                      <p>{ele.name}</p>
                    </Link>
                  })}
                </div>
              </li>}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar










