import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import Order from "../model/orderModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";
// Debug logs to verify your env vars are actually populated when this file runs

const razorpayInstance=new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET
})


export const initiateRazorpayPayment = async (req, res) => {
  try {
    const { amount } = req.body; // Raw numeric pricing total (e.g., 450)

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid final payment amount value provided." 
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay processes money values in currency sub-units (Paise)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    return res.status(200).json({
      success: true,
      message: "Razorpay tracking session initialized successfully",
      id: razorpayOrder.id,           // Send this back to frontend option modal configuration
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
    });
  } catch (error) {
    console.error("Razorpay Order Generation Failure:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Backend failed to process checkout generation with Razorpay servers" 
    });
  }
};

export const verifyRazorpayPaymentAndCreateOrder = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      customerDetails,
      items,
      pricing,
      deliveryDate
    } = req.body;

    // 1. Re-generate the crypto signature using your local Secret Key to check for security tampering
    const secretSignatureBody = `${razorpay_order_id}|${razorpay_payment_id}`;
    
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(secretSignatureBody)
      .digest("hex");

    // 2. Validate signatures match securely
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: "Transaction signature mismatch. Security authorization denied." 
      });
    }

    // 3. Assemble document variables matching your new updated Order Schema matrix layout
    const confirmedOnlineOrder = new Order({
      customerDetails,
      items,
      pricing,
      deliveryDate,
      payment: {
        method: 'razorpay',
        status: 'Paid' // Flag as successfully processed
      },
      status: 'Ordered',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature
    });

    // 4. Commit verified document securely to MongoDB collection storage
    const savedRecord = await confirmedOnlineOrder.save();

    return res.status(201).json({
      success: true,
      message: "Online transaction processed and verified successfully",
      data: savedRecord
    });

  } catch (error) {
    console.error("Razorpay Validation Route Error Block:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal transactional verification workflow failed" 
    });
  }
};



export const createordercod = async (req, res) => {
  try {
    // Inject custom sub-property payment details to keep compliance with layout expectations
    const finalCodPayload = {
      ...req.body,
      payment: {
        method: req.body.payment?.method || 'cod',
        status: 'Pending' // Stays pending until delivery person accepts cash
      }
    };

    const newCodOrder = await Order.create(finalCodPayload);
    
    return res.status(200).json({
      success: true,
      message: "Cash on Delivery order booked successfully",
      data: newCodOrder
    });
  } catch (error) {
    console.error("Create COD order error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create traditional checkout instance"
    });
  }
};

export const getallordercod=async(req,res)=>{
  try{
    const getallordercod=await Order.find();
    res.status(200).json({
      success:true,
      message:"All order fetched successfully",
      data:getallordercod
    });
  }
  catch(error){
    console.error("Get all orders error:", error.message);
    res.status(500).json({
      success:false,
      message:"Failed to fetch orders"
    });
  }
}

export const getordercodbyphone = async (req, res) => {
  try {
    const { phone } = req.params;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number parameter is required"
      });
    }

    const customerOrders = await Order.find({
      $or: [
        { "customerDetails.phone": phone.trim() },
        { "customerDetails.mobile": phone.trim() }
      ]
    }).sort({ createdAt: -1 }); 

    if (!customerOrders || customerOrders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders found for this phone number",
        data: [] 
      });
    }

    return res.status(200).json({  
      success: true,
      message: "Orders fetched successfully",
      data: customerOrders 
    });

  } catch (error) {
    console.error("Get order by phone error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order history",
      data: []
    });
  }
};

export const calculateTotalSpentFromOrders = async (req, res) => {
  try {
    const { phone } = req.params;
    const orders = await Order.find({ "customerDetails.phone": phone });
    const grandTotal = orders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0);

    res.status(200).json({ success: true, count: orders.length, totalAmountSpent: grandTotal });
  } catch (error) {
    console.error("Error calculating total spent:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getOrderStatusStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 }, totalRevenue: { $sum: "$pricing.total" } } },
      { $project: { _id: 0, status: "$_id", count: 1, totalRevenue: 1 } },
    ]);

    const summary = {
      totalOrders: stats.reduce((acc, curr) => acc + curr.count, 0),
      breakdown: stats,
    };

    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    console.error("Error fetching order stats:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const updatedOrder = await Order.findOneAndUpdate(
      { $or: [{ orderId: id }, { _id: id.length === 24 ? id : null }] },
      { $set: { status: status } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Cancel an order by its MongoDB ID
 * @route   PUT /api/v1/order/cancel/:id
 * @access  Public / Private (Depending on authentication)
 */
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the order
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "❌ Order not found."
      });
    }

    // 2. Prevent cancelling if already Delievered or Shipped
    if (order.status === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "⚠️ Cannot cancel an order that has already been delivered."
      });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "ℹ️ This order is already cancelled."
      });
    }

    // 3. Update the order status
    order.status = "Cancelled";
    
    // Optional: Log cancellation timestamp or reason if your schema supports it
    // order.cancelledAt = new Date(); 

    // 4. Save the order changes (safely executes pre-hooks)
    await order.save();

    // 5. Optional: Restock items back to your Product inventory if needed
    /*
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity }
        });
      }
    }
    */

    return res.status(200).json({
      success: true,
      message: "🎉 Order cancelled successfully.",
      order
    });

  } catch (error) {
    console.error("Order Cancellation Failure:", error);
    return res.status(500).json({
      success: false,
      message: "❌ Internal Server Error. Could not process order cancellation.",
      error: error.message
    });
  }
};