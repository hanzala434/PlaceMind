import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API}/api/tasks`;

// Fetch all tasks
const getAllTasks = async () => {
    const res = await axios.get(`${API_URL}/get`);
    return res.data;
};

// Fetch tasks by user ID
const getTasksByUserId = async (userId) => {
    const res = await axios.get(`${API_URL}/user/${userId}`);
    return res.data;
};

// Fetch a single task by ID
const getTaskById = async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
};

// Add a new task
const addTask = async (taskData) => {
    console.log(taskData);
    const res = await axios.post(`${API_URL}/`, taskData);
    return res.data;
};

// Update a task
const updateTask = async (id, updates) => {
    const res = await axios.put(`${API_URL}/${id}`, updates);
    return res.data;
};

// Delete a task by ID
const deleteTask = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return { id };
};

const taskService = {
    getAllTasks,
    getTasksByUserId,
    getTaskById,
    addTask,
    updateTask,
    deleteTask,
};

export default taskService;
