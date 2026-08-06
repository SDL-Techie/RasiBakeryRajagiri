import Coupon from "../model/couponModel.js";
import UserPoint from "../model/userpointModel.js";
import PointSetting from "../model/pointsetting.js";
import Order from "../model/orderModel.js"; // Added to calculate dynamic balances

export const claimCoupon = async (req, res) => {
    try {
        const { phone } = req.body;
        // console.log("Phone from body:", phone);

        if (!phone) {a
            return res.status(400).json({ success: false, message: "Phone number is required." });
        }

        // 1. Fetch global business rules configurations
        const settings = await PointSetting.findOne();
        if (!settings) {
            return res.status(404).json({ success: false, message: "Point settings rules not found." });
        }

        const pointNeededForDiscount = settings.pointsRequiredForDiscount; // e.g., 100
        const discountPercentage = settings.discountPercentage || 20;       // e.g., 20%

        // 2. Fetch user point record override profile
        let userPoint = await UserPoint.findOne({ userPhone: phone });
        //console.log("UserPoint from DB:", userPoint);

        // 🌟 CRITICAL FIX: If the document doesn't exist, calculate live points from orders
        if (!userPoint) {
            //console.log(`No explicit UserPoint document for ${phone}. Calculating live aggregate spend...`);
            
            const totalSpentAggregate = await Order.aggregate([
                {
                    $match: {
                        "customerDetails.phone": phone
                    }
                },
                {
                    $group: {
                        _id: "$customerDetails.phone",
                        totalAmountSpent: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$status", "Cancelled"] },
                                    0,
                                    "$pricing.total"
                                ]
                            }
                        }
                    }
                }
            ]);

            const finalAmountSpent = totalSpentAggregate.length > 0 ? totalSpentAggregate[0].totalAmountSpent : 0;
            const liveCalculatedPoints = Math.floor(finalAmountSpent / settings.minOrderAmount) * settings.pointsEarnedPerOrder;

            // Validation Guard for dynamic profile path
            if (liveCalculatedPoints < pointNeededForDiscount) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Insufficient balance. You have ${liveCalculatedPoints} points based on spending history, but need ${pointNeededForDiscount}.` 
                });
            }

            // Create the user's very first loyalty record on the fly
            userPoint = new UserPoint({
                userPhone: phone,
                currentPoints: liveCalculatedPoints,
                totalPointsEarned: liveCalculatedPoints,
                totalPointsRedeemed: 0
            });
            
            //console.log("Created a new UserPoint document profile successfully.");
        }

        // 3. Validation Guard for returning users (already have a document override)
        if (userPoint.currentPoints < pointNeededForDiscount) {
            return res.status(400).json({ 
                success: false, 
                message: `Insufficient balance. You have ${userPoint.currentPoints} points but need ${pointNeededForDiscount}.` 
                });
        }

        // 4. THE DECREASE: Deduct the milestone points from their balance
        userPoint.currentPoints -= pointNeededForDiscount;
        userPoint.totalPointsRedeemed += pointNeededForDiscount; 
        await userPoint.save(); // Commits changes or registers user explicitly to MongoDB

        // 5. GENERATE CODE: Create a unique random coupon string starting with RASI
        const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
        const generatedCode = `RASI-${randomCode}`;

        // 6. Set Expiration (valid for 30 days)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        // 7. Save the new coupon record into the database
        const newCoupon = await Coupon.create({
            code: generatedCode,
            userPhone: phone,
            discountPercentage: discountPercentage,
            expiryDate: expiryDate,
            isUsed: false
        });

        // 8. RESPONSE SUMMARY ARRAY MAPS
        return res.status(201).json({
            success: true,
            message: "Success! Points deducted and coupon generated.",
            discountPercentage: discountPercentage,
            pointNeededForDiscount: pointNeededForDiscount,
            currentPointsAfterDeduction: userPoint.currentPoints,
            code: newCoupon.code,
            expiryDate: newCoupon.expiryDate
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const validateCoupon = async (req, res) => {
    try {
      const { couponCode, phone } = req.body;

        if (!couponCode || !phone) {
            return res.status(400).json({ 
                success: false, 
                message: "Both coupon code and phone number are required for validation." 
            });
        }

        // 1. Check if the coupon exists in the database
        const coupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase() });
        if (!coupon) {
            return res.status(404).json({ 
                success: false, 
                message: "Invalid coupon code. This coupon does not exist." 
            });
        }

        // 2. Security Guard: Ensure this coupon belongs to the requesting phone number
        if (coupon.userPhone !== phone) {
            return res.status(403).json({ 
                success: false, 
                message: "Unauthorized. This coupon belongs to a different mobile number." 
            });
        }

        // 3. Usage Guard: Ensure it hasn't been used yet
        if (coupon.isUsed) {
            return res.status(400).json({ 
                success: false, 
                message: "This coupon has already been redeemed and cannot be used again." 
            });
        }

        // 4. Expiration Guard: Ensure the current time hasn't passed the expiry date
        const now = new Date();
        if (now > new Date(coupon.expiryDate)) {
            return res.status(400).json({ 
                success: false, 
                message: "This coupon has expired." 
            });
        }

        // Coupon is fully valid! Return information to the frontend checkout screen
        return res.status(200).json({
            success: true,
            message: "Coupon is valid and ready to apply!",
            discountValue: coupon.discountPercentage,
            code: coupon.code
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const markCouponAsUsed = async (req, res) => {
    try {
     const { couponCode, phone } = req.body;

        if (!couponCode) {
            return res.status(400).json({ success: false, message: "Coupon code is required." });
        }

        const coupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase(),userPhone: phone});
        if (!coupon) {
            return res.status(404).json({ success: false, message: "Coupon not found." });
        }

        if (coupon.isUsed) {
            return res.status(400).json({ success: false, message: "Coupon is already marked as used." });
        }

        // Update status flags
        coupon.isUsed = true;
        await coupon.save();

        return res.status(200).json({
            success: true,
            message: "Coupon successfully redeemed and locked from future use."
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};