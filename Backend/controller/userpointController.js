import PointSetting from "../model/pointsetting.js";
import UserPoint from "../model/userpointModel.js";
import Order from "../model/orderModel.js";


export const getUserPoints = async(req,res)=>{
    try{
      const {phone}=req.params;

      const settings=await PointSetting.findOne();
      if (!settings) {
            return res.status(404).json({ 
                success: false, 
                message: "Point settings configurations not found." 
            });
        }
      const userPoint=await UserPoint.findOne({userPhone:phone})

      const totalSpentAggregate=await Order.aggregate([
        {
            $match:{
                "customerDetails.phone":phone
            }
        },
        {
            $group:{
                _id:"$customerDetails.phone",
                totalAmountSpent:{
                    $sum:{
                        $cond:[
                            {$eq:["$status","Cancelled"]},
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
      if(!userPoint){
        const canRedeem = liveCalculatedPoints >= settings.pointsRequiredForDiscount;
        const pointsNeeded = canRedeem ? 0 : (settings.pointsRequiredForDiscount - liveCalculatedPoints);
        return res.status(200).json({
            sucess:true,
            currentPoints:liveCalculatedPoints,
            Totalspent:finalAmountSpent,
            Points:liveCalculatedPoints,
            canRedeem:canRedeem,
            pointNeededtoRedeem:pointsNeeded,
            discount:settings.discountPercentage,
            loyaltystatus:{
                requiredpointToUnlockdiscount:settings.pointsRequiredForDiscount,
                Task:`Reach ${settings.pointsRequiredForDiscount} points for ${settings.discountPercentage}% off`,
                Rules:`Earn ${settings.pointsEarnedPerOrder} points for every ₹${settings.minOrderAmount} spent`,
                currentprogress:`${liveCalculatedPoints}/${settings.pointsRequiredForDiscount}`
            }
        })
      }
    const currentPoints = userPoint.currentPoints !== undefined ? userPoint.currentPoints : liveCalculatedPoints;
    const totalPointsEarned = userPoint.totalPointsEarned || liveCalculatedPoints;
    const canRedeem = currentPoints >= settings.pointsRequiredForDiscount;
    const pointsNeeded = canRedeem ? 0 : (settings.pointsRequiredForDiscount - currentPoints);
    return res.status(200).json({
            success: true,
            currentPoints: currentPoints, 
            OrderAmount: finalAmountSpent,               // 🎯 Total Amount Spent (Skips Cancelled)
            // PointsEarned: liveCalculatedPoints,
            PointsEarned: totalPointsEarned,
            canRedeem: canRedeem,
            pointsNeededToRedeem: pointsNeeded,
            discountAvailable: settings.discountPercentage,
            loyaltyStatus: {
                requiredpointToUnlockdiscount: settings.pointsRequiredForDiscount,
                Task: `Reach ${settings.pointsRequiredForDiscount} points for ${settings.discountPercentage}% off`,
                Rules: `Earn ${settings.pointsEarnedPerOrder} points for every ₹${settings.minOrderAmount} spent`,
                currentProgress: `${currentPoints}/${settings.pointsRequiredForDiscount}` 
            }
        });}
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

}


// export const getalluserpoint = async(req,res)=>{
//     try{
//         const userPoints=await UserPoint.find();
//         res.status(200).json({
//             success:true,
//             data:userPoints
//         })
//     }catch(error){
//         return res.status(500).json({ success: false, message: error.message });
//     }
// }


export const getalluserpoint = async (req, res) => {
    try {
        // 1. Fetch global point configuration rules
        const settings = await PointSetting.findOne();
        if (!settings) {
            return res.status(404).json({ 
                success: false, 
                message: "Point settings configurations not found." 
            });
        }

        // 2. Fetch all manually updated loyalty profile overrides
        const manualUserPoints = await UserPoint.find();
        const userPointsMap = new Map(manualUserPoints.map(up => [up.userPhone, up]));

        // 3. Aggregate all non-cancelled order data for all users across the system
        const ordersAggregation = await Order.aggregate([
            {
                $match: {
                    "customerDetails.phone": { $ne: null }
                }
            },
            {
                $group: {
                    _id: "$customerDetails.phone",
                    customerName: { $first: "$customerDetails.name" }, // Grabs customer name if available
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

        // 4. Map and build individual dashboards live for every customer found
        const computedUsersList = ordersAggregation.map(orderGroup => {
            const phone = orderGroup._id;
            const finalAmountSpent = orderGroup.totalAmountSpent;
            
            // Calculate baseline historical live points from aggregate spending totals
            const liveCalculatedPoints = Math.floor(finalAmountSpent / settings.minOrderAmount) * settings.pointsEarnedPerOrder;
            
            // Check if this specific user has a recorded custom override profile in the DB
            const userProfileOverride = userPointsMap.get(phone);

            // Establish final values checking for system profile overrides (e.g. tracking redemptions)
            const currentPoints = userProfileOverride?.currentPoints !== undefined ? userProfileOverride.currentPoints : liveCalculatedPoints;
            const totalPointsEarned = userProfileOverride?.totalPointsEarned || liveCalculatedPoints;
            const canRedeem = currentPoints >= settings.pointsRequiredForDiscount;
            const pointsNeeded = canRedeem ? 0 : (settings.pointsRequiredForDiscount - currentPoints);

            return {
                phone: phone,
                customerName: orderGroup.customerName || "Loyalty Member",
                currentPoints: currentPoints,
                totalSpent: finalAmountSpent,
                lifetimePointsEarned: totalPointsEarned,
                canRedeem: canRedeem,
                pointsNeededToRedeem: pointsNeeded,
                loyaltyStatus: {
                    requiredpointToUnlockdiscount: settings.pointsRequiredForDiscount,
                    currentProgress: `${currentPoints}/${settings.pointsRequiredForDiscount}`
                }
            };
        });

        // Return compiled dashboards for all customers
        return res.status(200).json({
            success: true,
            results: computedUsersList.length,
            data: computedUsersList
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


