import mongoose from "mongoose";

const categorySchema=new mongoose.Schema({
  name: String,
  image: String,
  status: {
   type: String,
   default: "Active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

})

const Category= mongoose.model("Category",categorySchema)
export default Category