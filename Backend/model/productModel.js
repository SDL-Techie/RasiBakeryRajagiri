import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
name:String,
price:String,
category:{
type:mongoose.Schema.Types.ObjectId,
ref:'Category'
},
wholesaleprice:String,
oldprice:String,
description:String,
status:{
    type:String,
    default:"Active"
},
ingredients:String,
productimage:String,
weight: {          // in kg, e.g. 0.5, 1, 2
    type: Number,
    default: 0
  },
})

const Product=mongoose.model("Product",productSchema)
export default Product;