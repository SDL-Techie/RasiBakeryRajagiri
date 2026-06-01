// import { PointSetting, UserPoint } from "../model/pointModel.js";
// import Order from "../model/orderModel.js";
// export const getPointSettings = async (req, res) => {
//     try {
//         let settings = await PointSetting.findOne();
//         if (!settings) {
//             settings = await PointSetting.create({});
//         }
//         res.status(200).json(settings);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// export const updatePointSettings = async (req, res) => {
//     try {
//         const updatedSettings = await PointSetting.findOneAndUpdate({}, req.body, { new: true, upsert: true });
//         res.status(200).json(updatedSettings);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // export const getUserPoints = async (req, res) => {
// //     try {
// //         const { phone } = req.params;
// //         let userPoint = await UserPoint.findOne({ userPhone: phone });
        
// //         if (!userPoint) {
// //             userPoint = await UserPoint.create({ userPhone: phone, currentPoints: 0 });
// //         }
        
// //         res.status(200).json(userPoint);
// //     } catch (error) {
// //         res.status(500).json({ message: error.message });
// //     }
// // };

// export const savePointSettings = async (req, res) => {
//     try {
//         const { 
//             minOrderAmount,          // e.g., 200
//             pointsEarnedPerOrder,    // e.g., 10 or 20
//             pointsRequiredForDiscount, // e.g., 10
//             discountPercentage       // e.g., 20
//         } = req.body;

//         // .findOneAndUpdate with { upsert: true } acts as your "Create" 
//         // because it will create the document if it doesn't find one.
//         const settings = await PointSetting.findOneAndUpdate(
//             {}, // Empty filter finds the first/only settings document
//             { 
//                 minOrderAmount, 
//                 pointsEarnedPerOrder, 
//                 pointsRequiredForDiscount, 
//                 discountPercentage 
//             },
//             { new: true, upsert: true, runValidators: true }
//         );

//         res.status(200).json({
//             message: "Point system rules saved successfully!",
//             settings
//         });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };



// // export const getUserPoints = async (req, res) => {
// //     try {
// //         const { phone } = req.params;

// //         // 1. Fetch Admin Loyalty Rules
// //         const settings = await PointSetting.findOne();
        
// //         const discountPercentage = settings?.discountPercentage || 10;
// //         const minAmountPerUnit = settings?.minOrderAmount || 100; // ₹100
// //         const pointsPerUnit = settings?.pointsEarnedPerOrder || 10; // 10 pts
// //         const pointsRequired = settings?.pointsRequiredForDiscount || 1000;

// //         // 2. Fetch User Record
// //         const userPoint = await UserPoint.findOne({ userPhone: phone });
        
// //         // 3. Get Latest Order to calculate "Potential/Last Earned" points
// //         const latestOrder = await Order.findOne({ "customerDetails.phone": phone })
// //                                        .sort({ createdAt: -1 });
// //         const lastAmt = latestOrder ? latestOrder.pricing.total : 0;

// //         // CORRECT CALCULATION: 456 / 100 = 4.56 -> Floor to 4 -> 4 * 10 = 40 points
// //         const lastPointsEarned = Math.floor(lastAmt / minAmountPerUnit) * pointsPerUnit;

// //         // if (!userPoint) {
// //         //     return res.status(200).json({
// //         //         success: true,
// //         //         // currentPoints: 0,
// //         //          currentPoints: lastPointsEarned,
// //         //         lastOrderAmount: lastAmt,
// //         //         lastOrderPointsEarned: lastPointsEarned,
// //         //         totalAmountSpent: 0,
// //         //         canRedeem: false,
// //         //         pointsNeededToRedeem: pointsRequired,
// //         //         discountAvailable: 0 ,
// //         //               loyaltyStatus: {
// //         //     requiredToUnlock: pointsRequired,
// //         //     earnRateText: `Reach ${pointsRequired} points for ${discountPercentage}% off`,
// //         //     pointRuleText: `Earn ${pointsPerUnit} points for every ₹${minAmountPerUnit} spent`,
// //         //     currentProgress: `0/${pointsRequired}`
// //         // }
// //         //     });
// //         // }

