
// // // // import app from "./app.js";
// // // // import dotenv from "dotenv"
// // // // import path from "path";
// // // // import { connectDB } from "./config/db.js";

// // // // dotenv.config({path:"Backend/config/config.env"})
// // // // const PORT=process.env.PORT || 5000

// // // // connectDB()



// // // // app.listen(4000,()=>{
// // // //     console.log(`server is running on http://localhost:${PORT}`)
// // // // })


// // // import dotenv from "dotenv";
// // // //dotenv.config({ path: "./Backend/config/config.env" });
// // // dotenv.config({ path: "./config/config.env" });

// // // import { connectDB } from "./config/db.js";

// // // const startServer = async () => {
// // //   const { default: app } = await import("./app.js");

// // //   const PORT = process.env.PORT || 5000;

// // //   await connectDB();

// // //   app.listen(PORT, () => {
// // //     console.log(`server is running on http://localhost:${PORT}`);
// // //   });
// // // };

// // // startServer();


// // import dotenv from "dotenv";
// // dotenv.config({ path: "./config/config.env" });

// // import { connectDB } from "./config/db.js";
// // import app from "./app.js"; // 👈 Move it to a clean top-level static import

// // const PORT = process.env.PORT || 4000;

// // const startServer = async () => {
// //   await connectDB();

// //   app.listen(PORT, () => {
// //     console.log(`Server is running on http://localhost:${PORT}`);
// //   });
// // };

// // startServer();


// import dotenv from "dotenv";
// // ✅ Changed path to point to the new .env file in your root Backend folder
// dotenv.config({ path: "./.env" }); 

// import { connectDB } from "./config/db.js";
// import app from "./app.js"; 

// const PORT = process.env.PORT || 4000;

// const startServer = async () => {
//   await connectDB();

//   app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//   });
// };

// startServer();

// ✅ CRITICAL: Load environment variables FIRST before anything else
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

// ✅ ONLY NOW import app and other modules (after env vars are loaded)
import { connectDB } from "./config/db.js";
import app from "./app.js"; 

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
};

startServer();