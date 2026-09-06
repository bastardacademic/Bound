require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();

// --- Middleware ---
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.use('/api/user',          require('./routes/user'));
app.use('/api/auth',          rateLimiter, require('./routes/auth'));
app.use('/api/2fa',           rateLimiter, require('./routes/twoFactor'));
app.use('/api/posts',         require('./routes/posts'));
app.use('/api/posts',         require('./routes/reactions'));
app.use('/api/posts',         require('./routes/comments'));
app.use('/api/groups',        require('./routes/groups'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/notification-preferences', require('./routes/notification-preferences'));
app.use('/api/profile',       require('./routes/profile'));
app.use('/api/feeds',         require('./routes/feeds'));
app.use('/api/events',        require('./routes/events'));
app.use('/api/moderation',    require('./routes/moderation'));
app.use('/api/consent',       require('./routes/consent'));
app.use('/api/privacy',       require('./routes/privacy'));
app.use('/api/messages',      require('./routes/messages'));
app.use('/api/feedback',      require('./routes/feedback'));
app.use('/api/analytics',     require('./routes/analytics'));
app.use('/api/polls',         require('./routes/polls'));
app.use('/api/tags',          require('./routes/tags'));
app.use('/api/preferences',   require('./routes/preferences'));
app.use('/api/password',      rateLimiter, require('./routes/password'));
app.use('/api/discovery',     require('./routes/discovery'));
app.use('/api/karma',         require('./routes/karma'));
app.use('/api/refresh',       require('./routes/refresh'));
app.use('/api/i18n',          require('./routes/i18n'));
app.use('/api',               require('./routes/protected'));

// --- Health check ---
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// --- 404 handler ---
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// --- Global error handler ---
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
