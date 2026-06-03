import User from "../model/userModel.js"
import Retailer from "../model/retailerModel.js";
import bcryptjs from "bcryptjs";
import { sendToken } from "../helper/jwtToken.js";
import PointSetting from "../model/pointsetting.js";
import UserPoint from "../model/userpointModel.js";
import mongoose from "mongoose";

// const seedDefaultAdmin = async () => {
//     try {
//         const adminPhone = "8903652269";
//         const adminExists = await User.findOne({ phoneno: adminPhone });

//         if (!adminExists) {
//             await User.create({
//admin@sdl!
//                 name: "Super Admin",
//                 phoneno: adminPhone,
//                 password: hashedPassword, // Make sure your userModel hashes this via pre-save hooks!
//                 role: "admin",
//                 isRetailerVerified: false
//             });
//             console.log("✅ Default Super Admin successfully seeded in database.");
//         }
//     } catch (error) {
//         console.error("❌ Error seeding default admin:", error.message);
//     }
// };


// const seedDefaultAdmin = async () => {
//     try {
//         const adminPhone = "8220701195";
//         const adminExists = await User.findOne({ phoneno: adminPhone });

//         if (!adminExists) {
//             // Explicitly generate the salt and hash block for the default credentials
//             const salt = await bcryptjs.genSalt(10);
//             const hashedPassword = await bcryptjs.hash("admin@sdl", salt);

//             await User.create({
//                 name: "Super Admin",
//                 phoneno: adminPhone,
//                 password: "RASI-1995", // ✅ Fixed: Variable is now defined properly
//                 role: "admin",
//                 isRetailerVerified: false
//             });
//             //console.log("✅ Default Super Admin successfully seeded in database.");
//         }
//     } catch (error) {
//         console.error("❌ Error seeding default admin:", error.message);
//     }
// };


const seedDefaultAdmin = async () => {
    try {
        const adminPhone = "8220701195";
        const adminExists = await User.findOne({ phoneno: adminPhone });

        if (!adminExists) {
            await User.create({
                name: "Super Admin",
                phoneno: adminPhone,
                password: "RASI-1995",
                role: "admin",
                isRetailerVerified: false
            });

            console.log("✅ Default Super Admin created");
        }
    } catch (error) {
        console.error("❌ Error seeding default admin:", error.message);
    }
};


if (mongoose.connection.readyState === 1) {
    seedDefaultAdmin();
} else {
    mongoose.connection.once("open", () => seedDefaultAdmin());
}

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

        // const token = newUser.getJWTToken();

        // res.status(201).json({
        //     success: true,
        //     message: userRole === "retailer" ? "Retailer Registered!" : "Successfully Registered!",
        //     data: {
        //         id: newUser._id,
        //         name: newUser.name,
        //         role: newUser.role,
               
        //         // password: newUser.password,
        //     },
        //      token: token
        // });

        sendToken(newUser,201,res);

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
        const user = await User.findOne({ phoneno }).select('+password'); // Explicitly include password for verification

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Phone number not registered"
            });
        }
        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
      //  const token=user.getJWTToken();
        
      //   // 4. Success Response
      //   res.status(200).json({
      //       success: true,
      //       message: `Welcome back, ${user.name}`,
      //       data: {
      //           _id: user._id,
      //           name: user.name,
      //           phoneno: user.phoneno,
      //           role: user.role, 
      //           addresses: user.addresses 
      //       },
      //       token: token
      //   });

      sendToken(user,200,res);

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error: " + err.message
        });
    }
};

export const Logoutuser=async(req,res)=>{
  const options={
    expires:new Date(Date.now()),
    httpOnly:true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  }
  res.status(200).cookie("token", null, options).json({
    success: true,
    message: "Logged out successfully"
  });
}

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

// export const getAllUsers = async (req, res) => {
//     try {
//         // Find all users but exclude passwords for security
//         const users = await User.find().select('-password').sort({ createdAt: -1 });
        
//         res.status(200).json({
//             success: true,
//             count: users.length,
//             data: users
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch users",
//             error: error.message
//         });
//     }
// };


