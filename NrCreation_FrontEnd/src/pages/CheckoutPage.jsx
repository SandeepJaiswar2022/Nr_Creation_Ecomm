import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, MapPin, Truck } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { selectCartTotal, fetchCartItems } from "@/store/slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createPayment,
  updatePayment,
  clearPaymentState,
} from "@/store/slices/Payment/paymentSlice";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartLoading = useSelector((state) => state.cart.loading);

  // Fix: Check if state.payment exists before destructuring
  const payment = useSelector((state) => state.payment);
  const paymentLoading = payment ? payment.loading : false;
  const paymentError = payment ? payment.error : null;
  const paymentStatus = payment ? payment.paymentStatus : null;
  const paymentData = payment ? payment.paymentData : null;

  // Local state
  const [shippingMethod, setShippingMethod] = useState("dtdc");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
  });
  const [errors, setErrors] = useState({});

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits";
    if (!formData.address1) newErrors.address1 = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.pinCode) newErrors.pinCode = "PIN code is required";
    else if (!/^\d{6}$/.test(formData.pinCode))
      newErrors.pinCode = "PIN code must be 6 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate order totals
  const orderTotals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.05; // 5% tax
    const shipping =
      shippingMethod === "dtdc"
        ? 99
        : shippingMethod === "fasteg"
        ? 199
        : shippingMethod === "worldwide"
        ? 299
        : 99;
    const total = subtotal + shipping + tax;

    return { subtotal, tax, shipping, total };
  }, [cartItems, shippingMethod]);

  // Order details for payment
  const orderDetails = useMemo(
    () => ({
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: {
        address1: formData.address1,
        address2: formData.address2,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        country: formData.country,
      },
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.totalPrice / item.quantity, // Assuming totalPrice is quantity * price
      })),
      shippingMethod,
      totalAmount: orderTotals.total,
    }),
    [formData, cartItems, shippingMethod, orderTotals]
  );
  const { user } = useSelector((state) => state.auth);
  console.log("User Details : ", user);

  console.log("Order Details  : ", orderDetails);

  // Handle place order
  const handlePlaceOrder = () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    console.log("Order Details:", orderDetails);
    // Get customerId from authenticated user (e.g., from JWT or Redux)
    // const customerId = localStorage.getItem("customerId"); // Replace with actual logic

    // Dispatch createPayment
    dispatch(createPayment({ orderDetails }));
  };

  // Handle payment status changes
  useEffect(() => {
    if (paymentStatus === "verified" && paymentData) {
      toast.success("Payment successful!");
      navigate("/order-confirmation", {
        state: {
          orderId: paymentData.orderId,
          paymentId: paymentData.razorpayPaymentId,
          shippingDetails: formData,
        },
      });
      dispatch(clearPaymentState()); // Reset payment state
    } else if (paymentStatus === "failed" && paymentError) {
      toast.error(paymentError || "Payment failed. Please try again.");
    }
  }, [paymentStatus, paymentError, paymentData, navigate, dispatch, formData]);

  // Fetch cart items on mount
  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  // Loading and empty cart states
  if (cartLoading || paymentLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="text-center">Processing...</div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="text-center">
          <p>Your cart is empty</p>
          <Button asChild className="mt-4">
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-8 space-y-8">
          {/* Shipping Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-[#871845]" />
              <h2 className="text-xl font-semibold">Shipping Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <Input
                  name="address1"
                  value={formData.address1}
                  onChange={handleInputChange}
                  className={errors.address1 ? "border-red-500" : ""}
                />
                {errors.address1 && (
                  <p className="text-red-500 text-xs mt-1">{errors.address1}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Address Line 2
                </label>
                <Input
                  name="address2"
                  value={formData.address2}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <Input
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  PIN Code <span className="text-red-500">*</span>
                </label>
                <Input
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  className={errors.pinCode ? "border-red-500" : ""}
                />
                {errors.pinCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Country
                </label>
                <Input
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
            </div>
          </motion.div>

          {/* Shipping Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <Truck className="h-5 w-5 text-[#871845]" />
              <h2 className="text-xl font-semibold">Shipping Method</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-[#871845] transition-colors">
                <input
                  type="radio"
                  name="shipping"
                  value="dtdc"
                  checked={shippingMethod === "dtdc"}
                  onChange={() => setShippingMethod("dtdc")}
                  className="text-[#871845]"
                />
                <div className="ml-4 flex-1">
                  <p className="font-medium">Standard Shipping (DTDC)</p>
                  <p className="text-sm text-gray-500">
                    Delivery in 5-7 business days
                  </p>
                </div>
                <span className="font-medium">₹99</span>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-[#871845] transition-colors">
                <input
                  type="radio"
                  name="shipping"
                  value="fasteg"
                  checked={shippingMethod === "fasteg"}
                  onChange={() => setShippingMethod("fasteg")}
                  className="text-[#871845]"
                />
                <div className="ml-4 flex-1">
                  <p className="font-medium">Express Shipping (FastEG)</p>
                  <p className="text-sm text-gray-500">
                    Delivery in 2-3 business days
                  </p>
                </div>
                <span className="font-medium">₹199</span>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-[#871845] transition-colors">
                <input
                  type="radio"
                  name="shipping"
                  value="worldwide"
                  checked={shippingMethod === "worldwide"}
                  onChange={() => setShippingMethod("worldwide")}
                  className="text-[#871845]"
                />
                <div className="ml-4 flex-1">
                  <p className="font-medium">International Shipping</p>
                  <p className="text-sm text-gray-500">
                    Delivery in 7-14 business days
                  </p>
                </div>
                <span className="font-medium">₹299</span>
              </label>
            </div>
          </motion.div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="h-5 w-5 text-[#871845]" />
              <h2 className="text-xl font-semibold">Payment Method</h2>
            </div>

            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="font-medium">
                Razorpay (Credit/Debit Card, UPI, Netbanking)
              </p>
              <p className="text-sm text-gray-500 mt-1">
                You will be redirected to Razorpay's secure payment gateway
                after placing the order.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm sticky top-8"
          >
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.itemId} className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={`Product ${item.productId}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Product #{item.productId}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <p>Qty: {item.quantity}</p>
                      <p>₹{item.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{orderTotals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>₹{orderTotals.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (5%)</span>
                <span>₹{orderTotals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-[#871845]">
                  ₹{orderTotals.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Place Order Button */}
            <Button
              className="w-full mt-6 bg-[#871845] hover:bg-[#611031]"
              onClick={handlePlaceOrder}
              disabled={paymentLoading}
            >
              {paymentLoading ? "Processing..." : "Place Order"}
            </Button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              By placing your order, you agree to our Terms of Service and
              Privacy Policy
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
