const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { createTaskValidation, updateTaskValidation } = require('../validations/taskValidation');

router.use(protect);  // Protect all routes below

router.post('/', createTaskValidation, createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTaskValidation, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
