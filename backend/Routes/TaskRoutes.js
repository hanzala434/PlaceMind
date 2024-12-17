const express = require('express');
const router = express.Router();
const {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTasksByUserId
} = require('../controller/taskController');

// Route to create a new task
router.post('/', createTask);

// Route to get all tasks
router.get('/get/', getAllTasks);

// Route to get a task by ID
router.get('/:id', getTaskById);

// Route to update a task by ID
router.put('/:id', updateTask);

// Route to delete a task by ID
router.delete('/:id', deleteTask);

// Route to get tasks by user ID
router.get('/user/:userId', getTasksByUserId);

module.exports = router;
