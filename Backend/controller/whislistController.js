import Wishlist from "../model/whislistModel.js";
import Product from "../model/productModel.js";

// 1. Add or Remove Item from Wishlist (Toggle)
export const toggleWishlist = async (req, res) => {
    try {
        const { userPhone, productId } = req.body;

        if (!userPhone || !productId) {
            return res.status(400).json({ success: false, message: "Phone and Product ID are required" });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Check if item already exists in wishlist for this user
        const existingItem = await Wishlist.findOne({ userPhone, productId });

        if (existingItem) {
            // If it exists, remove it (Unlike/Remove)
            await Wishlist.findByIdAndDelete(existingItem._id);
            return res.status(200).json({ 
                success: true, 
                message: "Removed from wishlist", 
                action: "removed" 
            });
        } else {
            // If it doesn't exist, add it
            const newItem = new Wishlist({ userPhone, productId });
            await newItem.save();
            return res.status(201).json({ 
                success: true, 
                message: "Added to wishlist", 
                action: "added",
                data: newItem 
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get All Wishlist Items for a User
export const getUserWishlist = async (req, res) => {
    try {
        const { phoneno } = req.params;

        // .populate("productId") fetches the actual product details (name, price, image)
        const wishlist = await Wishlist.find({ userPhone: phoneno })
            .populate("productId")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: wishlist.length,
            data: wishlist
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Clear Entire Wishlist
export const clearWishlist = async (req, res) => {
    try {
        const { phoneno } = req.params;
        await Wishlist.deleteMany({ userPhone: phoneno });
        
        res.status(200).json({ 
            success: true, 
            message: "Wishlist cleared successfully" 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};