// //         // const canRedeem = lastPointsEarned >= pointsRequired;
// //         // const pointsNeeded = canRedeem ? 0 : (pointsRequired - lastPointsEarned);

// //         if (!userPoint) {
// //     return res.status(200).json({
// //         success: true,
// //         currentPoints: lastPointsEarned,
// //         lastOrderAmount: lastAmt,
// //         lastOrderPointsEarned: lastPointsEarned,
// //         totalAmountSpent: 0,
// //         canRedeem: false, // ❌ HARDCODED FALSE!
// //         pointsNeededToRedeem: pointsRequired, // ❌ HARDCODED TOTAL RULES REQUIREMENT!
// //         discountAvailable: 0 ,
// //         loyaltyStatus: {
// //             requiredToUnlock: pointsRequired,
// //             earnRateText: `Reach ${pointsRequired} points for ${discountPercentage}% off`,
// //             pointRuleText: `Earn ${pointsPerUnit} points for every ₹${minAmountPerUnit} spent`,
// //             currentProgress: `0/${pointsRequired}` // ❌ HARDCODED PROGRESS AT 0!
// //         }
// //     });
// // }
// //         const currentPoints = userPoint.currentPoints || 0;

// // const canRedeem = currentPoints >= pointsRequired;

// // const pointsNeeded = canRedeem
// //     ? 0
// //     : (pointsRequired - currentPoints);
// //         res.status(200).json({
// //             success: true,
// //             // currentPoints: userPoint.currentPoints,
// //             lastOrderAmount: lastAmt,
// //             lastOrderPointsEarned: lastPointsEarned, // Now shows 40 for 456
// //             totalAmountSpent: userPoint.totalAmountSpent || 0,
// //             canRedeem: canRedeem,
// //             pointsNeededToRedeem: pointsNeeded,
// //             discountAvailable: canRedeem ? discountPercentage : 0, 
// //             loyaltyStatus: {
// //                 requiredToUnlock: pointsRequired,
// //                 earnRateText: `Reach ${pointsRequired} points for ${discountPercentage}% off`,
// //                 pointRuleText: `Earn ${pointsPerUnit} points for every ₹${minAmountPerUnit} spent`,
// //                 // currentProgress: `${lastPointsEarned}/${pointsRequired}`
// //                 currentProgress: `${currentPoints}/${pointsRequired}`
// //             }
// //         });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: error.message });
// //     }
// // };


// export const getUserPoints = async (req, res) => {
//     try {
//         const { phone } = req.params;

//         // 1. Fetch Admin Loyalty Rules
//         const settings = await PointSetting.findOne();
        
//         const discountPercentage = settings?.discountPercentage || 10;
//         const minAmountPerUnit = settings?.minOrderAmount || 100; 
//         const pointsPerUnit = settings?.pointsEarnedPerOrder || 10;
//         const pointsRequired = settings?.pointsRequiredForDiscount || 1000;

//         // 2. Fetch User Record
//         const userPoint = await UserPoint.findOne({ userPhone: phone });
        
//         // 3. Get Latest Order to calculate potential points
//         const latestOrder = await Order.findOne({ "customerDetails.phone": phone })
//                                        .sort({ createdAt: -1 });
//         const lastAmt = latestOrder ? latestOrder.pricing.total : 0;

//         // Calculate dynamic points from their transaction
//         const lastPointsEarned = Math.floor(lastAmt / minAmountPerUnit) * pointsPerUnit;

//         // 4. IF USER RECORD DOES NOT EXIST YET
//         if (!userPoint) {
//             // Determine eligibility dynamically based on their single current transaction
//             const dynamicCanRedeem = lastPointsEarned >= pointsRequired;
//             const dynamicPointsNeeded = dynamicCanRedeem ? 0 : (pointsRequired - lastPointsEarned);

