import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
 
    name:String,
    phoneno:{
     type:String,
     required: true,
     unique:true,
    },
   role: { 
    type: String, 
    enum: ['customer', 'retailer', 'admin'], 
    default: 'customer' 
  },
    email:String,
   password: { type: String, required: true },
   retailerCode: { 
        type: String, 
        sparse: true // Allows customers to have 'null' without errors
    },
    isRetailerVerified: { 
        type: Boolean, 
        default: false 
    },
 addresses: [{
        street: String,
        city: String,
        state: String,
        zipCode: String,
        isDefault: { type: Boolean, default: false }
    }]
}, { timestamps: true });

const User = mongoose.model("User",userSchema)
export default User;