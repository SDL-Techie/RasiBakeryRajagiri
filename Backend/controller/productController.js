import Product from "../model/productModel.js"
import Category from "../model/categoryModel.js"


export const createproduct=async(req,res)=>{
    try{
        const product=await Product.create(req.body)
        res.status(200).json({
            success:true,
            message:"product created successfully",
            data:product,
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

// export const getallproduct=async(req,res)=>{
// try{
//    const product=await Product.find().populate('category')
//     res.status(200).json({
//       success: true,
//       data: product
//     });
// }catch(err){
//         res.status(500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }


export const getallproduct = async (req, res) => {
    try {
        const { search, minPrice, maxPrice, category } = req.query;
        let query = {};

        // Search by Name
        if (search) {
            query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
        }

        // Filter by Price Range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Filter by Category ID (if passed as query param)
        if (category) {
            query.category = category;
        }

        const products = await Product.find(query).populate('category');

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getsingleproduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


export const updateproduct = async (req, res) => {
    try {
        // { new: true } returns the modified document rather than the original
        // { runValidators: true } ensures the update follows your schema rules
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// export const deleteproduct = async (req, res) => {
//     try {
//         const product = await Product.findByIdAndDelete(req.params.id);

//         if (!product) {
//             return res.status(404).json({ success: false, message: "Product not found" });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Product deleted successfully"
//         });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };



export const getProductsByCategoryName = async (req, res) => {
    try {
        // This matches the /:categoryName in your route
        const { categoryName } = req.params; 

        // 1. Find the category document
        const categoryDoc = await Category.findOne({ 
            name: { $regex: new RegExp(`^${categoryName}$`, 'i') } 
        });

        if (!categoryDoc) {
            return res.status(404).json({ 
                success: false, 
                message: "Category not found" 
            });
        }

        // 2. Find products belonging to that Category ID
        const products = await Product.find({ category: categoryDoc._id }).populate('category');

        res.status(200).json({
            success: true,
            category: categoryDoc.name,
            count: products.length,
            data: products
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


// export const bulkImportProducts = async (req, res) => {

//   try {
//     const { products } = req.body;

//     if (!products || !products.length) {
//       return res.status(400).json({
//         success: false,
//         message: "No products found",
//       });
//     }

//     const insertedProducts =
//       await Product.insertMany(products);

//     res.status(201).json({
//       success: true,
//       count: insertedProducts.length,
//       data: insertedProducts,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


export const bulkImportProducts = async (req, res) => {
  try {
    // console.log("Received Products:", req.body.products);

    const { products } = req.body;

    if (!products || !products.length) {
      return res.status(400).json({
        success: false,
        message: "No products found",
      });
    }

    const insertedProducts = await Product.insertMany(products);

    res.status(201).json({
      success: true,
      count: insertedProducts.length,
      data: insertedProducts,
    });
  } catch (error) {
    console.error("Bulk Import Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};