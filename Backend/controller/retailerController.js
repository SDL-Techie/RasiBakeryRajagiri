// import RetailerCode from "../model/retailerModel.js";
// import User from "../model/userModel.js";

// // export const generateCode = async (req, res) => {
// //     try {
// //         const { assignedTo } = req.body;
// //         // Generate a random 6-digit code: RASI-XXXX
// //         const newCode = "RASI-" + Math.random().toString(36).substring(2, 6).toUpperCase();

// //         const codeEntry = await RetailerCode.create({ 
// //             code: newCode, 
// //             assignedTo 
// //         });

// //         res.status(201).json({ success: true, data: codeEntry });
// //     } catch (err) {
// //         res.status(500).json({ success: false, message: err.message });
// //     }
// // };


// export const createRetailerCode = async (req, res) => {
//     try {
//         const { assignedTo, code } = req.body;

//         // Check if the code you entered is already taken by another retailer
//         const existingCode = await RetailerCode.findOne({ code });
//         if (existingCode) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: "This code is already assigned to someone else. Choose a different one." 
//             });
//         }

//         const newEntry = await RetailerCode.create({
//             assignedTo,
//             code, // Uses the code you sent from React
//             isUsed: false
//         });

//         res.status(201).json({ success: true, data: newEntry });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// // 2. RETAILER: Use the code to register/login
// export const verifyRetailerCode = async (req, res) => {
//     try {
//         const { code, phoneno, password, name } = req.body;

//         // Find the code in our separate collection
//         const codeDoc = await RetailerCode.findOne({ code, isUsed: false });

//         if (!codeDoc) {
//             return res.status(400).json({ success: false, message: "Invalid or expired code" });
//         }

//         // Check if a user with this phone already exists
//         const existingUser = await User.findOne({ phoneno });
//         if (existingUser) return res.status(400).json({ success: false, message: "Phone already exists" });

//         // Create the Retailer User in the main User collection
//         const newUser = await User.create({
//             name,
//             phoneno,
//             password,
//             role: "retailer" // Hardcoded role
//         });

//         // Mark the code as used so no one else can use it
//         codeDoc.isUsed = true;
//         await codeDoc.save();

//         res.status(201).json({ 
//             success: true, 
//             message: "Retailer account activated!", 
//             data: newUser 
//         });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };


// export const getAllAccessCodes = async (req, res) => {
//     try {
//         const codes = await RetailerCode.find().sort({ createdAt: -1 });
//         res.status(200).json({
//             success: true,
//             data: codes
//         });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// // Backend Controller Example
// export const loginRetailer = async (req, res) => {
//     try {
//         const { code } = req.body; 

//         if (!code) {
//             return res.status(400).json({ success: false, message: "Please provide a code" });
//         }

//         const accessCode = await RetailerCode.findOne({ code });

//         if (!accessCode) {
//             return res.status(400).json({ success: false, message: "Invalid Code" });
//         }

//         // if (accessCode.isUsed) {
//         //     return res.status(400).json({ success: false, message: "Code already used" });
//         // }

//         res.status(200).json({ success: true, token: "..." });

//     } catch (error) {
//         res.status(500).json({ message: "Server Error" });
//     }
// };


import Retailer from "../model/retailerModel.js";
import User from "../model/userModel.js";

// 1. ADMIN: Create a new code
export const createRetailerCode = async (req, res) => {
    try {
        const { assignedTo, code } = req.body;
        const existing = await Retailer.findOne({ code });
        if (existing) return res.status(400).json({ message: "Code already exists" });

        const newEntry = await Retailer.create({ assignedTo, code });
        res.status(201).json({ success: true, data: newEntry });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. RETAILER: Login using Code + Name + Phone
export const verifyAndRegisterRetailer = async (req, res) => {
    try {
        const { code, name, phoneno } = req.body;

        // Check if code is valid and not used
        const codeDoc = await Retailer.findOne({ code, isUsed: false });
        if (!codeDoc) {
            return res.status(400).json({ success: false, message: "Invalid or used code" });
        }

        // Create the user (or find if they somehow exist)
        let user = await User.findOne({ phoneno });
        if (!user) {
            user = await User.create({ name, phoneno, role: "retailer" , password:"1234567890"});
        }

        // Link the code to this user and mark as used
        codeDoc.isUsed = true;
        codeDoc.activatedBy = user._id; 
        await codeDoc.save();

        res.status(200).json({ 
            success: true, 
            message: "Login Successful", 
            user 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 3. FETCH: Get all codes and the details of users who logged in with them
export const getUsedCodesDetails = async (req, res) => {
    try {
        // .populate("activatedBy") pulls name/phone from the User collection
        const data = await Retailer.find({ isUsed: true })
            .populate("activatedBy", "name phoneno")
            .sort({ updatedAt: -1 });

        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 4. FETCH: Get all codes (Used and Unused) for Admin dashboard
export const getAllCodes = async (req, res) => {
    try {
        const codes = await Retailer.find().populate("activatedBy", "name phoneno");
        res.status(200).json({ success: true, data: codes });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
