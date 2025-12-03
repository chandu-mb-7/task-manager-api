const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Task Management API is running' });
});

app.use('/users', authRoutes);
app.use('/tasks', taskRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
