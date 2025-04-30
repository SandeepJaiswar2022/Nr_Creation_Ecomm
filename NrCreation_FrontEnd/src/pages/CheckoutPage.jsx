import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, MapPin, Truck } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { selectCartTotal, fetchCartItems } from "@/store/slices/cartSlice";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
  const [step, setStep] = useState("shipping");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalPrice = useSelector(selectCartTotal);
  const cartLoading = useSelector((state) => state.cart.loading);
  const dispatch = useDispatch();

  // Calculate order totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.totalprice, 0);
    const tax = subtotal * 0.05;
    const shipping =
      shippingMethod === "dtdc"
        ? 99
        : shippingMethod === "fasteg"
        ? 199
        : shippingMethod === "worldwide"
        ? 299
        : 99; // default to lowest price
    const total = subtotal + shipping + tax;

    return {
      subtotal,
      tax,
      shipping,
      total,
    };
  };

  // Use useMemo to cache calculations
  const orderTotals = useMemo(() => calculateTotals(), [calculateTotals]);

  useEffect(() => {
    // Always fetch cart data on mount
    dispatch(fetchCartItems());
  }, [dispatch]); // Remove cartItems.length dependency

  if (cartLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="text-center">Loading cart...</div>
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
        {/* Left Column - Forms */}
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
              <Input placeholder="First Name" />
              <Input placeholder="Last Name" />
              <Input placeholder="Email" className="md:col-span-2" />
              <Input placeholder="Phone Number" className="md:col-span-2" />
              <Input placeholder="Address Line 1" className="md:col-span-2" />
              <Input placeholder="Address Line 2" className="md:col-span-2" />
              <Input placeholder="City" />
              <Input placeholder="State" />
              <Input placeholder="PIN Code" />
              <Input placeholder="Country" />
            </div>
          </motion.div>

          {/* Payment Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="h-5 w-5 text-[#871845]" />
              <h2 className="text-xl font-semibold">Payment Information</h2>
            </div>

            <div className="space-y-4">
              <Input placeholder="Card Number" />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="MM/YY" />
                <Input placeholder="CVV" />
              </div>
              <Input placeholder="Name on Card" />
            </div>
          </motion.div>

          {/* Shipping Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <Truck className="h-5 w-5 text-[#871845]" />
              <h2 className="text-xl font-semibold">Shipping Method</h2>
            </div>

            <div className="space-y-4">
              <div
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                  shippingMethod === "dtdc" ? "border-[#871845]" : ""
                }`}
                onClick={() => setShippingMethod("dtdc")}
              >
                <div>
                  <p className="font-medium">Tirupati DTDC</p>
                  <p className="text-sm text-gray-500">5-8 business days</p>
                </div>
                <p className="font-medium">₹99</p>
              </div>
              <div
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                  shippingMethod === "fasteg" ? "border-[#871845]" : ""
                }`}
                onClick={() => setShippingMethod("fasteg")}
              >
                <div>
                  <p className="font-medium">Fasteg</p>
                  <p className="text-sm text-gray-500">3-5 business days</p>
                </div>
                <p className="font-medium">₹199</p>
              </div>
              <div
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                  shippingMethod === "worldwide" ? "border-[#871845]" : ""
                }`}
                onClick={() => setShippingMethod("worldwide")}
              >
                <div>
                  <p className="font-medium">Worldwide</p>
                  <p className="text-sm text-gray-500">1-2 business days</p>
                </div>
                <p className="font-medium">₹299</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4 sticky top-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-md">
                    <img
                      src={item.imageUrl || "/placeholder-image.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-[#871845] font-medium">
                      ₹{item.totalprice}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>₹{orderTotals.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span>₹{orderTotals.shipping}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax</span>
                <span>₹{orderTotals.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-[#871845]">
                    ₹{orderTotals.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-[#871845] hover:bg-[#611031]"
              onClick={() => {
                // TODO: Handle order placement
                console.log("Place order clicked");
              }}
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
