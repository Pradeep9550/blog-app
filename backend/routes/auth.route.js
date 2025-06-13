import express from "express";
import { deleteUser, followUser, forgetPassword, getSingleUser, getUserDetails, login, resetPassword, searchUser, signup, update, updatePassword } from "../controllers/auth.controller.js";
import { checkToken } from "../middleware/checkToken.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/update/:_id", update)
router.delete("/delete/:_id",checkToken, deleteUser)
router.get('/getuser',checkToken, getUserDetails)
router.post('/resetPassword', resetPassword)
router.get('/forgetPassword/:resetToken',forgetPassword)  //resetToken is a variable
router.post('/forgetPassword/:resetToken', updatePassword) 
router.get('/search', searchUser)
router.get('/getSingleUser/:_id',getSingleUser)
router.get('/follow/:friendId',checkToken, followUser)

export default router