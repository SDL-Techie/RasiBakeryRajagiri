import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema=new mongoose.Schema({
 
    name:String,
    phoneno:{
     type:String,
     required: true,
     unique:true,
    },
   role: { 
    type: String, 
    // enum: ['customer', 'retailer', 'admin'], 
    default: 'customer' 
  },
email:String,
   password: { type: String, 
    required: true,
    select: false // Exclude password from query results by default
},
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
    }],

     pwaInstalled: {
    type: Boolean,
    default: false
  } 

    
}, { timestamps: true });


userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password=await bcryptjs.hash(this.password,10);
})

userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id ,role:this.role},
        process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });
}


userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcryptjs.compare(enteredPassword,this.password);
}

const User = mongoose.model("User",userSchema)
export default User;