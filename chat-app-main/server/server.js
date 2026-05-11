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

const allowedOrigins = [
  "https://chat-app-ruddy-tau-67.vercel.app",
  /https:\/\/chat-app.*\.vercel\.app$/,
];

// Initialise Socket.IO server
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// store online users
export const userSocketMap = {};

// handle socket connections
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log('User connected:', userId);
    if(userId) {
        userSocketMap[userId] = socket.id;
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log('User disconnected:', userId);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

// middleware setup
app.use(express.json({limit: '4mb'}));
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// routes setup
app.use("/api/status", (req, res) => {
  res.send("server is running");
});

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// connect to database
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;