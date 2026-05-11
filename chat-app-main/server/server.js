import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRouts.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';

// create an express app and HTTP server  
const app = express();
const server = http.createServer(app);

// Initialise Socket.IO server
export const io = new Server(server, {
  cors: {origin: '*', },
});

// store online users
export const userSocketMap = {}; // { userId: socketId }

// handle socket connections
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId; // get userId from query params
    console.log('User connected:', userId);
    if(userId) {
        userSocketMap[userId] = socket.id; // store the socket id for the user
    }
    // emit online users to all clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log('User disconnected:', userId);
        delete userSocketMap[userId]; // remove the socket id for the user
        // emit online users to all clients
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

// middleware setup
app.use(express.json({limit: '4mb'}));
app.use(cors());

// routes setup
app.use("/api/status", (req, res) => {
  res.send("server is running");
});

app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter)
// connect to database
await connectDB();


if(process.env.NODE_ENV !=="production"){

    const PORT = process.env.PORT || 5000;
    // start the server
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
}


// Export server for Vercel
export default server;