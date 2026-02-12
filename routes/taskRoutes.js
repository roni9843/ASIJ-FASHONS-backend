const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTaskById, updateTaskProgress, updateTask, deleteTask, updateTaskHistory, deleteTaskHistory } = require('../controllers/taskController');

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask); // Update main task details
router.put('/:id/progress', updateTaskProgress); // Update progress/payments
router.put('/:taskId/history/:historyId', updateTaskHistory); // Update history entry
router.delete('/:taskId/history/:historyId', deleteTaskHistory); // Delete history entry
router.delete('/:id', deleteTask);

module.exports = router;
