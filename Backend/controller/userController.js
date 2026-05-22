import User from "../model/userModel.js"
import Retailer from "../model/retailerModel.js";



// export const createuser = async (req, res) => {
//     try {
//         const { phoneno } = req.body;

//         // Check if user already exists
//         const existingUser = await User.findOne({ phoneno });
//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Phone number already registered. Please login."
//             });
//         }

//         const user = await User.create(req.body);
//         res.status(201).json({
//             success: true,
//             message: "Successfully Registered",
//             data: user,
//         });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

export const createuser = async (req, res) => {
    try {
        const { name, phoneno, password, code } = req.body;

        // 1. Check if phone already exists
        const existingUser = await User.findOne({ phoneno });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "Phone number already registered." 
            });
        }

        let userRole = "customer";
        let isVerified = false;

        // 2. Retailer Logic: If a code is provided, verify it
        if (code) {
            const validCode = await Retailer.findOne({ code: code.toUpperCase() });
            
            if (!validCode) {
                return res.status(401).json({ 
                    success: false, 
                    message: "Invalid Retailer Code. Please contact admin." 
                });
            }
            
            // Code is valid! Upgrade the registration details
            userRole = "retailer";
            isVerified = true;
        
        }

        // 3. Create the User
        const newUser = await User.create({
            name,
            phoneno,
            password, // In production, use bcrypt.hash(password, 10)
            role: userRole,
            retailerCode: code ? code.toUpperCase() : null,
            isRetailerVerified: isVerified
        });

        res.status(201).json({
            success: true,
            message: userRole === "retailer" ? "Retailer Registered!" : "Successfully Registered!",
            data: {
                id: newUser._id,
                name: newUser.name,
                role: newUser.role
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { phoneno, password } = req.body;

        // 1. Validation
        if (!phoneno || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide both phone number and password"
            });
        }

        // 2. Find user by Phone Number
        const user = await User.findOne({ phoneno });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Phone number not registered"
            });
        }
        const isPasswordMatched = user.password === password;

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        
        // 4. Success Response
        res.status(200).json({
            success: true,
            message: `Welcome back, ${user.name}`,
            data: {
                _id: user._id,
                name: user.name,
                phoneno: user.phoneno,
                role: user.role, 
                addresses: user.addresses 
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error: " + err.message
        });
    }
};

// userController.js

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, addresses } = req.body;

    // 1. Find and Update with the new returnDocument option
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { 
        $set: { 
          name, 
          email, 
          addresses // This replaces the address array with the new one from React
        } 
      },
      { 
        returnDocument: 'after', // Fixes the Mongoose warning
        runValidators: true      // Ensures email/data formats are still valid
      }
    );

    // 2. Handle Case: User not found
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found with this ID"
      });
    }

    // 3. Send back the fresh data to the frontend
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)  .select("name phoneno email role addresses");
    res.status(200).json({
      success: true,
      data: user
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: err.message
    });
  }
};

export const getAllUsers = async (req, res) => {
    try {
        // Find all users but exclude passwords for security
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
};


export const verifyAndRegisterRetailer = async (req, res) => {
    try {
        const { code, name, phoneno, password } = req.body;

        // 1. THE GATEKEEPER: Check if this code exists in your master list
        const validCode = await Retailer.findOne({ code });

        if (!validCode) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid Retailer Code. Access Denied." 
            });
        }

        // 2. FIND OR CREATE USER
        let user = await User.findOne({ phoneno });

        if (user) {
            // Update existing user to Retailer because they provided a valid code
            user.role = "retailer";
            user.retailerCode = code;
            user.isRetailerVerified = true;
            await user.save();
        } else {
            // Create new Retailer user
            user = await User.create({
                name,
                phoneno,
                password, // Ensure you hash this in production!
                role: "retailer",
                retailerCode: code,
                isRetailerVerified: true
            });
        }

        // 3. OPTIONAL: Track that this code was used again (without blocking others)
        // We don't set isUsed = true because you want MANY people to use it.
        
        res.status(200).json({
            success: true,
            message: "Retailer access granted!",
            data: user
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


export const retailerLogin = async (req, res) => {
  try {
    const { phoneno, password, code } = req.body;

    // 1. Validate code
    const validCode = await Retailer.findOne({
      code: code.toUpperCase()
    });

    if (!validCode) {
      return res.status(401).json({
        success: false,
        message: "Invalid Retailer Code"
      });
    }

    // 2. Find user
    const user = await User.findOne({ phoneno });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Please register first"
      });
    }

    // 3. Check password
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password"
      });
    }

    // 4. Upgrade role
    user.role = "retailer";
    user.retailerCode = code.toUpperCase();
    user.isRetailerVerified = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Retailer Login Successful",
      user: {
        _id: user._id,
        name: user.name,
        phoneno: user.phoneno,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};