import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { ArrowLeft, Weight } from "lucide-react";
import axios from 'axios';
// import toast from 'react-hot-toast';
import toast, { Toaster } from 'react-hot-toast';
import "./ProductDetails.css"
import {
  Star, ShoppingCart, Zap, Heart, Share2,
  Loader, Leaf, Info, Loader2
} from 'lucide-react';
import SEO from '@/src/components/SEO';



interface ProductData {
  id: string;
  name: string;
  categoryName?: string;
  price: number;
  wholesaleprice?: number;
  oldPrice?: number;
  description: string;
  ingredients: string[];
  weight?: number;
  image: string;
  images: string[];
  rating?: number;
  reviews?: number | string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  //const { customer } = useCustomerAuth();
  const { customer, isLoggedIn } = useCustomerAuth()
  // const [product, setProduct] = useState<ProductData>;
const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false); 
  const [cartLoading, setCartLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);

  // const userPhone = localStorage.getItem('userPhone');
  // const isRetailer = String(customer?.role).toLowerCase() === "retailer";


const userPhone = customer?.mobile || localStorage.getItem('userPhone') || localStorage.getItem('customerMobile');


const isRetailer = isLoggedIn && customer?.role?.toLowerCase() === 'retailer';

  // ✅ Wishlist Status Sync
  useEffect(() => {
    const checkWishlistStatus = async () => {
      // if (!userPhone || !id) return;
      if (!isLoggedIn || !userPhone || !id) return;
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/whislist/${userPhone}`);
        if (res.data.success && Array.isArray(res.data.data)) {
          const isInWishlist = res.data.data.some((item: any) => {
            const prodId = item.productId?._id || item.productId;
            return prodId === id;
          });
          setIsWishlisted(isInWishlist);
        }
      } catch (error) {
        console.error("Wishlist sync error:", error);
      }
    };
    checkWishlistStatus();
  }, [id, userPhone]);

  // ✅ Fetch Product Data
  useEffect(() => {
    const fetchProduct = async () => {
       if (!id) return;
      // if (!isLoggedIn || !userPhone || !id) return;
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/product/${id}`);
        const data = res.data.data;
        const gallery = data.images && data.images.length > 0 ? data.images : [data.productimage];
        const ingredientList = data.ingredients 
          ? data.ingredients.split(/ {2,}/).filter((i: string) => i.trim() !== "") 
          : [];

        setProduct({
          id: data._id,
          name: data.name,
          price: Number(data.price),
          oldPrice: data.oldprice ? Number(data.oldprice) : undefined,
          wholesaleprice: data.wholesaleprice ? Number(data.wholesaleprice) : undefined,
          description: data.description,
          ingredients: ingredientList,
          image: data.productimage,
          images: gallery,
          categoryName: data.category?.name,
          weight: data.weight
        });
      } catch (error) {
        toast.error("Failed to load product");
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const toggleWishlist = async () => {
    // if (!userPhone) return toast.error("Please login to manage wishlist");
    if (!isLoggedIn || !userPhone) {
      toast.error("Please login to manage your wishlist.");
      return navigate('/login');
    }
    setIsSyncing(true);
    try {
      const res = await axios.post('http://localhost:4000/api/v1/whislist', {
        userPhone,
        productId: id
      });
      if (res.data.success) {
        setIsWishlisted(res.data.action === 'added');
        toast.success(res.data.action === 'added' ? "Added to Wishlist" : "Removed from Wishlist");
      }
    } catch (error) {
      toast.error("Wishlist update failed");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddToCart = async () => {
    // if (!userPhone) return toast.error("Please login to add to cart");
    if (!isLoggedIn || !userPhone) {
      toast.error("Please login to add items to your cart.");
      return navigate('/login');
    }
    setCartLoading(true);
    try {
      await axios.post('http://localhost:4000/api/v1/cart', {
        userPhone,
        productId: id,
        quantity: 1
      });
      toast.success("Added to Cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  // ✅ Fixed Buy Now Logic: Await the API call before moving to checkout
  // const handleBuyNow = async () => {
  //   if (!userPhone) return toast.error("Please login to purchase");
  //   setBuyNowLoading(true);
  //   try {
  //     const res = await axios.post('http://localhost:4000/api/v1/cart', {
  //       userPhone,
  //       productId: id,
  //       quantity: 1
  //     });
  //     if (res.data.success) {
  //       navigate('/checkout');
  //     }
  //   } catch (error) {
  //     toast.error("Failed to process Buy Now");
  //   } finally {
  //     setBuyNowLoading(false);
  //   }
  // };


const handleBuyNow = () => {
  // if (!userPhone) return toast.error("Please login to purchase");
  if (!isLoggedIn || !userPhone) {
      toast.error("You are not logged in. Please login to purchase items.");
      return navigate('/login');
    }
  // Calculate the correct price based on role
  const finalPrice = isRetailer ? (product?.wholesaleprice ?? product?.price) : product?.price;

  // Package the product into the format the Checkout page expects for 'passedItems'
  const buyNowItem = {
    productId: {
      _id: product?.id,
      name: product?.name,
      price: finalPrice,
      productimage: product?.image,
      weight: product?.weight,
    },
    quantity: 1,
  };

  // Navigate to checkout and pass this data in the location state
  navigate('/checkout', { 
    state: { 
      items: [buyNowItem], 
      subtotal: finalPrice,
      isBuyNow: true 
    } 
  });
};

  if (loading || !product) {
    return (
      <div className="rasi-pd-loader-container">
        <Loader size={40} className="spinner" />
      </div>
    );
  }

  const displayPrice = isRetailer ? (product.wholesaleprice ?? product.price) : product.price;
  const discountPercent = !isRetailer && product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <>
<SEO
  title={`${product.name} | Rajagiri Rasi Bakery`}
  description={product.description}
  keywords={`${product.name}, ${product.categoryName}, bakery products, Rajagiri Rasi Bakery`}
  url={`https://www.rajagirirasibakery.com/product/${product.id}`}
/>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rasi-product-details-page">
      <Toaster position="top-center" reverseOrder={false} />
      <div
  className="rasi-back-btn"
  onClick={() => navigate(-1)}
>
  <ArrowLeft size={18} />
  <span>Back</span>
</div>
      <div className="rasi-pd-container">
        {/* Left Side: Images & Action Buttons */}
        <div className="rasi-pd-left">
          <div className="rasi-pd-gallery-wrapper">
            <div className="rasi-pd-thumbnails">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className={`rasi-pd-thumb ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt="" />
                </div>
              ))}
            </div>

            <div className="rasi-pd-main-image-container">
              <div className="rasi-pd-image-actions">
                <button onClick={toggleWishlist} disabled={isSyncing} className={`rasi-pd-wishlist-btn ${isWishlisted ? 'active' : ''}`}>
                  {isSyncing ? <Loader2 size={22} className="spinner" /> : <Heart size={22} fill={isWishlisted ? "#ff4d4d" : "none"} color={isWishlisted ? "#ff4d4d" : "currentColor"} />}
                </button>
                <button className="rasi-pd-share-btn" onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}>
                  <Share2 size={20} />
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="rasi-pd-main-img"
                />
              </AnimatePresence>
            </div>
          </div>
          
          {/* ✅ UPDATED ACTION BUTTONS: Now wrapped in a dedicated container */}
          <div className="rasi-pd-sticky-actions">
            <button 
              className="rasi-pd-add-cart-btn" 
              onClick={handleAddToCart} 
              disabled={cartLoading || buyNowLoading}
            >
              {cartLoading ? <Loader2 size={20} className="spinner" /> : <><ShoppingCart size={20} /> ADD TO CART</>}
            </button>
            <button 
              className="rasi-pd-buy-now-btn" 
              onClick={handleBuyNow} 
              disabled={buyNowLoading || cartLoading}
            >
              {buyNowLoading ? <Loader2 size={20} className="spinner" /> : <><Zap size={20} /> BUY NOW</>}
            </button>
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="rasi-pd-right">
          <div className="rasi-pd-breadcrumb">
            <Link to="/products">Home</Link> / 
            <Link to={`/products?category=${product.categoryName}`}> {product.categoryName} </Link> / {product.name}
          </div>

          <h1 className="rasi-pd-title">{product.name}</h1>

          <div className="rasi-pd-rating-section">
            <div className="rating-pill">
              <span>5.0</span> <Star size={14} fill="currentColor" />
            </div>
            <span className="review-count">({product.reviews || 12} reviews)</span>
          
          </div>

          <div className="rasi-pd-price-section">
            <span className="rasi-pd-current-price">₹{displayPrice}</span>
            {!isRetailer && product.oldPrice && (
              <>
                <span className="rasi-pd-mrp">₹{product.oldPrice}</span>
                <span className="rasi-pd-discount-tag">{discountPercent}% OFF</span>
              </>
            )}
          </div>

       

             <div className="rasi-pd-info-block">
            <h3><Weight size={18} /> Weight</h3>
            <p>{product.weight != null && (
              <span className="rasi-pd-weight-pill">{product.weight} kg</span>
            )}</p>
          </div>
          <div className="rasi-pd-info-block">
            <h3><Info size={18} /> Description</h3>
            <p>{product.description}</p>
          </div>

          {product.ingredients.length > 0 && (
            <div className="rasi-pd-info-block">
              <h3><Leaf size={18} /> Ingredients</h3>
              <div className="ingredients-tag-container">
                {product.ingredients.map((item, idx) => (
                  <span key={idx} className="ingredient-tag">{item}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
    </>
  );
};

export default ProductDetails;