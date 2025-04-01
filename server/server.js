const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware for WebSocket authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    // Perform token validation here
    next();
  } else {
    next(new Error('Authentication error'));
  }
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log(\User connected: \\);

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(\User disconnected: \\);
  });
});

// Export io for use in other modules
module.exports = io;
