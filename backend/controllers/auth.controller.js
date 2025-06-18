import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import randomstring from "randomstring";
import nodemailer from 'nodemailer'
const salt = bcrypt.genSaltSync(10)
const JWT_SECRET = "hello12345"

export const signup =async (req, res)=>{
   const {name, email, password, address} = req.body;

   if(!name) {
    return res.json({msg:"name is required", success:false})
   }
   if(!email) {
    return res.json({msg:"email is required", success:false})
   }
   if(!password) {
    return res.json({msg:"password is required", success:false})
   }

   let existingUser =await User.findOne({email})
   
   
   if (existingUser) {
    return res.json({msg:"user already registered",success:false})
   } else {
    try {
        
        let hashedpassword = bcrypt.hashSync(password, salt)
        let data = await User.create({
            name,
            email,
            password:hashedpassword,
            address
        })
        res.json({msg:"user registered successfully",success:true,data})
    } catch (error) {
        res.json({msg:'error in creating user',success:false,error:error.message})
    }
   }



   
   
}




export const login =async (req, res)=>{
   const {email, password} = req.body;

   try {
    let existingUser =await User.findOne({email});
    if (existingUser) {
     let comparePassword = bcrypt.compareSync(password, existingUser.password)
     if (comparePassword) {
        let token = jwt.sign({ _id:existingUser._id,email:existingUser.email}, JWT_SECRET);
        res.json({msg:"user logged in successfully",success:true,token})
     } else {
         return res.json({msg:"wrong password", success:false})
     }
    } else {
     return res.json({msg:"user not found", success: false})
    }
 }
   catch (error) {
    res.json({msg:"Error in login user", success:false, error:error.message})
   }
 }



export const update =async (req, res)=>{
    const {name, password, profilePic,coverPic,bio} = req.body;
    let userId = req.params._id

    if(password){
        var hashedpassword = bcrypt.hashSync(password, salt)
    }

    let data = await User.findByIdAndUpdate(userId,{$set:{name,password:hashedpassword,profilePic,coverPic,bio}}, {new:true})
    res.json({msg:"user updated successfully",success:true, user:data})
    
}
  
export const deleteUser = async(req,res)=>{
   


    try {
        let paramId = req.params._id;

    let userId = req.user._id // this is get from token

    console.log("logged in userId = ", userId)
    console.log("user id you want to delete  = ", paramId)

    if(userId===paramId){
        console.log("you can delete")
        let data = await User.findByIdAndDelete(userId)
        res.json({msg:"user deleted successfully",success:true})
    }
    else{
        console.log("you can delete only your account")
        res.json({msg:"not autherized to delete this account",success:false})
    }
    } catch (error) {
        res.json({msg:"error in deleting user",success:false ,error:error.message})
    }   

}


export const getUserDetails =async (req, res)=>{
    let userId = req.user._id;
    try {
        let user = await User.findById(userId).select('-password');
        res.json({msg: "user fetched successfully",success:true,user})
    } catch (error) {
        res.json({msg: "Error in getUserDetail", success: false})
    }
}

  export const resetPassword = async(req,res)=>{
    const {email}= req.body;
    let user = await User.findOne({email});
    if(user){
        let reset_token = randomstring.generate(20);
        let date = Date.now();
        user.resetToken = reset_token;
        user.resetTokenValidity = date
        await user.save()
        let msgSent =await sendMail(email,reset_token)
        res.json({msg:"please check your email for password reset"})
    }
    else{
        return res.json({msg:"user not found",success:false}) 
    }
}

async function sendMail(email,reset_token){
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: "pradeep961677@gmail.com",
          pass: "ydme qamu dhpy qsme",
        },
      });

     
        
        const info = await transporter.sendMail({
          from: 'pradeep961677@gmail.com', // sender address
          to: email, // list of receivers
          subject: "Password reset request", // Subject line
         text: `Please click the link below to choose a new password: \n https://blog-app-backend-ianr.onrender.com/api/auth/forgetPassword/${reset_token}`
        });

}

export const forgetPassword =async (req, res)=>{
    let resetToken = req.params.resetToken
    console.log(resetToken)
    let user = await User.findOne({resetToken:resetToken})
    let tokenDate = user.resetTokenValidity;
    let currentDate = Date.now();
    let timeDifference = currentDate - tokenDate
    console.log(timeDifference)
    let timeInHour = timeDifference / (60*60*1000)
    console.log("time in Hour = ",timeInHour)
    if(timeInHour > 24){
        return res.send("token expired! token is valid only for 1 day")
    }
    

    if(user){
        res.render('forgetPassword',{resetToken})
    } else {
        res.send("token expired")
    }

}

export const updatePassword =async (req, res)=>{
    let resetToken = req.params.resetToken;
    let password = req.body.updatedPassword

   try {
   let user =await User.findOne({resetToken});
   if(user){
    let hashedpassword = bcrypt.hashSync(password, salt);
    user.password = hashedpassword
    user.resetToken= null
    await user.save();
    res.json({msg: "password updated successfully", success:true})
   } else {
    res.json({msg: "token expired", success: false})
   }

   } catch (error) {
    res.json({msg:"Error in updating password"})
   }
}


export const searchUser = async(req,res)=>{
    console.log(req.query)
    let {q} =  req.query;

    if(q.length>0){
        let regex  = new RegExp(q,'i');
        let users = await User.find({name:regex}).select('name profilePic');
        res.json({msg:"fetched successfully",success:true,users})
    }
    else{
        res.json({msg:"no user found",success:false})
    }
    console.log(q)

    
}

export const getSingleUser = async(req, res)=>{
   let _id = req.params._id
   try {
    let user = await User.findById(_id).select('-password')
    res.json({msg:"user get successfully",success:true,user})
   } catch (error) {
    res.json({msg:"error in getting user",success:false})
   }
}

export const followUser = async(req,res)=>{
    let userId = req.user._id;
    let {friendId} = req.params;

  try {
    let user = await User.findById(userId);
    let friend = await User.findById(friendId);


    if(!user.followings.includes(friendId)){
        user.followings.push(friendId);
        friend.followers.push(userId)
        await user .save()
        await friend.save();
        res.json({msg:"user followed successfully",success:true})
    }
    else{
        user.followings.pull(friendId);
        friend.followers.pull(userId)
        await user .save()
        await friend.save();
        res.json({msg:"user unfollowed successfully",success:true})
    }

  } catch (error) {
    res.json({msg:"error in follow user", success:false})
  }

}
