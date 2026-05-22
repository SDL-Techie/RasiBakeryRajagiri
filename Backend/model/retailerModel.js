// import mongoose from "mongoose";

// const retailerCodeSchema = new mongoose.Schema({
//     code: { 
//         type: String, 
//         required: true, 
//         unique: true 
//     },
//     assignedTo: { 
//         type: String, // e.g., "Arun's General Store"
//         required: true 
//     },
//     isUsed: { 
//         type: Boolean, 
//         default: false 
//     },
//     createdAt: { 
//         type: Date, 
//         default: Date.now, 
//         // expires: '7d' // Optional: Code expires after 7 days if not used
//     }
// });

// const RetailerCode = mongoose.model("RetailerCode", retailerCodeSchema);
// export default RetailerCode;


import mongoose from "mongoose";

const retailerCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    assignedTo: { type: String }, 
    isUsed: { type: Boolean, default: false },
    activatedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        default: null 
    }
}, { timestamps: true });

const Retailer=mongoose.model("RetailerCode", retailerCodeSchema);
export default Retailer;