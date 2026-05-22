import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    // Store the phone number to identify the user
    userPhone: {
        type: String,
        required: true,
        index: true // Indexed for faster fetching
    },
    // Reference the Product ID from your existing Product model
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    // Optional: Store a snapshot of name/price if you want to avoid extra joins
    addedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Prevent duplicate items for the same user
wishlistSchema.index({ userPhone: 1, productId: 1 }, { unique: true });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;