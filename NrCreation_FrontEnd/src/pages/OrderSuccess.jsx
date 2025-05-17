import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Package,
  ArrowRight,
  Home,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, paymentId, shippingDetails } = location.state || {};

  // Redirect to home if accessed directly without order data
  useEffect(() => {
    if (!orderId) {
      navigate("/");
    }
  }, [orderId, navigate]);

  if (!orderId) {
    return null; // Prevent flash of content before redirect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Success Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block"
          >
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-[#871845]">
            Order Details
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID</span>
              <span className="font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment ID</span>
              <span className="font-medium">{paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-medium">
                {new Date().toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Details Card */}
        {shippingDetails && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-[#871845]" />
              <h2 className="text-xl font-semibold text-[#871845]">
                Shipping Details
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="font-medium">
                  {shippingDetails.firstName} {shippingDetails.lastName}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-medium">{shippingDetails.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="font-medium">{shippingDetails.phone}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Address</p>
                <p className="font-medium">
                  {shippingDetails.address1}
                  {shippingDetails.address2 && `, ${shippingDetails.address2}`}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">City</p>
                <p className="font-medium">{shippingDetails.city}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">PIN Code</p>
                <p className="font-medium">{shippingDetails.pinCode}</p>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#871845]">
            What's Next?
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="bg-green-100 rounded-full p-1 mt-0.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Order Confirmation</p>
                <p className="text-gray-600 text-sm">
                  We've sent a confirmation email to {shippingDetails?.email}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Processing & Shipping</p>
                <p className="text-gray-600 text-sm">
                  Your order will be processed and shipped within 2-3 business
                  days
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-[#871845] hover:bg-[#611031]">
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Return to Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-[#871845] text-[#871845] hover:bg-[#871845] hover:text-white"
          >
            <Link to="/products">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
