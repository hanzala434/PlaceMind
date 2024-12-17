import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from './taskService';

const initialState = {
    tasks: [], // Array to hold all tasks
    task: null, // Single task (for details or editing)
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Fetch all tasks
export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (_, thunkAPI) => {
    try {
        return await taskService.getAllTasks();
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) ||
            error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Fetch tasks by user ID
export const fetchTasksByUserId = createAsyncThunk('tasks/fetchByUser', async (userId, thunkAPI) => {
    try {
        return await taskService.getTasksByUserId(userId);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) ||
            error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Fetch single task by ID
export const fetchTaskById = createAsyncThunk('tasks/fetch', async (id, thunkAPI) => {
    try {
        return await taskService.getTaskById(id);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) ||
            error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Add new task
export const addTask = createAsyncThunk('tasks/add', async (taskData, thunkAPI) => {
    try {
        return await taskService.addTask(taskData);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) ||
            error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Update a task
export const updateTask = createAsyncThunk('tasks/update', async ({ id, updates }, thunkAPI) => {
    try {
        return await taskService.updateTask(id, updates);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) ||
            error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete a task
export const deleteTask = createAsyncThunk('tasks/delete', async (id, thunkAPI) => {
    try {
        return await taskService.deleteTask(id);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) ||
            error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(fetchTasksByUserId.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchTasksByUserId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tasks = action.payload;
            })
            .addCase(fetchTasksByUserId.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(fetchTaskById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchTaskById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.task = action.payload;
            })
            .addCase(fetchTaskById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(addTask.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tasks.push(action.payload);
            })
            .addCase(addTask.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateTask.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tasks = state.tasks.map((task) =>
                    task._id === action.payload._id ? action.payload : task
                );
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteTask.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tasks = state.tasks.filter((task) => task._id !== action.payload.id);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = taskSlice.actions;
export default taskSlice.reducer;
