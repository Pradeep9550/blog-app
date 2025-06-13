import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async(req,res)=>{
  let sender = req.user._id;
  const {receiverId} = req.params
  const {text} = req.body;

 try {
    let conversation = await Conversation.findOne({ members: { $all: [sender, receiverId] } })
   
    if(!conversation){
       conversation = await Conversation.create({
           members:[sender,receiverId]
       })
    }

    let message = await Message.create({
        sender:sender,
        receiver:receiverId,
        text
    })
    conversation.messages.push(message._id)
    await conversation.save();

    res.json({msg:"msg send successfully",success:true, conversation})
 } catch (error) {
    res.json({msg:"error in sending message",success:false, error:error.message})
 }

}

export const getConversation = async (req, res) => {
  let userId = req.user._id;
  const { recieverId } = req.params


  try {
    let conversation = await Conversation.findOne({ members: { $all: [userId, recieverId] } }).populate({ path: 'members', select: ['name', 'profilePic'] }).populate('messages').select('text');
    if (conversation) {

      res.json({ msg: "chat fetched successfully", success: true, chat: conversation.messages })
    }
    else {
      res.json({ msg: "no chat found", success: true, chat: [] })
    }
  } catch (error) {
    res.json({ msg: "error in getting chat", success: false, error: error.message })
  }


  // const messages = await Message.find({sender:userId ,reciever:recieverId});
  // res.json({msg:messages,userId,recieverId})
}