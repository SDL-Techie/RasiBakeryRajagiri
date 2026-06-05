import path from "path";
import fs from "fs";

import User from "../model/userModel.js";
import Retailer from "../model/retailerModel.js";
import Product from "../model/productModel.js";
import Category from "../model/categoryModel.js";
import Order from "../model/orderModel.js";
import RetailerOrder from "../model/retailerorderModel.js";
import Cart from "../model/cartModel.js";
import Wishlist from "../model/whislistModel.js";
import Coupon from "../model/couponModel.js";
import Pincode from "../model/pincodeModel.js";
import UserPoint from "../model/userpointModel.js";
import PointSetting from "../model/pointsetting.js";


export const createBackup = async (req, res) => {
  try {
    const backupData = {
    //   users: await User.find().lean(),
     users: await User.find()
.select("+password")
.lean(),
      retailers: await Retailer.find().lean(),
      products: await Product.find().lean(),
      categories: await Category.find().lean(),
      orders: await Order.find().lean(),
      retailerOrders: await RetailerOrder.find().lean(),
      carts: await Cart.find().lean(),
      wishlists: await Wishlist.find().lean(),
      coupons: await Coupon.find().lean(),
      pincodes: await Pincode.find().lean(),
      userPoints: await UserPoint.find().lean(),
      pointSettings: await PointSetting.find().lean(),
      backupDate: new Date().toISOString()
    };

    const filePath = path.join(
      process.cwd(),
      "backups",
      `backup-${Date.now()}.json`
    );

    // Create backups directory if it doesn't exist
    const backupsDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));

    res.download(filePath);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const restoreBackup = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const backupData = JSON.parse(fs.readFileSync(req.file.path, 'utf-8'));

    const {
      users = [],
      retailers = [],
      products = [],
      categories = [],
      orders = [],
      retailerOrders = [],
      carts = [],
      wishlists = [],
      coupons = [],
      pincodes = [],
      userPoints = [],
      pointSettings = []
    } = backupData;

    // Clear existing data
    await User.deleteMany({});
    await Retailer.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});
    await RetailerOrder.deleteMany({});
    await Cart.deleteMany({});
    await Wishlist.deleteMany({});
    await Coupon.deleteMany({});
    await Pincode.deleteMany({});
    await UserPoint.deleteMany({});
    await PointSetting.deleteMany({});

    // Insert data
    if (users.length) await User.insertMany(users);
    if (retailers.length) await Retailer.insertMany(retailers);
    if (products.length) await Product.insertMany(products);
    if (categories.length) await Category.insertMany(categories);
    if (orders.length) await Order.insertMany(orders);
    if (retailerOrders.length) await RetailerOrder.insertMany(retailerOrders);
    if (carts.length) await Cart.insertMany(carts);
    if (wishlists.length) await Wishlist.insertMany(wishlists);
    if (coupons.length) await Coupon.insertMany(coupons);
    if (pincodes.length) await Pincode.insertMany(pincodes);
    if (userPoints.length) await UserPoint.insertMany(userPoints);
    if (pointSettings.length) await PointSetting.insertMany(pointSettings);

    // Clean up uploaded file
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(200).json({
      success: true,
      message: "Database restored successfully from JSON backup"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};