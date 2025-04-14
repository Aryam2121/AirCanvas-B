const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const authRoutes = require('./Routes/auth.routes');

const app = express();
app.use(cors());
app.use(express.json()); // Make sure to parse JSON request bodies

// Apply routes globally before WebSocket handler
app.use('/api/auth', authRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('draw', (data) => {
    socket.broadcast.emit('draw', data); // send to all except sender
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(4000, () => console.log('WebSocket Server running on port 4000'));
