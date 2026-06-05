import RetailerOrder from "../model/retailerorderModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// POST /api/v1/createretailerorder
export const createRetailerOrder = async (req, res) => {
  try {
    const { retailerDetails, items, logistics, pricing, payment } = req.body;

    // Reject UPI — should use initiateRetailerPayment instead
    if (payment?.method?.toLowerCase() === "upi") {
      return res.status(400).json({ success: false, message: "Use /initiate-retailer-payment for UPI orders." });
    }

    const currentYear      = new Date().getFullYear();
    const orderCount       = await RetailerOrder.countDocuments();
    const sequence         = String(orderCount + 1).padStart(3, "0");
    const generatedOrderId = `RASI-Retail-${currentYear}${sequence}`;

    const savedOrder = await new RetailerOrder({
      orderId: generatedOrderId,
      retailerDetails, 
      items, 
      logistics, 
      pricing, 
      payment, 
      status: "Ordered",
    }).save();

    // ✅ WhatsApp integration removed from here successfully

    return res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/v1/verify-retailer-payment
export const verifyRetailerPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderPayload,          // ← full order data sent from frontend
    } = req.body;

    // 1. Verify signature first
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature." });
    }

    // 2. Only NOW save the order to DB
    const currentYear      = new Date().getFullYear();
    const orderCount       = await RetailerOrder.countDocuments();
    const sequence         = String(orderCount + 1).padStart(3, "0");
    const generatedOrderId = `RASI-Retail-${currentYear}${sequence}`;

    const savedOrder = await new RetailerOrder({
      orderId: generatedOrderId,
      ...orderPayload,
      payment: {
        ...orderPayload.payment,
        method:            "upi",
        status:            "paid",
        razorpayOrderId:   razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt:            new Date(),
      },
    }).save();

    // ✅ WhatsApp integration removed from here successfully

    return res.status(201).json({ success: true, order: savedOrder });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/v1/retailer-order/:id
export const updateRetailerOrderStatus = async (req, res) => {
  try {
    const updated = await RetailerOrder.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.status } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/retailerorder/:userId
export const getRetailerOrders = async (req, res) => {
  try {
    const orders = await RetailerOrder.find({ "retailerDetails.userId": req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/all-retailer-orders
export const getAllRetailerOrders = async (req, res) => {
  try {
    const allOrders = await RetailerOrder.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: allOrders.length, data: allOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/retailer-order/phone/:phone
export const getRetailerOrdersByPhone = async (req, res) => {
  try {
    const orders = await RetailerOrder.find({ "retailerDetails.phone": req.params.phone }).sort({ createdAt: -1 });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found for this phone number" });
    }
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/v1/initiate-retailer-payment
export const initiateRetailerPayment = async (req, res) => {
  try {
    const { pricing, retailerDetails } = req.body;

    const razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount:   Math.round((pricing.total || 0) * 100),
      currency: "INR",
      receipt:  `ret_${Date.now()}`,
      notes: {
        businessName: retailerDetails?.businessName,
        phone:        retailerDetails?.phone,
      },
    });

    return res.status(200).json({
      success:  true,
      razorpay: {
        orderId:  razorpayOrder.id,
        amount:   razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key:process.env.RAZORPAY_KEY_ID,
        
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


export const updateRetailerOrder = async (req, res) => {
  try {
    const updatedOrder =
      await RetailerOrder.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};