//             return res.status(200).json({
//                 success: true,
//                 currentPoints: lastPointsEarned,
//                 lastOrderAmount: lastAmt,
//                 lastOrderPointsEarned: lastPointsEarned,
//                 totalAmountSpent: lastAmt,
//                 canRedeem: dynamicCanRedeem, // ⚡ Dynamic evaluation
//                 pointsNeededToRedeem: dynamicPointsNeeded, // ⚡ Dynamic evaluation
//                 discountAvailable: dynamicCanRedeem ? discountPercentage : 0, 
//                 loyaltyStatus: {
//                     requiredToUnlock: pointsRequired,
//                     earnRateText: `Reach ${pointsRequired} points for ${discountPercentage}% off`,
//                     pointRuleText: `Earn ${pointsPerUnit} points for every ₹${minAmountPerUnit} spent`,
//                     currentProgress: `${lastPointsEarned}/${pointsRequired}` // ⚡ Dynamic evaluation
//                 }
//             });
//         }

//         // 5. IF USER RECORD EXISTS
//         const currentPoints = userPoint.lastPointsEarned || 0;
//         const canRedeem = currentPoints >= pointsRequired;
//         const pointsNeeded = canRedeem ? 0 : (pointsRequired - currentPoints);

//         res.status(200).json({
//             success: true,
//             currentPoints: lastPointsEarned, // Show potential points from last order instead of stored points
//             lastOrderAmount: lastAmt,
//             lastOrderPointsEarned: lastPointsEarned, 
//             totalAmountSpent: userPoint.totalAmountSpent || 0,
//             canRedeem: canRedeem,
//             pointsNeededToRedeem: pointsNeeded,
//             discountAvailable: canRedeem ? discountPercentage : 0, 
//             loyaltyStatus: {
//                 requiredToUnlock: pointsRequired,
//                 earnRateText: `Reach ${pointsRequired} points for ${discountPercentage}% off`,
//                 pointRuleText: `Earn ${pointsPerUnit} points for every ₹${minAmountPerUnit} spent`,
//                 currentProgress: `${lastPointsEarned}/${pointsRequired}`
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// export const calculateDiscount = async (req, res) => {
//     try {
//         const { phone, currentOrderTotal } = req.body;
        
//         const userPoint = await UserPoint.findOne({ userPhone: phone });
//         const settings = await PointSetting.findOne();

//         const pointsRequired = settings?.pointsRequiredForDiscount || 1000;

//         // Strict Check: User must have exactly or more than the required points
//         if (!userPoint || userPoint.currentPoints < pointsRequired) {
//             return res.status(200).json({ 
//                 success: false, 
//                 discountAmount: 0, 
//                 message: `You need ${pointsRequired} points to use a discount.` 
//             });
//         }

//         // Calculation: (Order Total * Discount %) / 100
//         const discountPercent = settings.discountPercentage || 10;
//         const discountAmount = (currentOrderTotal * discountPercent) / 100;

//         res.status(200).json({ 
//             success: true, 
//             discountAmount: Math.round(discountAmount), // Rounding to avoid messy decimals
//             newTotal: currentOrderTotal - Math.round(discountAmount),
//             pointsToSpend: pointsRequired
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


// // export const redeemPoints = async (req, res) => {
// //     try {
// //         const { phone } = req.body;

// //         // 1. Fetch Admin Rules to get the point conversion math
// //         const settings = await PointSetting.findOne();
// //         const minAmountPerUnit = settings?.minOrderAmount || 100; 
// //         const pointsPerUnit = settings?.pointsEarnedPerOrder || 10;
// //         const pointsRequired = settings?.pointsRequiredForDiscount || 100;

// //         // 2. Find the Latest Order for this phone number
// //         const latestOrder = await Order.findOne({ "customerDetails.phone": phone })
// //                                        .sort({ createdAt: -1 });

// //         if (!latestOrder) {
// //             return res.status(404).json({ success: false, message: "No orders found for this user." });
// //         }


