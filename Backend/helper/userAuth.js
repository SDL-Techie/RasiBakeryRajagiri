import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';

export const verifyUser = async (req, res, next) => {
    try {

        let token;

        // Get token from Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access Denied. Login Required"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        next();

    } catch (error) {

        console.log(error);

        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};


// Middleware to check if the logged-in user is an admin
export const isAdmin = (req, res, next) => {
    // req.user was populated by your verifyUser middleware
    if (req.user && req.user.role === 'admin') {
        next(); // User is admin, let them through!
    } else {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
};