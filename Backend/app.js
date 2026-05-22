import express from "express"
import cors from "cors";
import category from "./route/categoryRoute.js"
import product from "./route/productRoute.js"
import user from "./route/userRoute.js"
import whislist from "./route/whislistRoute.js"
import cart from "./route/cartRoute.js"
import order from "./route/orderRoute.js"
import pincode from "./route/pincodeRoute.js";
import point from "./route/pointRoute.js"
import retailer from "./route/retailerRoute.js"
import retailerorder from "./route/retailerorderRoute.js"
const app=express();
app.use(cors())
app.use(express.json())

app.use("/api/v1/",category)
app.use("/api/v1/",product)
app.use("/api/v1/",user)
app.use("/api/v1/",whislist)
app.use("/api/v1/",cart)
app.use("/api/v1/",order)
app.use("/api/v1/",pincode)
app.use("/api/v1/",point)
app.use("/api/v1/",retailer)
app.use("/api/v1/",retailerorder)
export default app;


// import express from "express"
// import cors from "cors";

// const app = express();
// app.use(cors())
// app.use(express.json())

// // ✅ IMPORTANT: Import routes AFTER app is created
// // This ensures environment variables are available when routes/controllers load
// import category from "./route/categoryRoute.js"
// import product from "./route/productRoute.js"
// import user from "./route/userRoute.js"
// import whislist from "./route/whislistRoute.js"
// import cart from "./route/cartRoute.js"
// import order from "./route/orderRoute.js"
// import pincode from "./route/pincodeRoute.js";
// import point from "./route/pointRoute.js"
// import retailer from "./route/retailerRoute.js"
// import retailerorder from "./route/retailerorderRoute.js"

// // ✅ Register routes
// app.use("/api/v1/", category)
// app.use("/api/v1/", product)
// app.use("/api/v1/", user)
// app.use("/api/v1/", whislist)
// app.use("/api/v1/", cart)
// app.use("/api/v1/", order)
// app.use("/api/v1/", pincode)
// app.use("/api/v1/", point)
// app.use("/api/v1/", retailer)
// app.use("/api/v1/", retailerorder)

// export default app;