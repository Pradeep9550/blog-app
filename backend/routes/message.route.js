import express from "express";
import { checkToken } from "../middleware/checkToken.js";
import { getConversation, sendMessage } from "../controllers/messsage.controller.js";

const router = express.Router();

router.post('/send/:receiverId', checkToken,sendMessage)
router.get('/getMessages/:receiverId',checkToken,getConversation)


export default router