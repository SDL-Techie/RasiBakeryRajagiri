import Cart from "../model/cartModel.js";


export const addToCart = async (req, res) => {
    try {
        const { userPhone, productId, quantity = 1 } = req.body;

        let cart = await Cart.findOne({ userPhone });

        if (cart) {
            // Check if product already exists in the items array
            const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);

            if (itemIndex > -1) {
                // If exists, increment quantity (Number() ensures no string concatenation)
                cart.items[itemIndex].quantity += Number(quantity);
            } else {
                // If new item, push to array
                cart.items.push({ productId, quantity: Number(quantity) });
            }
            await cart.save();
        } else {
            // Create new cart for user if none exists
            cart = await Cart.create({
                userPhone,
                items: [{ productId, quantity: Number(quantity) }]
            });
        }

        res.status(200).json({ success: true, message: "Added to cart", data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getCart = async (req, res) => {
    try {
        const { phoneno } = req.params;
        const cart = await Cart.findOne({ userPhone: phoneno })
            .populate("items.productId");
            
        // Return empty items array if cart doesn't exist yet
        res.status(200).json({ 
            success: true, 
            data: cart || { userPhone: phoneno, items: [] } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCartQuantity = async (req, res) => {
    try {
        const { userPhone, productId, quantity } = req.body;

        if (Number(quantity) < 1) {
            return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
        }

        const cart = await Cart.findOneAndUpdate(
            { userPhone, "items.productId": productId },
            { $set: { "items.$.quantity": Number(quantity) } },
            { new: true }
        ).populate("items.productId");

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart or Item not found" });
        }

        res.status(200).json({ success: true, message: "Quantity updated", data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const removeFromCart = async (req, res) => {
    try {
        const { userPhone, productId } = req.body;

        const cart = await Cart.findOneAndUpdate(
            { userPhone },
            { $pull: { items: { productId: productId } } },
            { new: true }
        ).populate("items.productId");

        res.status(200).json({ success: true, message: "Item removed", data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const clearCart = async (req, res) => {
    try {
        const { phoneno } = req.params;

        await Cart.findOneAndDelete({ userPhone: phoneno });

        res.status(200).json({ success: true, message: "Cart cleared successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};