// //         const lastAmt = latestOrder.pricing.total;
// //         const lastOrderPointsEarned = Math.floor(lastAmt / minAmountPerUnit) * pointsPerUnit;
// //         // if (lastOrderPointsEarned < pointsRequired) {
// //         if (user.currentPoints < pointsRequired){
// //             return res.status(400).json({ 
// //                 success: false, 
// //                 message: `Your last order earned ${lastOrderPointsEarned} points. You need ${pointsRequired} to redeem.` 
// //             });
// //         }

// //         const generatedCode = `RASI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
// //         const expiryDate = new Date();
// //         expiryDate.setDate(expiryDate.getDate() + 10);
// //         const user = await UserPoint.findOneAndUpdate(
// //             { userPhone: phone },
// //             {
// //                 $push: {
// //                     activeCoupons: {
// //                         code: generatedCode,
// //                         discountValue: settings?.discountPercentage || 10,
// //                         expiresAt: expiryDate,
// //                         isUsed: false
// //                     },
// //                     history: {
// //                         pointsChanged: 0, // Recorded as a reward from last order
// //                         type: 'redeemed',
// //                         createdAt: new Date()
// //                     }
// //                 }
// //             },
// //             { upsert: true, new: true }
// //         );

// //         res.status(200).json({
// //             success: true,
// //             couponCode: generatedCode,
// //             expiryDate: expiryDate,
// //             message: "Coupon generated from your last order!"
// //         });

// //     } catch (error) {
// //         res.status(500).json({ success: false, message: error.message });
// //     }
// // };


// // export const validateCoupon = async (req, res) => {
// //     try {
// //         const { phone, couponCode } = req.body;

// //         const user = await UserPoint.findOne({ userPhone: phone });
// //         if (!user) return res.status(404).json({ success: false, message: "User not found" });

// //         // Find the specific coupon in the user's activeCoupons array
// //         const coupon = user.activeCoupons.find(c => c.code === couponCode && !c.isUsed);

// //         if (!coupon) {
// //             return res.status(400).json({ success: false, message: "Invalid or already used coupon code" });
// //         }

// //         // Check if expired
// //         if (new Date() > new Date(coupon.expiresAt)) {
// //             return res.status(400).json({ success: false, message: "Coupon has expired" });
// //         }

// //         res.status(200).json({ 
// //             success: true, 
// //             discountValue: coupon.discountValue, 
// //             message: "Coupon applied successfully!" 
// //         });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: error.message });
// //     }
// // };


// export const redeemPoints = async (req, res) => {
//     try {
//         const { phone } = req.body;

//         // 1. Get Global Admin Settings
//         const settings = await PointSetting.findOne();
//         const pointsRequired = settings?.pointsRequiredForDiscount || 100;
//         const minAmountPerUnit = settings?.minOrderAmount || 100; 
//         const pointsPerUnit = settings?.pointsEarnedPerOrder || 10;

//         // 2. Find user profile
//         let user = await UserPoint.findOne({ userPhone: phone });

//         // 3. If user profile doesn't exist yet, handle registration on the fly
//         if (!user) {
//             const latestOrder = await Order.findOne({ "customerDetails.phone": phone })
//                                            .sort({ createdAt: -1 });
//             const lastAmt = latestOrder ? latestOrder.pricing.total : 0;
//             const dynamicPointsEarned = Math.floor(lastAmt / minAmountPerUnit) * pointsPerUnit;

//             if (dynamicPointsEarned < pointsRequired) {
//                 return res.status(400).json({
//                     success: false,
//                     message: `You need ${pointsRequired} points to redeem. You currently have ${dynamicPointsEarned}.`
//                 });
//             }

//             // ✅ Explicitly initialize the empty structures to prevent array mutation issues
//             user = new UserPoint({
//                 userPhone: phone,
//                 currentPoints: dynamicPointsEarned,
//                 totalAmountSpent: lastAmt,
//                 totalPointsEarned: dynamicPointsEarned,
//                 activeCoupons: [],
//                 history: []
//             });
//         }

//         // 4. Check points balance validity
//         if (user.currentPoints < pointsRequired) {
//             return res.status(400).json({
//                 success: false,
//                 message: `You need ${pointsRequired} points to redeem. You have ${user.currentPoints}.`
//             });
//         }

