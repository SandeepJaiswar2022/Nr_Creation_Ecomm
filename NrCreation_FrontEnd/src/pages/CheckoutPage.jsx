import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, MapPin, Truck } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCartTotal } from "@/store/slices/cartSlice";

const CheckoutPage = () => {
  const [step, setStep] = useState("shipping");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalPrice = useSelector(selectCartTotal);
  const tax = totalPrice * 0.05;
  const shipping = shippingMethod === "standard" ? 99 : 199;

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
                  shippingMethod === "standard" ? "border-[#871845]" : ""
                }`}
                onClick={() => setShippingMethod("standard")}
              >
                <div>
                  <p className="font-medium">Standard Delivery</p>
                  <p className="text-sm text-gray-500">3-5 business days</p>
                </div>
                <p className="font-medium">₹99</p>
              </div>
              <div
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                  shippingMethod === "express" ? "border-[#871845]" : ""
                }`}
                onClick={() => setShippingMethod("express")}
              >
                <div>
                  <p className="font-medium">Express Delivery</p>
                  <p className="text-sm text-gray-500">1-2 business days</p>
                </div>
                <p className="font-medium">₹199</p>
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
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span>₹{shipping}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-[#871845]">
                    ₹{(totalPrice + shipping + tax).toFixed(2)}
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
