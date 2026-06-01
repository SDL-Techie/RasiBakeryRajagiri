import express from "express"
import cors from "cors";
import category from "./route/categoryRoute.js"
import product from "./route/productRoute.js"
import user from "./route/userRoute.js"
import whislist from "./route/whislistRoute.js"
import cart from "./route/cartRoute.js"
import order from "./route/orderRoute.js"
import pincode from "./route/pincodeRoute.js";
import retailer from "./route/retailerRoute.js"
import retailerorder from "./route/retailerorderRoute.js"
import pointsetting from "./route/pointsettingRoute.js"
import userpoint from "./route/userpointRoute.js"
import coupon from "./route/couponRoute.js"
import cookieParser from "cookie-parser";
const app=express();
app.use(cookieParser());
app.use(cors())
app.use(express.json())

app.use("/api/v1/",category)
app.use("/api/v1/",product)
app.use("/api/v1/",user)
app.use("/api/v1/",whislist)
app.use("/api/v1/",cart)
app.use("/api/v1/",order)
app.use("/api/v1/",pincode)
app.use("/api/v1/",retailer)
app.use("/api/v1/",retailerorder)
app.use("/api/v1/",pointsetting)
app.use("/api/v1/",userpoint)
app.use("/api/v1/",coupon)
export default app;

