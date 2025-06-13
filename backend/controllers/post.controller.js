import { Post } from "../models/post.model.js";

export const createPost =async (req,res)=>{
    const {title, description , file} = req.body;
    let id = req.user._id

    try {
        let post = await Post.create({
            title,
            description,
            file,
            userId:id
        })
        res.json({msg: "post created successfully",success:true})
    } catch (error) {
        res.json({msg: "Error in creating post", success:false,error:error.message})
    }
}

export const getAllPost =async (req, res)=>{
   try {
    let post  = await Post.find().populate({path:'userId', select:['name','profilePic']}).populate({path:'comments',populate:{path:'user',select:['name','profilePic']}});
    res.json({msg: "fetched successfully",success:true,post})
   } catch (error) {
    res.json({msg: "Error in geting all post",success:false,error:error.message})
   }
}

export const getUserPost =async(req,res)=>{
let {userId} = req.params;

try {
    let posts = await Post.find({userId});
    // console.log(posts)
    res.json({msg:"post fetched successfully", success:true,posts})
} catch (error) {
    res.json({msg: "error in getting posts", success: false,error:error.message})
}
}

export const likePost =async (req, res)=>{
      const {postId} = req.params
      let userId = req.user._id
      try {
        let post = await Post.findById(postId)
        if(post.likes.includes(userId)){
            post.likes.pull(userId)
            await post.save();
            return res.json({msg: "post dislike successfully"})
        }
        else {
            post.likes.push(userId)
            await post.save();
            return res.json({msg: "post like successfully", success:true})
        }
      } catch (error) {
        res.json({msg: "error in like post", success:false,error:error.message})
      }
}

export const commentPost =async (req, res)=>{
    const {postId} = req.params
    const userId = req.user._id
    const {text} = req.body

    try {
        let post = await Post.findById(postId)
        post.comments.push({user:userId, text:text});
        await post.save();
        
        res.json({msg: "post commented successfully", success: true})
    } catch (error) {
        res.json({msg: "error in comment post", success:false,error:error.message})
    }
}