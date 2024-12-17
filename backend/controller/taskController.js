const Task = require('../models/Task');
const asyncHandler = require('express-async-handler');

// Create a new task
const createTask = asyncHandler(async (req, res) => {
    const { title, location, alertType, userId } = req.body;

    if (!title || !location  || !alertType || !userId) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const task = await Task.create({
        title,
        location,
        //radius,
        alertType,
        userId,
    });

    if (task) {
        res.status(201).json(task);
    } else {
        res.status(400);
        throw new Error('Invalid task data');
    }
});

// Get all tasks
const getAllTasks = asyncHandler(async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500);
        throw new Error('Error retrieving tasks');
    }
});

// Get a single task by ID
const getTaskById = asyncHandler(async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500);
        throw new Error('Error retrieving task');
    }
});

// Update a task
const updateTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedTask) {
        res.status(404);
        throw new Error('Task not found');
    }

    res.status(200).json({ message: 'Task updated successfully', updatedTask });
});

// Delete a task
const deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
        res.status(404);
        throw new Error('Task not found');
    }

    res.status(200).json({ message: 'Task deleted successfully' });
});
// Get tasks by user ID
const getTasksByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    try {
        const tasks = await Task.find({ userId });
        if (tasks.length === 0) {
            res.status(404);
            throw new Error('No tasks found for this user');
        }
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500);
        throw new Error('Error retrieving tasks for user');
    }
});

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTasksByUserId,
    
};
