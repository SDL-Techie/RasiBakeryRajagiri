// import mongoose from "mongoose";

// console.log(process.env.DB_URL)
// export const connectDB=()=>{
// mongoose
// .connect(process.env.DB_URL)
// .then((data)=>{console.log("db connected in your",data.connection.host)})
// .catch((err)=>{console.log(err.message)})
// }

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const data = await mongoose.connect(process.env.DB_URL);

    console.log("db connected in your", data.connection.host);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};