export const getAllUsers = async (req, res) => {
    try {
        // 1. Fetch system-wide point settings configurations rules
        const settings = await PointSetting.findOne();
        
        // 2. Fetch manual loyalty profile overrides map for quick reference checks
        const manualUserPoints = await UserPoint.find();
        const userPointsMap = new Map(manualUserPoints.map(up => [up.userPhone, up]));

        // 3. Aggregate all users with their corresponding order payment records
        const usersWithMetrics = await User.aggregate([
            {
                // Exclude passwords and sensitive data for security right away
                $project: {
                    password: 0
                }
            },
            {
                // Core Lookup: Match users down to their placed order collection metrics
                $lookup: {
                    from: "orders", // Must exactly match your MongoDB orders collection name
                    localField: "phoneno",
                    foreignField: "customerDetails.phone",
                    as: "historicalOrders"
                }
            },
            {
                // Structure dynamic field mapping calculations
                $addFields: {
                    totalPurchase: {
                        $sum: {
                            $map: {
                                input: "$historicalOrders",
                                as: "order",
                                in: {
                                    $cond: [
                                        { $eq: ["$$order.status", "Cancelled"] },
                                        0,
                                        { $ifNull: ["$$order.pricing.total", 0] }
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {
                // Sort users with newly registered profiles displaying first
                $sort: { createdAt: -1 }
            }
        ]);

        // 4. Map over results to inject accurate, verified current loyalty point levels
        const finalizedUsersList = usersWithMetrics.map(user => {
            const phone = user.phoneno;
            const finalAmountSpent = user.totalPurchase || 0;

            // Calculate live mathematical point baseline fallback defaults
            let liveCalculatedPoints = 0;
            if (settings) {
                liveCalculatedPoints = Math.floor(finalAmountSpent / settings.minOrderAmount) * settings.pointsEarnedPerOrder;
            }

            // Check if this explicit user phone contains a verified manual reward profile override
            const balanceOverride = userPointsMap.get(phone);
            const currentPoints = balanceOverride?.currentPoints !== undefined ? balanceOverride.currentPoints : liveCalculatedPoints;

            return {
                ...user,
                historicalOrders: undefined, // Clears the massive order arrays from bloating the payload response
                totalPurchase: finalAmountSpent,
                currentPoints: currentPoints
            };
        });

        // 5. Send optimized payload package directly back down to React components
        res.status(200).json({
            success: true,
            count: finalizedUsersList.length,
            data: finalizedUsersList
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users with live purchase metrics",
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


export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID structure format."
            });
        }

        if (!['customer', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role assignment requested. Select Admin or Customer."
            });
        }

        // 1. Fetch user to verify super admin status safely before changes
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User account not found."
            });
        }

        const targetPhone = user.phoneno || user.phone || "";
        if (targetPhone === "8903652269") {
            return res.status(403).json({
                success: false,
                message: "The root Super Admin configuration cannot be modified."
            });
        }

        // 2. 🔥 Update role directly without triggering pre-save hooks
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: { role: role } },
            { new: true, runValidators: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            message: `User privileges updated to ${role} successfully`,
            data: updatedUser
        });

    } catch (error) {
        console.error("CRITICAL BACKEND ROLE UPDATE ERROR:", error); 
        return res.status(500).json({
            success: false,
            message: "Internal server error occurred while editing account permissions.",
            error: error.message
        });
    }
};



export const createCredential = async (req, res) => {
    try {
        // 1. Verify requester is admin
        const { role: requesterRole } = req.user; // From verifyUser middleware
        
        if (requesterRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Only admins can create credentials"
            });
        }
 
        const { name, phoneno, password, role } = req.body;
 
        // 2. Validate input
        if (!name || !phoneno || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, phone number, password, and role"
            });
        }
 
        if (!['customer', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Must be 'customer' or 'admin'"
            });
        }
 
        // 3. Check if phone already exists
        const existingUser = await User.findOne({ phoneno });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Phone number already registered"
            });
        }
 
        // 4. Create the new user/admin
        const newUser = await User.create({
            name,
            phoneno,
            password, // Will be hashed by pre-save hook
            role: role.toLowerCase(),
            isRetailerVerified: false
        });
 
        // 5. Return success response
        res.status(201).json({
            success: true,
            message: `${role} created successfully!`,
            data: {
                _id: newUser._id,
                name: newUser.name,
                phoneno: newUser.phoneno,
                role: newUser.role,
                createdAt: newUser.createdAt
            }
        });
 
    } catch (error) {
        console.error("Create Credential Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
 
// ✨ NEW: Get Users Only (Exclude Admins)
export const getUsers = async (req, res) => {
    try {
        const settings = await PointSetting.findOne();
        const manualUserPoints = await UserPoint.find();
        const userPointsMap = new Map(manualUserPoints.map(up => [up.userPhone, up]));
 
        const usersWithMetrics = await User.aggregate([
            {
                $match: { role: { $ne: 'admin' } } // Exclude admins
            },
            {
                $project: { password: 0 }
            },
            {
                $lookup: {
                    from: "orders",
                    localField: "phoneno",
                    foreignField: "customerDetails.phone",
                    as: "historicalOrders"
                }
            },
            {
                $addFields: {
                    totalPurchase: {
                        $sum: {
                            $map: {
                                input: "$historicalOrders",
                                as: "order",
                                in: {
                                    $cond: [
                                        { $eq: ["$$order.status", "Cancelled"] },
                                        0,
                                        { $ifNull: ["$$order.pricing.total", 0] }
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
 
        const finalizedUsersList = usersWithMetrics.map(user => {
            const phone = user.phoneno;
            const finalAmountSpent = user.totalPurchase || 0;
 
            let liveCalculatedPoints = 0;
            if (settings) {
                liveCalculatedPoints = Math.floor(finalAmountSpent / settings.minOrderAmount) * settings.pointsEarnedPerOrder;
            }
 
            const balanceOverride = userPointsMap.get(phone);
            const currentPoints = balanceOverride?.currentPoints !== undefined ? balanceOverride.currentPoints : liveCalculatedPoints;
 
            return {
                ...user,
                historicalOrders: undefined,
                totalPurchase: finalAmountSpent,
                currentPoints: currentPoints
            };
        });
 
        res.status(200).json({
            success: true,
            count: finalizedUsersList.length,
            data: finalizedUsersList
        });
 
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
};
 
// ✨ NEW: Get Admins Only
export const getAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' })
            .select('-password')
            .sort({ createdAt: -1 });
 
        res.status(200).json({
            success: true,
            count: admins.length,
            data: admins
        });
 
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch admins",
            error: error.message
        });
    }
};
 
// ✨ NEW: Get User Details by ID
export const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
 
        const user = await User.findById(id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
 
        res.status(200).json({
            success: true,
            data: user
        });
 
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching user details",
            error: error.message
        });
    }
};