const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// POST /tasks
const createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priority, status } = req.body;

    try {
        const task = await Task.create({
            title,
            description,
            priority,
            status,
            userId: req.user._id
        });

        return res.status(201).json(task);
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// GET /tasks
// /tasks?status=&priority=&sortBy=priority|createdAt&sortOrder=asc|desc&page=1&limit=10
const getTasks = async (req, res) => {
    try {
        const { status, priority, sortBy, sortOrder, page = 1, limit = 10 } = req.query;

        const query = { userId: req.user._id };

        if (status) query.status = status;
        if (priority) query.priority = priority;

        // Sorting
        let sort = {};
        if (sortBy) {
            const order = sortOrder === 'asc' ? 1 : -1;
            if (['priority', 'createdAt'].includes(sortBy)) {
                sort[sortBy] = order;
            }
        } else {
            sort.createdAt = -1; // default: latest first
        }

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;

        const [tasks, total] = await Promise.all([
            Task.find(query).sort(sort).skip(skip).limit(limitNum),
            Task.countDocuments(query)
        ]);

        return res.json({
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            limit: limitNum,
            data: tasks
        });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// GET /tasks/:id
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        return res.json(task);
    } catch (err) {
        return res.status(400).json({ message: 'Invalid task id', error: err.message });
    }
};

// PUT /tasks/:id
const updateTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const { title, description, priority, status } = req.body;

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (priority !== undefined) task.priority = priority;
        if (status !== undefined) task.status = status;

        const updated = await task.save();
        return res.json(updated);
    } catch (err) {
        return res.status(400).json({ message: 'Invalid task id', error: err.message });
    }
};

// DELETE /tasks/:id
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        return res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        return res.status(400).json({ message: 'Invalid task id', error: err.message });
    }
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
};
