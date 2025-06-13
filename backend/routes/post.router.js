import express from "express";
import { commentPost, createPost, getAllPost, getUserPost, likePost } from "../controllers/post.controller.js";
const router = express.Router();
import {checkToken} from '../middleware/checkToken.js'

router.post('/create',checkToken , createPost)
router.get('/getAllPost', getAllPost)
router.get('/userPost/:userId',getUserPost)
router.get('/likes/:postId',checkToken, likePost)
router.post('/comments/:postId', checkToken, commentPost)

export default router