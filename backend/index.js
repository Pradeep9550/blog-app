import express from "express";
import Dotenv  from "dotenv";
const app = express();

import { connectDB } from "./db.js";
import cors from 'cors';

import { Server } from 'socket.io';
import http from 'http';
const server = http.createServer(app);
const io = new Server(server);

import authRoutes from "./routes/auth.route.js"
import postRoutes from "./routes/post.router.js"
import messageRoutes from "./routes/message.route.js"
Dotenv.config();


const PORT = process.env.PORT 


app.use(cors({
  origin: 'https://blog-app-ruddy-eight.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));



app.set('view engine', 'ejs')

app.use(express.json({limit:"50mb"}))    //data come in json form
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/message",messageRoutes);


// Socket.io
let user = new Map();

function addUser(userId, socketId) {
    if(!user.has(userId)) {
        user.set(userId, socketId)
    }
    return user;
}

function removeUser() {
    for (const [userId, id] of user.entries()) {
        if(id===socketId) {
            user.delete(userId) 
                break;
            }
        }
}

io.on('connection', (socket)=>{
  console.log("A user connected: ",socket.id);

  socket.on('addUser', (userId)=>{
    console.log("User joined with ID: ", userId)
    addUser(userId, socket.id);
    console.log("current users: ", Array.from(user.entries()))
  });

  socket.on('sendMessage', ({text, sender, receiver})=>{
        console.log(`Message: ${text}, Sender: ${sender}, Receiver: ${receiver}`)

        if(user.has(receiver)) {
            const socketId = user.get(receiver);
            io.on(socketId).emit('getMessage', {sender, text})
        }
  });

  socket.on('disconnect', ()=>{
    console.log("User disconnected: ", socket.id);
    removeUser(socket.id)
    console.log("Updated user map: ", Array.from(user.entries()))
  });
});


server.listen(process.env.PORT ,()=>{
    console.log(`server run on port ${process.env.PORT}`)
    connectDB();
    
})

