import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userPhone: {
        type: String,
        required: true,
        unique: true, // One cart per phone number
        index: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
            min: [1, 'Quantity cannot be less than 1']
        }
    }]
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;