//         // 5. Generate coupon configuration parameters
//         const generatedCode = `RASI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
//         const expiryDate = new Date();
//         expiryDate.setDate(expiryDate.getDate() + 10);

//         // 6. Deduct points safely
//         user.currentPoints -= pointsRequired;

//         user.activeCoupons.push({
//             code: generatedCode,
//             discountValue: settings?.discountPercentage || 10,
//             expiresAt: expiryDate,
//             isUsed: false
//         });

//         user.history.push({
//             pointsChanged: -pointsRequired,
//             type: "redeemed",
//             createdAt: new Date()
//         });

//         // Save modifications cleanly
//         await user.save();

//         res.status(200).json({
//             success: true,
//             couponCode: generatedCode,
//             expiryDate,
//             remainingPoints: user.currentPoints,
//             message: "Coupon generated successfully!"
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // export const validateCoupon = async (req, res) => {
// //     try {
// //         const { phone, couponCode } = req.body;

// //         const user = await UserPoint.findOne({ userPhone: phoneno });
// //         if (!user) return res.status(404).json({ success: false, message: "User not found" });

// //         // 1. Find the specific coupon
// //         const coupon = user.activeCoupons.find(c => c.code === couponCode);

// //         // 2. Strict validation checks
// //         if (!coupon) {
// //             return res.status(400).json({ success: false, message: "Invalid coupon code." });
// //         }

// //         if (coupon.isUsed) {
// //             return res.status(400).json({ success: false, message: "This coupon has already been used." });
// //         }

// //         if (new Date() > new Date(coupon.expiresAt)) {
// //             return res.status(400).json({ success: false, message: "This coupon expired after 10 days." });
// //         }

// //         res.status(200).json({ 
// //             success: true, 
// //             discountValue: coupon.discountValue, 
// //             message: "Coupon applied! Discount will be deducted." 
// //         });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: error.message });
// //     }
// // };


// export const validateCoupon = async (req, res) => {
//     try {
//         const { phone, couponCode } = req.body;

//         // ❌ ERROR WAS HERE: userPhone: phoneno (phoneno is undefined)
//         // ✅ FIX: Change phoneno to phone
//         const user = await UserPoint.findOne({ userPhone: phone }); 
//         if (!user) return res.status(404).json({ success: false, message: "User not found" });

//         // 1. Find the specific coupon
//         const coupon = user.activeCoupons.find(c => c.code === couponCode);

//         // 2. Strict validation checks
//         if (!coupon) {
//             return res.status(400).json({ success: false, message: "Invalid coupon code." });
//         }

//         if (coupon.isUsed) {
//             return res.status(400).json({ success: false, message: "This coupon has already been used." });
//         }

//         if (new Date() > new Date(coupon.expiresAt)) {
//             return res.status(400).json({ success: false, message: "This coupon expired after 10 days." });
//         }

//         res.status(200).json({ 
//             success: true, 
//             discountValue: coupon.discountValue, 
//             message: "Coupon applied! Discount will be deducted." 
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// export const markCouponUsed = async (req, res) => {
//     try {
//         const { phone, couponCode } = req.body;
//         await UserPoint.updateOne(
//             { userPhone: phone, "activeCoupons.code": couponCode },
//             { $set: { "activeCoupons.$.isUsed": true } }
//         );
//         res.status(200).json({ success: true });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };



