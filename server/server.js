const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// Routes
// ... existing code ...
app.use('/api/auth', require('./routes/auth'));
app.use('/api/issues', require('./routes/issues'));
app.use('/api/upload', require('./routes/upload')); // Add this line
// Nested comments route
app.use('/api/issues/:issueId/comments', require('./routes/comments'));
// ... existing code ...


app.get('/', (req, res) => res.send({ ok: true, message: 'Civic-Assist API' }));

const path = require('path');

// Serve frontend build (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
}


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

