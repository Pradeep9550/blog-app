import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema({
    title:{
        type:String
    },
    description:{
        type:String,
    },
    file:[],
    userId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{timestamps:true})

postSchema.add({
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            user :{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            text: {
                type: String
            }
        }
    ]
})

export const Post = mongoose.model("Post", postSchema);

