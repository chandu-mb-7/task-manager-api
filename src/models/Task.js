const mongoose = require('mongoose');
const { PRIORITIES, STATUSES } = require('../utils/constants');

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        priority: {
            type: String,
            enum: PRIORITIES,
            default: 'Medium'
        },
        status: {
            type: String,
            enum: STATUSES,
            default: 'Pending'
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
