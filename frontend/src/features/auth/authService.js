import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API}/api/users`;

// Register user
const register = async (userData) => {
    const res = await axios.post(`${API_URL}/register`, userData);

    if (res.data) {
        localStorage.setItem('user', JSON.stringify(res.data));
    }
    return res.data;
};

// Login user
const login = async (userData) => {
    console.log(userData)
    const res = await axios.post(`${API_URL}/login`, userData);
    console.log(res.data);

    if (res.data) {
        localStorage.setItem('user', JSON.stringify(res.data));
    }
    return res.data;
};

// Logout user
const logout = async () => {
    localStorage.removeItem('user');
};

const authService = {
    register,
    login,
    logout
};

export default authService;
