const User = require('../models/User');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

// Create a new user (Register)
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone, homeLocation, role, preferredAlertType } = req.body;

    if (!name || !email || !password || !phone || !homeLocation || !role || !preferredAlertType) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        homeLocation,
        role,
        preferredAlertType,
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            //token: generateToken(user.id, user.role),
            phone: user.phone,
            homeLocation: user.homeLocation,
            preferredAlertType: user.preferredAlertType,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// Login a user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide both email and password');
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            //token: generateToken(user.id, user.role),
            phone: user.phone,
            homeLocation: user.homeLocation,
            preferredAlertType: user.preferredAlertType,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// JWT token generation
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = {
    registerUser,
    loginUser,
};
