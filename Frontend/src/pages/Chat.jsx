import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'
import { io } from "socket.io-client";

const Chat = () => {
  const Endpoint = "https://blog-app-backend-ianr.onrender.com"
  let socket = io(Endpoint, { transports: ['websocket'] });


  let userStore = useSelector((state) => state.user)
  let token = userStore.token
  // console.log(token)
  let user = userStore.user;
  // let token 
  console.log(user)
  let location = useLocation();

  let friend = location.state.friend
  console.log(friend)

  const [allChat, setallChat] = useState([]);


  console.log(allChat)
  async function getChat() {
    let res = await axios.get(`https://blog-app-backend-ianr.onrender.com/api/message/getMessages/${friend._id}`, {
      headers: {
        'Authorization': token
      }
    })

    let data = res.data;
    // console.log(data)
    if (data.success) {
      setallChat(data.chat)
    }
  }

  useEffect(() => {
    getChat()
  }, [])

  const [currentMessage, setcurrentMessage] = useState("");

  const handleInputChanger = (e) => {
    let value = e.target.value
    setcurrentMessage(value)
  }

  const handleSendMessage = async () => {
    // socket.emit('addUser',user._id)
    socket.emit('sendMessage', {
      text: currentMessage,
      sender: user._id,
      reciever: friend._id
    })

    console.log("running")
    console.log(currentMessage)

    let res = await axios.post(`https://blog-app-backend-ianr.onrender.com/api/message/send/${friend._id}`, { text: currentMessage }, {
      headers: {
        'Authorization': token
      }
    })

    let data = res.data
    console.log(data)
    setcurrentMessage("")
    if (data.success) {
      getChat()
    }
  }


  useEffect(() => {


    if (user?._id) {
      socket.emit('addUser', user._id)
    }
  }, [Endpoint, user._id])


  const [arrivalMessage, setarrivalMessage] = useState(null);
  console.log(arrivalMessage)
  
  useEffect(() => {
    socket.on('getMessage', ({ sender, text }) => {
      console.log(text)
      console.log("allChat = ", allChat)
      setarrivalMessage({ sender: sender, reciever: user._id, text: text, createdAt: Date.now() })
      // setallChat([...allChat,{sender:sender, reciever:user._id,text:text,createdAt:Date.now()}])
    })
  }, [handleSendMessage])

  useEffect(() => {
    if (arrivalMessage) {
      setallChat([...allChat, arrivalMessage])
    }
  }, [arrivalMessage])

  return (
    <div>
      

      <div className="flex h-[88.5vh] antialiased text-gray-800">
        <div className="flex flex-row h-full w-full overflow-x-hidden">
        
          <div className="flex flex-col flex-auto h-full p-6">
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
              <div className="flex flex-col h-full overflow-x-auto mb-4">
                <div className="flex flex-col h-full">
                  <div className="grid grid-cols-12 gap-y-2">

                    {
                      allChat.map((ele) => {
                        return ele.sender === user._id ? <div className="col-start-6 col-end-13 p-3 rounded-lg">
                          <div className="flex items-center justify-start flex-row-reverse">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                              {/* {user.name[0]} */}
                              <img src={user.profilePic} className='w-10 h-10 rounded-full' alt="" />
                            </div>
                            <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                              <div>{ele.text}</div>
                            </div>
                          </div>
                        </div>
                          :

                          <div className="col-start-1 col-end-8 p-3 rounded-lg">
                            <div className="flex flex-row items-center">
                              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                {/* {friend.name[0]} */}
                                <img src={friend.profilePic} className='w-10 h-10 rounded-full' alt="" />
                              </div>
                              <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                <div>{ele.text}</div>
                              </div>
                            </div>
                          </div>
                      })
                    }








                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                <div>
                  <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                </div>
                <div className="flex-grow ml-4">
                  <div className="relative w-full">
                    <input type="text" value={currentMessage} onChange={handleInputChanger} className="flex text-white w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10" />
                    <button className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="ml-4">
                  <button onClick={handleSendMessage} className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
                    <span>Send</span>
                    <span className="ml-2">
                      <svg className="w-4 h-4 transform rotate-45 -mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Chat
