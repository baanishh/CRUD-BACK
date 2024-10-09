// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register User
exports.registerUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({ username, password });
        await user.save();

        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',  // Adjust sameSite based on the environment
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user._id, username: user.username },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Login User
// exports.loginUser = async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const user = await User.findOne({ username });
//         if (!user) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         const isMatch = await user.matchPassword(password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         const token = generateToken(user._id);

//         res.cookie('token', token, { httpOnly: true });

//         res.status(200).json({
//             message: 'Logged in successfully',
//             user: { id: user._id, username: user.username },
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };




const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        // Set token in cookies
        res.cookie('token', token, {
            httpOnly: true,  // Prevent JavaScript access to cookie
            secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
            sameSite: 'None',  // Allow cross-origin requests
            maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
        });

        res.status(200).json({
            message: 'Logged in successfully',
            user: { id: user._id, username: user.username },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};




// Logout User
exports.logoutUser = (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
};


// Add this function
// exports.getProfile = async (req, res) => {
//     try {
//         res.status(200).json({ user: req.user });
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };


// Get Profile Controller
exports.getProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No user found' });
        }

        // Send user details (without sensitive info like password)
        res.status(200).json({ user: req.user });
    } catch (error) {
        console.error('Error fetching profile:', error.message);  // Log the error
        res.status(500).json({ message: 'Server Error' });
    }
};
