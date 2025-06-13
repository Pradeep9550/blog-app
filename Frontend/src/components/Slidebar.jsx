import React from 'react'
import axios from 'axios';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
const Slidebar = (props) => {

  const [loading, setLoading] = useState(false)

    let userStore = useSelector((state)=>state.user)
  // console.log(userStore.token)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
      };
      
      const handleOk = () => {
        setIsModalOpen(false);
      };
      
      const handleCancel = () => {
        setIsModalOpen(false);
      };

     const [formDetails, setFormDetails] = useState({
        title: '',
        description: '',
        file: []
      
        })
        // console.log(formDetails)

        const handleInputChange = (e)=>{
            let value = e.target.value
            let name = e.target.name
           //  console.log(value,name)
            setFormDetails({...formDetails,[name]:value})
         }
         const handleFileChange =(e)=>{
           let files = e.target.files;
           // console.log(files)
           let filesArr = [...files]
           // console.log(filesArr)
           setFormDetails({...formDetails,file:filesArr})
          
         }

        // using FileReader
        //  const handleInputSubmit =async (e)=>{
        //    e.preventDefault();
        //    // console.log(formDetails.files)
        //    let filesArr = formDetails.file
        //    // console.log(filesArr)
         
        //    function solve(file){
        //      return new Promise((resolve, reject)=>{
         
        //        let reader = new FileReader();
        //        reader.readAsDataURL(file)
        //        reader.onload=()=>{
        //          resolve(reader.result)
        //        }
        //        reader.onerror=()=>{
        //          reject(reader.result)
        //        }
        //      })
        //    }
         
        //    let arr = filesArr.map(async(fileObj)=>{
        //      let x = solve(fileObj)
        //      return x
        //    })
         
        //    // console.log(arr)
        //    let ans = await Promise.all(arr)
        //    .then((ans) => ans)
        //    .catch((ans) =>console.log(ans))
         
        //    // console.log(ans)
         
        //    let modifiedArr = ans.map((ele)=>{
        //       let obj = {};
        //       if(ele.split('/')[0].split(':')[1]==='image'){
        //          obj.url = ele
        //          obj.resource_type = "image"
        //       } else {
        //          obj.url = ele
        //          obj.resource_type = "video"
        //       }
        //      return obj
        //    })
         
        //    // console.log(modifiedArr)
         
        //    let finalArr = {
        //      ...formDetails,
        //      file: modifiedArr
        //    }
        //    console.log(finalArr)
         
          //  let res = await axios.post("http://localhost:5000/api/post/create", finalArr, {
          //    headers: {
          //      'Authorization': userStore.token
          //    }
          //  })
          //  let data = res.data
          //  console.log(data)
          //  if(data.success===true){
          //    setFormDetails({
          //      title: '',
          //      description: '',
          //      file: []
          //    })
          //    setIsModalOpen(false);
          //    props.getAllUserPost();
          //  }
         
           
         
         
           
         
        //    // let dummyArr = ['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD…qBA70QAdEwIQALwgCdkADVAHAIAkhAEEIAAhAHUQBCABKAP/Z', 
        //    // 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21p…AACWpdG9vAAAAHWRhdGEAAAABAAAAAExhdmY1Ny4xOS4xMDA=']
            
        //    // let ans1 = dummyArr.map((ele)=>{
        //    //   console.log(ele)
        //    //   let stringArr = ele.split('/')[0].split(':')[1]
        //    //   console.log(stringArr)
        //    // })
         
         
         
        //  }

        //using cloduinary
         const handleInputSubmit =async (e)=>{
           e.preventDefault();

           setLoading(true)
           // console.log(formDetails.files)
           let filesArr = formDetails.file
           // console.log(filesArr)
         
          
         
           let arr = filesArr.map(async(fileObj)=>{
             let formData = new FormData();
             formData.append('file',fileObj)
             formData.append('upload_preset','TwitterAppProject')   // TwitterAppProject --> preset name from cloduinary
              let res1 = axios.post(`https://api.cloudinary.com/v1_1/pradeepvermacloud/upload`, formData)

              return res1
           })
         
           // console.log(arr)
           let ans = await Promise.all(arr)
           .then((ans) => ans)
           .catch((ans) =>console.log(ans))
         
           console.log(ans)

           let modifiedArr = ans.map((item)=>{
                  let obj = {};
                  obj.url = item.data.secure_url;
                  obj.resource_type = item.data.resource_type
                 return obj
          })
            
          let finalArr = {
            title:formDetails.title,
            description:formDetails.description,
            file:modifiedArr
          }

          let res = await axios.post("http://localhost:5000/api/post/create", finalArr, {
            headers: {
              'Authorization': userStore.token
            }
          })
          let data = res.data
          console.log(data)
          if(data.success===true){
            setFormDetails({
              title: '',
              description: '',
              file: []
            })
            setIsModalOpen(false);
            props.getAllUserPost();
            setLoading(false)
          }
         
         
         }

  return (
    <div className='fixed left-1 top-[90px]'>
      <div>
          {/* <button className='bg-green-400 px-3 py-2 rounded-md'>Create</button> */}
          <Button type="primary" onClick={showModal}>
        Create
      </Button>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {
          loading===true? "loading" : <form action="" className='flex flex-col'>
          <label className='mb-2' htmlFor="">Title</label>
          <input value={formDetails.title} name='title' onChange={handleInputChange} type="text" className='outline-none border my-2 border-gray-400 py-2 px-4 rounded-md bg-white'/>
          <label className='mb-2' htmlFor="">Description</label>
          
          <textarea value={formDetails.description} name='description' onChange={handleInputChange} className='outline-none border my-2 border-gray-400 py-2 px-4 rounded-md bg-white'  id=""></textarea>
          <label className='mb-2 py-2 px-4 bg-amber-800 w-max text-white rounded-md hover:bg-amber-700' htmlFor="file">Image/Video</label>
              <input multiple onChange={handleFileChange} id='file' hidden className='outline-none border my-2 border-gray-400 py-2 px-4 text-white rounded-md' type="file" />
              <div className='flex gap-5 justify-center'>
                {
                  formDetails.file.map((ele, index)=>{
                    return ele.type.split("/")[0] === "image"? <img key={index} className='h-32 w-32' src={URL.createObjectURL(ele)} alt="" /> : <video key={index} className='h-32 w-32' src={URL.createObjectURL(ele)}></video>
                  })
                }
              </div>
          <button onClick={handleInputSubmit} className='bg-sky-950 py-2 px-4 rounded-md text-white hover:bg-sky-700'>Submit Post</button>
        </form>
        }
      </Modal>
        </div>
    </div>
  )
}

export default Slidebar
