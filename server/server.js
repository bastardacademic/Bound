require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const app = require('./src/app');
const { setIO } = require('./src/socket');

const PORT = process.env.PORT || 3000;

// --- HTTP + Socket.io server ---
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// --- Socket.io auth middleware ---
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error: no token provided'));
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = payload;
        next();
    } catch (err) {
        next(new Error('Authentication error: invalid token'));
    }
});

// --- Socket.io connection handling ---
io.on('connection', (socket) => {
    console.log('User connected:', socket.id, '| user:', socket.user?.id);

    // Join a personal room so server can target this user directly
    if (socket.user?.id) {
        socket.join('user:' + socket.user.id);
    }

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Make io available to route handlers via src/socket.js (e.g. to push new messages/notifications)
setIO(io);

// --- Start server ---
server.listen(PORT, () => {
    console.log('Bound server running on http://localhost:' + PORT);
});
