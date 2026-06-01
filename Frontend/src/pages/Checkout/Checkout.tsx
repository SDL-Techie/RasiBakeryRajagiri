import './Checkout.css';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from 'react-router-dom';
import {
  User, MapPin, Loader2, Plus, Check, ShoppingBag,
  ChevronRight, ArrowLeft, Calendar, Clock, CreditCard, Banknote, X,
  Edit2, Home, Tag, Percent, ChevronDown
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import Toast from '../../components/Toast/Toast';

const Checkout = () => {

const role= localStorage.getItem("userRole");
 const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string, discount: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { customer, isLoggedIn, authLoading } = useCustomerAuth();

  // const passedItems = location.state?.items || [];
  const [passedItems,setpassedItems] = useState(location.state?.items || []);
  // const passedSubtotal = location.state?.subtotal || 0;
  const passedSubtotal = passedItems.reduce(
  (total: number, item: any) =>
    total + item.productId.price * item.quantity,
  0
);
  const isBuyNow = location.state?.isBuyNow || false;

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '' });
  const [dynamicDeliveryFee, setDynamicDeliveryFee] = useState(0);
  const [pincodeError, setPincodeError] = useState("");

  const [showAddrListModal, setShowAddrListModal] = useState(false);
  const [showNewAddrModal, setShowNewAddrModal] = useState(false);

  const [newAddr, setNewAddr] = useState({ street: '', city: '', state: '', zipCode: '', isDefault: false });
  const [deliverySchedule, setDeliverySchedule] = useState({ date: '', time: '' });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  const [toast, setToast] = useState({ show: false, msg: '' });

  const showToast = (msg: string) => setToast({ show: true, msg });

  const checkPincodeCharge = async (zipCode: string) => {
    if (!zipCode || zipCode.length !== 6) return;
    try {
      const res = await axios.get(`http://localhost:4000/api/v1/pincode/${zipCode}`);
      if (res.data.success) {
        setDynamicDeliveryFee(res.data.deliveryCharge);
        setPincodeError("");
      }
    } catch (err: any) {
      setDynamicDeliveryFee(0);
      setPincodeError(err.response?.data?.message || "Delivery unavailable.");
    }
  };

  useEffect(() => {
    if (passedItems.length === 0) {
      navigate('/cart');
      return;
    }
    if (authLoading) return;
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/profile/${customer?.id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
        const profile = res.data.data;
        setFormData({ name: profile.name, email: profile.email || '', mobile: profile.phoneno });
        setAddresses(profile.addresses || []);
        const defaultAddr = profile.addresses?.find((a: any) => a.isDefault) || profile.addresses?.[0];
        if (defaultAddr) checkPincodeCharge(defaultAddr.zipCode);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [isLoggedIn, authLoading, customer?.id, navigate, passedItems.length]);

  const discountAmount = appliedCoupon ? Math.round((passedSubtotal * appliedCoupon.discount) / 100) : 0;
  const total = (passedSubtotal - discountAmount) + dynamicDeliveryFee;

  const updateQuantity = (index: number, quantity: number) => {
  const updatedItems = [...passedItems];

  updatedItems[index] = {
    ...updatedItems[index],
    quantity: quantity < 1 ? 1 : quantity,
  };

  setpassedItems(updatedItems);
};

const increaseQuantity = (index: number) => {
  updateQuantity(index, passedItems[index].quantity + 1);
};

const decreaseQuantity = (index: number) => {
  updateQuantity(index, passedItems[index].quantity - 1);
};

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsValidating(true);
    setCouponError("");
    try {
      const res = await axios.post(`http://localhost:4000/api/v1/validate-coupon`, {
        phone: formData.mobile,
        couponCode: couponCode.trim().toUpperCase()
      }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
);
      if (res.data.success) {
        setAppliedCoupon({ code: couponCode.toUpperCase(), discount: res.data.discountValue });
        showToast(res.data.message || "🎉 Coupon applied!");
      }
    } catch (err: any) {
      setAppliedCoupon(null);
      setCouponError(err.response?.data?.message || "Invalid coupon code.");
      showToast(err.response?.data?.message || "Coupon Error");
    } finally {
      setIsValidating(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // Builds the order payload (shared between COD and UPI flows)
  // ─────────────────────────────────────────────────────────
  const buildOrderPayload = () => {
    const selectedAddress = addresses.find(a => a.isDefault) || addresses[0];
    const isScheduleComplete = deliverySchedule.date && deliverySchedule.time;

    return {
      customerDetails: {
        userId: customer?.id,
        name: formData.name,
        phone: formData.mobile,
        address: `${selectedAddress.street}, ${selectedAddress.city}`,
        pincode: selectedAddress.zipCode,
        role:role,
      },
      items: passedItems.map((item: any) => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: Number(item.productId.price),
        quantity: item.quantity,
        image: item.productId.productimage,
      })),
      pricing: {
        subtotal: passedSubtotal,
        discount: discountAmount,
        deliveryCharge: dynamicDeliveryFee,
        total,
        couponUsed: appliedCoupon?.code,
      },
      payment: { method: paymentMethod === 'upi' ? 'UPI' : 'COD' },
      ...(isScheduleComplete && {
        deliveryDate: new Date(`${deliverySchedule.date}T${deliverySchedule.time.split(' ')[0]}:00`),
      }),
    };
  };

  const handlePlaceOrder = async () => {
    const selectedAddress = addresses.find(a => a.isDefault) || addresses[0];
    if (!selectedAddress) {
      return showToast("⚠️ Please add a delivery address");
    }

    const orderPayload = buildOrderPayload();

    try {
      setIsSaving(true);

      // ── COD Flow ─────────────────────────────────────────
      if (paymentMethod === 'cod') {
        const { data } = await axios.post("http://localhost:4000/api/v1/createordercod", orderPayload ,  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
     if (data.success) {

    // ✅ MARK COUPON USED
    if (appliedCoupon) {
      await axios.post(
        "http://localhost:4000/api/v1/mark-coupon-used",
        {
          phone: formData.mobile,
          couponCode: appliedCoupon.code
        }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
      );
    }

    await completeFlow();
  }
        return;
      }

      // ── UPI / Razorpay Flow ───────────────────────────────
      // Step 1: Initialize transaction with your backend controller
      const { data: rzData } = await axios.post("http://localhost:4000/api/v1/razorpay/initiate", {
        amount: total
      }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

      if (!rzData.success) {
        showToast("❌ Could not initiate payment. Please try again.");
        setIsSaving(false);
        return;
      }

      // Step 2: Open Razorpay checkout pop-up instance window
      const options = {
        // key: "rzp_live_SrwnyjyTQaVMlo",
        key:RAZORPAY_KEY,
        amount: rzData.amount,
        currency: rzData.currency,
        name: "Rasi Bakery",
        description: "Order Checkout Payment Gateway",
        order_id: rzData.id, // Mapped to match backend property key name (.id)

        // ✅ Step 3: On Successful Checkout Authorization Payment Capture
        handler: async function (response: any) {
          try {
            // Re-verify cryptographically on backend, then save to MongoDB
            const verifyRes = await axios.post("http://localhost:4000/api/v1/razorpay/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              
              // Spreading layout components to map explicitly with backend controllers structure
              customerDetails: orderPayload.customerDetails,
              items: orderPayload.items,
              pricing: orderPayload.pricing,
              deliveryDate: orderPayload.deliveryDate
            }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
);

            if (verifyRes.data.success) {
              if (appliedCoupon) {
    await axios.post(
      "http://localhost:4000/api/v1/mark-coupon-used",
      {
        phone: formData.mobile,
        couponCode: appliedCoupon.code
      }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
    );
  }

              await completeFlow();
            } else {
              showToast("❌ Payment verification failed. Please contact support.");
              setIsSaving(false);
            }
          } catch (err) {
            console.error("Verification processing crash:", err);
            showToast("❌ Payment verification error. Please contact support.");
            setIsSaving(false);
          }
        },

        prefill: { 
          name: formData.name, 
          contact: formData.mobile, 
          email: formData.email 
        },
        theme: { color: "#562F00" },

        // ✅ Step 4: Handles checkout cancel window events
        modal: {
          ondismiss: () => {
            showToast("⚠️ Payment cancelled. Your order was not placed.");
            setIsSaving(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        console.error("Payment failed trace event:", response.error);
        showToast("❌ Payment failed. Please try again.");
        setIsSaving(false);
      });

      rzp.open();

    } catch (err: any) {
      showToast(err.response?.data?.message || "❌ Something went wrong. Please try again.");
      console.error(err);
      setIsSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // Called after order is confirmed (both COD and UPI)
  // ─────────────────────────────────────────────────────────
  const completeFlow = async () => {
    try {
      if (!isBuyNow) {
        await axios.delete(`http://localhost:4000/api/v1/cart/${formData.mobile}`);
      }

      // await axios.post("http://localhost:4000/api/v1/whatsapptrigger", {
      //   name: formData.name,
      //   phone: formData.mobile,
      //   total,
      //   items: passedItems.map((i: any) => i.productId.name).join(", "),
      // });

      // showToast("🎉 Order confirmed! You will receive a confirmation shortly.");

      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (error) {
      console.error("Error in completeFlow:", error);
      navigate("/orders");
    }
  };

  const handleSaveNewAddress = async (updatedAddresses: any) => {
    try {
      setIsSaving(true);
      await axios.put(`http://localhost:4000/api/v1/profile/${customer?.id}`, {
        name: formData.name,
        email: formData.email,
        phoneno: formData.mobile,
        addresses: updatedAddresses,
      }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
      setAddresses(updatedAddresses);
      const newDefault = updatedAddresses.find((a: any) => a.isDefault) || updatedAddresses[0];
      if (newDefault) checkPincodeCharge(newDefault.zipCode);
      showToast("✅ Address saved!");
      setShowNewAddrModal(false);
    } catch (err) {
      showToast("❌ Failed to save address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNewFromList = () => {
    setNewAddr({ street: '', city: '', state: '', zipCode: '', isDefault: addresses.length === 0 });
    setShowNewAddrModal(true);
  };

  const handleSelectAddressFromList = (idx: number) => {
    const updated = addresses.map((a, i) => ({ ...a, isDefault: i === idx }));
    setAddresses(updated);
    checkPincodeCharge(addresses[idx].zipCode);
    setShowAddrListModal(false);
  };

  const selectedAddress = addresses.find(a => a.isDefault) || addresses[0];

  if (loading || authLoading) return (
    <div className="rasi-checkout-loader">
      <div className="rasi-loader-ring"><Loader2 size={32} className="rasi-spinner" /></div>
    </div>
  );

  return (
    <div className="rasi-checkout-page-root">

      {/* ─── Header ─── */}
      <header className="rasi-checkout-nav-header">
        <button onClick={() => step === 2 ? setStep(1) : navigate(-1)} className="rasi-back-to-cart">
          <ArrowLeft size={18} />
        </button>
        <div className="rasi-checkout-step-label">
          <span className={step === 1 ? 'rasi-active-label' : ''}>Delivery</span>
          <div className="rasi-step-line-track">
            <div className={`rasi-step-dot ${step >= 1 ? 'rasi-filled' : ''}`} />
            <div className="rasi-step-connector"><div className={`rasi-step-fill ${step >= 2 ? 'rasi-done' : ''}`} /></div>
            <div className={`rasi-step-dot ${step >= 2 ? 'rasi-filled' : ''}`} />
          </div>
          <span className={step === 2 ? 'rasi-active-label' : ''}>Payment</span>
        </div>
      </header>

      <div className="rasi-checkout-main-grid">

        {/* ─── Left Column: Steps ─── */}
        <div className="rasi-checkout-sliding-container">
          <AnimatePresence mode="wait">

            {/* STEP 1 */}
            {step === 1 ? (
              <motion.div key="shipping" initial={{ x: -24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -24, opacity: 0 }} transition={{ duration: 0.25 }} className="rasi-step-wrapper">

                {/* Customer Info */}
                <section className="rasi-checkout-card rasi-customer-static-card">
                  <div className="rasi-card-header-row">
                    <div className="rasi-card-icon-title">
                      <div className="rasi-icon-badge"><User size={15} /></div>
                      <h3>Your Details</h3>
                    </div>
                  </div>
                  <div className="rasi-customer-pill">
                    <div className="rasi-customer-avatar">{formData.name?.charAt(0)?.toUpperCase()}</div>
                    <div>
                      <p className="rasi-cust-name">{formData.name}</p>
                      <p className="rasi-cust-phone">{formData.mobile}</p>
                    </div>
                  </div>
                </section>

                {/* Address */}
                <section className="rasi-checkout-card">
                  <div className="rasi-card-header-row">
                    <div className="rasi-card-icon-title">
                      <div className="rasi-icon-badge"><MapPin size={15} /></div>
                      <h3>Delivery Address</h3>
                    </div>
                    <button className="rasi-edit-link-btn" onClick={() => setShowAddrListModal(true)}>
                      <Edit2 size={13} /> Edit
                    </button>
                  </div>

                  {selectedAddress ? (
                    <div className="rasi-default-address-display">
                      <div className="rasi-addr-icon-wrap"><Home size={16} /></div>
                      <div className="rasi-addr-text">
                        <p className="rasi-addr-street">{selectedAddress.street}</p>
                        <p className="rasi-addr-sub">{selectedAddress.city}{selectedAddress.state ? `, ${selectedAddress.state}` : ''} — {selectedAddress.zipCode}</p>
                        {pincodeError && <p className="rasi-pincode-err-inline">{pincodeError}</p>}
                      </div>
                      {dynamicDeliveryFee === 0 && !pincodeError && (
                        <span className="rasi-free-delivery-badge">Free Delivery</span>
                      )}
                    </div>
                  ) : (
                    <button className="rasi-add-address-dashed-btn" onClick={() => setShowAddrListModal(true)}>
                      <Plus size={16} /> Add Delivery Address
                    </button>
                  )}
                </section>

                <button className="rasi-btn-primary-large" onClick={() => setStep(2)}>
                  Continue to Payment <ChevronRight size={18} />
                </button>
              </motion.div>

            ) : (

              /* STEP 2 */
              <motion.div key="payment" initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 24, opacity: 0 }} transition={{ duration: 0.25 }} className="rasi-step-wrapper">

                {/* Delivery Schedule */}
                <section className="rasi-checkout-card">
                  <div className="rasi-card-header-row">
                    <div className="rasi-card-icon-title">
                      <div className="rasi-icon-badge"><Calendar size={15} /></div>
                      <h3>Delivery Schedule</h3>
                    </div>
                  </div>
                  <div className="rasi-schedule-grid">
                    <div className="rasi-input-group">
                      <label><Calendar size={12} /> Date</label>
                      <input type="date" className="rasi-input" min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDeliverySchedule({ ...deliverySchedule, date: e.target.value })} />
                    </div>
                    <div className="rasi-input-group">
                      <label><Clock size={12} /> Time Slot</label>
                      <div className="rasi-select-wrapper">
                        <select className="rasi-input" onChange={(e) => setDeliverySchedule({ ...deliverySchedule, time: e.target.value })}>
                          <option value="">Select Time</option>
                          <option>10:00 AM - 01:00 PM</option>
                          <option>02:00 PM - 05:00 PM</option>
                          <option>06:00 PM - 09:00 PM</option>
                        </select>
                        <ChevronDown size={14} className="rasi-select-arrow" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Payment Method */}
                <section className="rasi-checkout-card">
                  <div className="rasi-card-header-row">
                    <div className="rasi-card-icon-title">
                      <div className="rasi-icon-badge"><CreditCard size={15} /></div>
                      <h3>Payment Method</h3>
                    </div>
                  </div>

                  <div className="rasi-payment-options-stack">
                    <div
                      className={`rasi-pay-tile ${paymentMethod === 'cod' ? 'rasi-active' : ''}`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <div className="rasi-pay-tile-icon rasi-cod-icon"><Banknote size={20} /></div>
                      <div className="rasi-pay-tile-text">
                        <p className="rasi-bold">Cash on Delivery</p>
                        <p className="rasi-small">Pay when your order arrives</p>
                      </div>
                      <div className={`rasi-pay-radio ${paymentMethod === 'cod' ? 'rasi-selected' : ''}`}>
                        {paymentMethod === 'cod' && <Check size={12} />}
                      </div>
                    </div>

                    <div
                      className={`rasi-pay-tile ${paymentMethod === 'upi' ? 'rasi-active' : ''}`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <div className="rasi-pay-tile-icon rasi-upi-icon"><CreditCard size={20} /></div>
                      <div className="rasi-pay-tile-text">
                        <p className="rasi-bold">UPI / Online Payment</p>
                        <p className="rasi-small">GPay, PhonePe, Paytm & more</p>
                      </div>
                      <div className={`rasi-pay-radio ${paymentMethod === 'upi' ? 'rasi-selected' : ''}`}>
                        {paymentMethod === 'upi' && <Check size={12} />}
                      </div>
                    </div>
                  </div>

                  <div className="rasi-selected-payment-badge">
                    {paymentMethod === 'cod'
                      ? <><Banknote size={13} /> Cash on Delivery selected</>
                      : <><CreditCard size={13} /> UPI Payment selected</>
                    }
                  </div>
                </section>

                <button className="rasi-btn-primary-large" onClick={handlePlaceOrder} disabled={isSaving}>
                  {isSaving ? <Loader2 className="rasi-spinner" size={18} /> : <ShoppingBag size={18} />}
                  {isSaving ? "Placing Order..." : `Place Order • ₹${total}`}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Right Column: Order Summary ─── */}
        <aside className="rasi-summary-sticky-card">
          <h3 className="rasi-summary-title">Order Summary</h3>

          <div className="rasi-summary-items-list rasi-mini">
            {passedItems.map((item: any, idx: number) => (
              <div key={idx} className="rasi-summary-item-row">
                <div className="rasi-mini-img-wrap">
                  <img src={item.productId.productimage} alt="" className="rasi-mini-img" />
                  {/* <span className="rasi-item-qty-badge">{item.quantity}</span> */}
  
                </div>
                <div className="rasi-item-info">
                  <p className="rasi-item-name">{item.productId.name}</p>
                  <p className="rasi-item-price-each">₹{item.productId.price} × {item.quantity}</p>
                </div>

                        <p className="rasi-item-total-price">₹{item.productId.price * item.quantity}</p>
        
                                <div className="rasi-qty-control">
  <button
    type="button"
    onClick={() => decreaseQuantity(idx)}
  >
    -
  </button>

  <input
    type="number"
    min="1"
    value={item.quantity}
    onChange={(e) =>
      updateQuantity(
        idx,
        Number(e.target.value)
      )
    }
  />

  <button
    type="button"
    onClick={() => increaseQuantity(idx)}
  >
    +
  </button>
</div>


              </div>
              
            ))}
          </div>

          {/* Coupon */}
          {/* {role !== "retailer" && (  <div className="rasi-coupon-box">
            <div className="rasi-coupon-label-row">
              <Tag size={13} />
              <span>Promo Code</span>
            </div>
            <div className="rasi-coupon-input-wrapper">
              <input
                type="text"
                placeholder="Enter code (e.g. RASI-X)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                disabled={!!appliedCoupon}
              />
              <button
                onClick={appliedCoupon ? () => { setAppliedCoupon(null); setCouponCode(""); } : handleApplyCoupon}
                disabled={isValidating || (!couponCode && !appliedCoupon)}
                className={appliedCoupon ? "rasi-coupon-btn rasi-remove" : "rasi-coupon-btn rasi-apply"}
              >
                {isValidating ? <Loader2 className="rasi-spinner" size={13} /> : appliedCoupon ? <X size={13} /> : "Apply"}
              </button>
            </div>
            {couponError && <p className="rasi-coupon-err-msg">{couponError}</p>}
            {appliedCoupon && (
              <p className="rasi-coupon-succ-msg">
                <Percent size={11} /> {appliedCoupon.discount}% off — saving ₹{discountAmount}
              </p>
            )}
          </div>)} */}
          {/* <div className="rasi-coupon-box">
            <div className="rasi-coupon-label-row">
              <Tag size={13} />
              <span>Promo Code</span>
            </div>
            <div className="rasi-coupon-input-wrapper">
              <input
                type="text"
                placeholder="Enter code (e.g. RASI-X)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                disabled={!!appliedCoupon}
              />
              <button
                onClick={appliedCoupon ? () => { setAppliedCoupon(null); setCouponCode(""); } : handleApplyCoupon}
                disabled={isValidating || (!couponCode && !appliedCoupon)}
                className={appliedCoupon ? "rasi-coupon-btn rasi-remove" : "rasi-coupon-btn rasi-apply"}
              >
                {isValidating ? <Loader2 className="rasi-spinner" size={13} /> : appliedCoupon ? <X size={13} /> : "Apply"}
              </button>
            </div>
            {couponError && <p className="rasi-coupon-err-msg">{couponError}</p>}
            {appliedCoupon && (
              <p className="rasi-coupon-succ-msg">
                <Percent size={11} /> {appliedCoupon.discount}% off — saving ₹{discountAmount}
              </p>
            )}
          </div> */}

          {/* Coupon */}
{role !== "retailer" && (
  <div className="rasi-coupon-box">
    <div className="rasi-coupon-label-row">
      <Tag size={13} />
      <span>Promo Code</span>
    </div>

    <div className="rasi-coupon-input-wrapper">
      <input
        type="text"
        placeholder="Enter code (e.g. RASI-X)"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
        disabled={!!appliedCoupon}
      />

      <button
        onClick={
          appliedCoupon
            ? () => {
                setAppliedCoupon(null);
                setCouponCode("");
              }
            : handleApplyCoupon
        }
        disabled={isValidating || (!couponCode && !appliedCoupon)}
        className={
          appliedCoupon
            ? "rasi-coupon-btn rasi-remove"
            : "rasi-coupon-btn rasi-apply"
        }
      >
        {isValidating ? (
          <Loader2 className="rasi-spinner" size={13} />
        ) : appliedCoupon ? (
          <X size={13} />
        ) : (
          "Apply"
        )}
      </button>
    </div>

    {couponError && (
      <p className="rasi-coupon-err-msg">{couponError}</p>
    )}

    {appliedCoupon && (
      <p className="rasi-coupon-succ-msg">
        <Percent size={11} /> {appliedCoupon.discount}% off — saving ₹
        {discountAmount}
      </p>
    )}
  </div>
)}

          {/* Price Breakdown */}
          <div className="rasi-summary-calculations">
            <div className="rasi-calc-line">
              <span>Subtotal</span>
              <span>₹{passedSubtotal}</span>
            </div>
            {appliedCoupon && (
              <div className="rasi-calc-line rasi-discount-text">
                <span>Coupon ({appliedCoupon.code})</span>
                <span className="rasi-discount-val">− ₹{discountAmount}</span>
              </div>
            )}
            <div className="rasi-calc-line">
              <span>Delivery</span>
              <span className={dynamicDeliveryFee === 0 ? 'rasi-free-text' : ''}>
                {dynamicDeliveryFee === 0 ? 'FREE' : `₹${dynamicDeliveryFee}`}
              </span>
            </div>
            <div className="rasi-calc-divider" />
            <div className="rasi-calc-line rasi-total-highlight">
              <span>Total</span>
              <strong>₹{total}</strong>
            </div>
          </div>
        </aside>
      </div>

      <Toast message={toast.msg} show={toast.show} onClose={() => setToast({ ...toast, show: false })} />

      {/* ═══════ ADDRESS LIST MODAL ═══════ */}
      <AnimatePresence>
        {showAddrListModal && (
          <motion.div className="rasi-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddrListModal(false)}>
            <motion.div className="rasi-modal-sheet rasi-addr-list-modal" initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} onClick={(e) => e.stopPropagation()}>

              <div className="rasi-modal-drag-handle" />
              <div className="rasi-modal-header">
                <h3>Select Address</h3>
                <button className="rasi-modal-close-btn" onClick={() => setShowAddrListModal(false)}><X size={18} /></button>
              </div>

              <div className="rasi-addr-list-scroll">
                {addresses.length === 0 ? (
                  <div className="rasi-addr-empty-state">
                    <MapPin size={32} opacity={0.3} />
                    <p>No addresses saved yet</p>
                  </div>
                ) : (
                  addresses.map((addr, idx) => (
                    <div key={idx} className={`rasi-addr-list-tile ${addr.isDefault ? 'rasi-selected' : ''}`} onClick={() => handleSelectAddressFromList(idx)}>
                      <div className="rasi-addr-list-radio">
                        {addr.isDefault && <div className="rasi-radio-dot" />}
                      </div>
                      <div className="rasi-addr-list-text">
                        <p className="rasi-addr-street">{addr.street}</p>
                        <p className="rasi-addr-sub">{addr.city}{addr.state ? `, ${addr.state}` : ''} — {addr.zipCode}</p>
                      </div>
                      {addr.isDefault && <span className="rasi-default-tag">Default</span>}
                    </div>
                  ))
                )}
              </div>

              <div className="rasi-modal-footer">
                <button className="rasi-add-new-addr-btn" onClick={handleAddNewFromList}>
                  <Plus size={16} /> Add New Address
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ NEW ADDRESS FORM MODAL ═══════ */}
      <AnimatePresence>
        {showNewAddrModal && (
          <motion.div className="rasi-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewAddrModal(false)}>
            <motion.div className="rasi-modal-sheet rasi-new-addr-modal" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 28 }} onClick={(e) => e.stopPropagation()}>

              <div className="rasi-modal-drag-handle" />
              <div className="rasi-modal-header">
                <button className="rasi-modal-back-btn" onClick={() => setShowNewAddrModal(false)}>
                  <ArrowLeft size={16} />
                </button>
                <h3>New Address</h3>
                <button className="rasi-modal-close-btn" onClick={() => setShowNewAddrModal(false)}><X size={18} /></button>
              </div>

              <div className="rasi-new-addr-form">
                <div className="rasi-form-field">
                  <label>Street / House No.</label>
                  <input className="rasi-addr-input" placeholder="e.g. 12, Anna Nagar"
                    value={newAddr.street} onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })} />
                </div>
                <div className="rasi-form-row-2">
                  <div className="rasi-form-field">
                    <label>City</label>
                    <input className="rasi-addr-input" placeholder="City"
                      value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} />
                  </div>
                  <div className="rasi-form-field">
                    <label>State</label>
                    <input className="rasi-addr-input" placeholder="State"
                      value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} />
                  </div>
                </div>
                <div className="rasi-form-field">
                  <label>PIN Code</label>
                  <input className="rasi-addr-input" placeholder="6-digit PIN" maxLength={6}
                    value={newAddr.zipCode} onChange={(e) => setNewAddr({ ...newAddr, zipCode: e.target.value })} />
                </div>
                <label className="rasi-default-checkbox-row">
                  <input type="checkbox" checked={newAddr.isDefault}
                    onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })} />
                  <span>Set as default address</span>
                </label>
              </div>

              <div className="rasi-modal-footer">
                <button
                  className="rasi-save-addr-btn"
                  onClick={() => {
                    const updated = newAddr.isDefault
                      ? [...addresses.map(a => ({ ...a, isDefault: false })), newAddr]
                      : [...addresses, newAddr];
                    handleSaveNewAddress(updated);
                  }}
                  disabled={!newAddr.street || !newAddr.zipCode || isSaving}
                >
                  {isSaving ? <Loader2 size={15} className="rasi-spinner" /> : <Check size={15} />}
                  {isSaving ? "Saving..." : "Save Address"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Checkout;