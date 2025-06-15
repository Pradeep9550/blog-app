import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../store/UserSlice'
import axios from 'axios'
import Slidebar from './Slidebar.jsx'

const Navbar = () => {
  const dispatch = useDispatch()
  const userStore = useSelector((state) => state.user)
  const login = userStore.login

  const [searchUsers, setsearchUsers] = useState([])

  const handleSearchChanger = async (e) => {
    let value = e.target.value
    let res = await axios.get(`https://blog-app-backend-ianr.onrender.com/api/auth/search?q=${value}`)
    let data = res.data
    setsearchUsers(data.users)
  }

  const handleLinkClick = () => {
    setsearchUsers([])
  }

  return (
    <nav className="bg-white fixed z-50 top-0 left-0 right-0 border-b border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3">
          <span className="text-2xl font-semibold dark:text-white">BlogApp</span>
        </Link>


         <div className=" flex-row z-50 hidden lg:flex   group-hover:flex w-64 bg-white  border border-gray-200 rounded shadow-md dark:bg-gray-800 dark:border-gray-600">
              {login && (
                <>
                  <Link
                    to="/"
                    className=" text-sm text-gray-800  p-2 rounded dark:text-white "
                  >
                    Home
                  </Link>
                  <div className="relative">
                    <input
                      type="text"
                      onChange={handleSearchChanger}
                      className="w-full pl-10 py-2 text-sm border rounded outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      placeholder="Search a friend..."
                    />
                    {searchUsers.length > 0 && (
                      <div className="absolute top-full mt-1 w-full bg-white text-black z-40 rounded shadow dark:bg-gray-700">
                        {searchUsers.map((ele) =>
                          ele._id !== userStore?.user?._id ? (
                            <Link
                              key={ele._id}
                              onClick={handleLinkClick}
                              state={ele._id}
                              to="/friendProfile"
                              className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              <img className="w-8 h-8 rounded-full" src={ele.profilePic} alt={ele.name} />
                              <p className="text-sm dark:text-white">{ele.name}</p>
                            </Link>
                          ) : null
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <div className="relative group">
            <button className="flex text-sm bg-gray-800 rounded-full focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600">
              {login ? (
                <img className="w-8 h-8 rounded-full" src={userStore.user.profilePic} alt="user" />
              ) : (
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
                  alt="default"
                />
              )}
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 mt-2 z-50 hidden group-hover:block bg-white border rounded shadow-lg dark:bg-gray-800 dark:border-gray-700">
              {login && (
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">{userStore.user.name}</span>
                  <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{userStore.user.email}</span>
                </div>
              )}
              <ul className="py-2">
                {login && (
                  <li>
                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">
                      Profile
                    </Link>
                  </li>
                )}
                {!login && (
                  <>
                    <li>
                      <Link to="/signup" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">
                        Signup
                      </Link>
                    </li>
                    <li>
                      <Link to="/login" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">
                        Log in
                      </Link>
                    </li>
                  </>
                )}
                {login && (
                  <li>
                    <button
                      onClick={() => dispatch(logout())}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                    >
                      Log out
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Three-dot Hover Menu */}
          <div className="relative md:hidden group">
            <button className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>

            {/* Hover Dropdown on 3-dot */}
            <div className="absolute right-0 mt-2 z-50 hidden  group-hover:flex flex-col w-56 bg-white p-4 border border-gray-200 rounded shadow-md dark:bg-gray-800 dark:border-gray-600">
              {login && (
                <>
                  <Link
                    to="/"
                    className="mb-2 text-sm text-gray-800 hover:bg-gray-100 p-2 rounded dark:text-white dark:hover:bg-gray-700"
                  >
                    Home
                  </Link>
                  <div className="relative">
                    <input
                      type="text"
                      onChange={handleSearchChanger}
                      className="w-full px-4 py-2 text-sm border rounded outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      placeholder="Search a friend..."
                    />
                    {searchUsers.length > 0 && (
                      <div className="absolute top-full mt-1 w-full bg-white text-black z-40 rounded shadow dark:bg-gray-700">
                        {searchUsers.map((ele) =>
                          ele._id !== userStore?.user?._id ? (
                            <Link
                              key={ele._id}
                              onClick={handleLinkClick}
                              state={ele._id}
                              to="/friendProfile"
                              className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              <img className="w-8 h-8 rounded-full" src={ele.profilePic} alt={ele.name} />
                              <p className="text-sm dark:text-white">{ele.name}</p>
                            </Link>
                          ) : null
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
              <div className=' lg:hidden'>
        <Slidebar  />
        </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar