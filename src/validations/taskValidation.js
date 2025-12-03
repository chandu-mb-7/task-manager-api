const { body } = require('express-validator');
const { PRIORITIES, STATUSES } = require('../utils/constants');

const createTaskValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('priority').optional().isIn(PRIORITIES).withMessage('Invalid priority'),
    body('status').optional().isIn(STATUSES).withMessage('Invalid status')
];

const updateTaskValidation = [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('priority').optional().isIn(PRIORITIES).withMessage('Invalid priority'),
    body('status').optional().isIn(STATUSES).withMessage('Invalid status')
];

module.exports = { createTaskValidation, updateTaskValidation };
