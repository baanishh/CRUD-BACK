// // middleware/authMiddleware.js
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');


// exports.protect = async (req, res, next) => {
//     const token = req.cookies.token;

//     if (!token) {
//         return res.status(401).json({ message: 'Not authorized, no token' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id).select('-password');
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Not authorized, token failed' });
//     }
// };


const jwt = require('jsonwebtoken');
const User = require('../models/User');
const cookieParser = require('cookie-parser');

// Protect Middleware
exports.protect = async (req, res, next) => {
    const token = req.cookies.token;  // Check for token in cookies

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch user and attach to request
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }
        
        // Proceed to the next middleware or route
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);  // Log the actual error
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