import { PointSetting, UserPoint } from "../model/pointModel.js";
import Order from "../model/orderModel.js";
export const getPointSettings = async (req, res) => {
    try {
        let settings = await PointSetting.findOne();
        if (!settings) {
            settings = await PointSetting.create({});
        }
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePointSettings = async (req, res) => {
    try {
        const updatedSettings = await PointSetting.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.status(200).json(updatedSettings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// export const getUserPoints = async (req, res) => {
//     try {
//         const { phone } = req.params;
//         let userPoint = await UserPoint.findOne({ userPhone: phone });
        
//         if (!userPoint) {
//             userPoint = await UserPoint.create({ userPhone: phone, currentPoints: 0 });
//         }
        
//         res.status(200).json(userPoint);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

export const savePointSettings = async (req, res) => {
    try {
        const { 
            minOrderAmount,          // e.g., 200
            pointsEarnedPerOrder,    // e.g., 10 or 20
            pointsRequiredForDiscount, // e.g., 10
            discountPercentage       // e.g., 20
        } = req.body;

        // .findOneAndUpdate with { upsert: true } acts as your "Create" 
        // because it will create the document if it doesn't find one.
        const settings = await PointSetting.findOneAndUpdate(
            {}, // Empty filter finds the first/only settings document
            { 
                minOrderAmount, 
                pointsEarnedPerOrder, 
                pointsRequiredForDiscount, 
                discountPercentage 
            },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({
            message: "Point system rules saved successfully!",
            settings
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



export const getUserPoints = async (req, res) => {
    try {
        const { phone } = req.params;

        // 1. Fetch Admin Loyalty Rules
        const settings = await PointSetting.findOne();
        
        const discountPercentage = settings?.discountPercentage || 10;
        const minAmountPerUnit = settings?.minOrderAmount || 100; // ₹100
        const pointsPerUnit = settings?.pointsEarnedPerOrder || 10; // 10 pts
        const pointsRequired = settings?.pointsRequiredForDiscount || 1000;

        // 2. Fetch User Record
        const userPoint = await UserPoint.findOne({ userPhone: phone });
        
        // 3. Get Latest Order to calculate "Potential/Last Earned" points
        const latestOrder = await Order.findOne({ "customerDetails.phone": phone })
                                       .sort({ createdAt: -1 });
        const lastAmt = latestOrder ? latestOrder.pricing.total : 0;

        // CORRECT CALCULATION: 456 / 100 = 4.56 -> Floor to 4 -> 4 * 10 = 40 points
        const lastPointsEarned = Math.floor(lastAmt / minAmountPerUnit) * pointsPerUnit;

        if (!userPoint) {
            return res.status(200).json({
                success: true,
                currentPoints: 0,
                lastOrderAmount: lastAmt,
                lastOrderPointsEarned: lastPointsEarned,
                totalAmountSpent: 0,
                canRedeem: false,
                pointsNeededToRedeem: pointsRequired,
                discountAvailable: 0 
            });
        }

        const canRedeem = lastPointsEarned >= pointsRequired;
        const pointsNeeded = canRedeem ? 0 : (pointsRequired - lastPointsEarned);

        res.status(200).json({
            success: true,
            // currentPoints: userPoint.currentPoints,
            lastOrderAmount: lastAmt,
            lastOrderPointsEarned: lastPointsEarned, // Now shows 40 for 456
            totalAmountSpent: userPoint.totalAmountSpent || 0,
            canRedeem: canRedeem,
            pointsNeededToRedeem: pointsNeeded,
            discountAvailable: canRedeem ? discountPercentage : 0, 
            loyaltyStatus: {
                requiredToUnlock: pointsRequired,
                earnRateText: `Reach ${pointsRequired} points for ${discountPercentage}% off`,
                pointRuleText: `Earn ${pointsPerUnit} points for every ₹${minAmountPerUnit} spent`,
                currentProgress: `${lastPointsEarned}/${pointsRequired}`
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const calculateDiscount = async (req, res) => {
    try {
        const { phone, currentOrderTotal } = req.body;
        
        const userPoint = await UserPoint.findOne({ userPhone: phone });
        const settings = await PointSetting.findOne();

        const pointsRequired = settings?.pointsRequiredForDiscount || 1000;

        // Strict Check: User must have exactly or more than the required points
        if (!userPoint || userPoint.currentPoints < pointsRequired) {
            return res.status(200).json({ 
                success: false, 
                discountAmount: 0, 
                message: `You need ${pointsRequired} points to use a discount.` 
            });
        }

        // Calculation: (Order Total * Discount %) / 100
        const discountPercent = settings.discountPercentage || 10;
        const discountAmount = (currentOrderTotal * discountPercent) / 100;

        res.status(200).json({ 
            success: true, 
            discountAmount: Math.round(discountAmount), // Rounding to avoid messy decimals
            newTotal: currentOrderTotal - Math.round(discountAmount),
            pointsToSpend: pointsRequired
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const redeemPoints = async (req, res) => {
    try {
        const { phone } = req.body;

        // 1. Fetch Admin Rules to get the point conversion math
        const settings = await PointSetting.findOne();
        const minAmountPerUnit = settings?.minOrderAmount || 100; 
        const pointsPerUnit = settings?.pointsEarnedPerOrder || 10;
        const pointsRequired = settings?.pointsRequiredForDiscount || 100;

        // 2. Find the Latest Order for this phone number
        const latestOrder = await Order.findOne({ "customerDetails.phone": phone })
                                       .sort({ createdAt: -1 });

        if (!latestOrder) {
            return res.status(404).json({ success: false, message: "No orders found for this user." });
        }


        const lastAmt = latestOrder.pricing.total;
        const lastOrderPointsEarned = Math.floor(lastAmt / minAmountPerUnit) * pointsPerUnit;
        if (lastOrderPointsEarned < pointsRequired) {
            return res.status(400).json({ 
                success: false, 
                message: `Your last order earned ${lastOrderPointsEarned} points. You need ${pointsRequired} to redeem.` 
            });
        }

        const generatedCode = `RASI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 10);
        const user = await UserPoint.findOneAndUpdate(
            { userPhone: phone },
            {
                $push: {
                    activeCoupons: {
                        code: generatedCode,
                        discountValue: settings?.discountPercentage || 10,
                        expiresAt: expiryDate,
                        isUsed: false
                    },
                    history: {
                        pointsChanged: 0, // Recorded as a reward from last order
                        type: 'redeemed',
                        createdAt: new Date()
                    }
                }
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            couponCode: generatedCode,
            expiryDate: expiryDate,
            message: "Coupon generated from your last order!"
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// export const validateCoupon = async (req, res) => {
//     try {
//         const { phone, couponCode } = req.body;

//         const user = await UserPoint.findOne({ userPhone: phone });
//         if (!user) return res.status(404).json({ success: false, message: "User not found" });

//         // Find the specific coupon in the user's activeCoupons array
//         const coupon = user.activeCoupons.find(c => c.code === couponCode && !c.isUsed);

//         if (!coupon) {
//             return res.status(400).json({ success: false, message: "Invalid or already used coupon code" });
//         }

//         // Check if expired
//         if (new Date() > new Date(coupon.expiresAt)) {
//             return res.status(400).json({ success: false, message: "Coupon has expired" });
//         }

//         res.status(200).json({ 
//             success: true, 
//             discountValue: coupon.discountValue, 
//             message: "Coupon applied successfully!" 
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


// export const validateCoupon = async (req, res) => {
//     try {
//         const { phone, couponCode } = req.body;

//         const user = await UserPoint.findOne({ userPhone: phone });
//         if (!user) return res.status(404).json({ success: false, message: "User not found" });

//         // 1. Find the specific coupon
//         const coupon = user.activeCoupons.find(c => c.code === couponCode);

//         // 2. Strict validation checks
//         if (!coupon) {
//             return res.status(400).json({ success: false, message: "Invalid coupon code." });
//         }

//         if (coupon.isUsed) {
//             return res.status(400).json({ success: false, message: "This coupon has already been used." });
//         }

//         if (new Date() > new Date(coupon.expiresAt)) {
//             return res.status(400).json({ success: false, message: "This coupon expired after 10 days." });
//         }

//         res.status(200).json({ 
//             success: true, 
//             discountValue: coupon.discountValue, 
//             message: "Coupon applied! Discount will be deducted." 
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// export const markCouponUsed = async (req, res) => {
//     try {
//         const { phone, couponCode } = req.body;
//         await UserPoint.updateOne(
//             { userPhone: phone, "activeCoupons.code": couponCode },
//             { $set: { "activeCoupons.$.isUsed": true } }
//         );
//         res.status(200).json({ success: true });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };