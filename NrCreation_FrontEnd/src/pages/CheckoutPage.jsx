import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, MapPin, Truck, Plus } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { selectCartTotal, fetchCartItems, clearCart } from "@/store/slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearPaymentState,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "@/store/slices/Payment/paymentSlice";
import {
  fetchAddresses,
  addAddress,
  selectAddresses,
  selectSelectedAddress,
  setSelectedAddress,
  getSelectedAddressId,
} from "@/store/slices/addressSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, INDIAN_STATES } from "@/schemas/addressSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "@/styles/scrollbar.css";

const key = "";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartLoading = useSelector((state) => state.cart.loading);
  const addresses = useSelector(selectAddresses);
  const selectedAddress = useSelector(selectSelectedAddress);
  const selectedAddressId = useSelector(getSelectedAddressId);
  const { user } = useSelector((state) => state.auth);
  const addressLoading = useSelector((state) => state.address.loading);

  // Fix: Check if state.payment exists before destructuring
  const payment = useSelector((state) => state.payment);
  const paymentLoading = payment ? payment.loading : false;
  const paymentError = payment ? payment.error : null;
  const paymentStatus = payment ? payment.paymentStatus : null;
  const razorpayOrderData = payment ? payment.razorpayOrderData : null;


  // Local state
  const [shippingMethod, setShippingMethod] = useState("dtdc");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showAllAddresses, setShowAllAddresses] = useState(false);

  // Form setup
  const form = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
      country: "India",
    },
  });

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
      customerName: selectedAddress?.fullName || "",
      customerPhone: selectedAddress?.phone || "",
      shippingAddress: selectedAddress
        ? {
          address: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pinCode: selectedAddress.pinCode,
          country: selectedAddress.country,
        }
        : null,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.totalPrice / item.quantity,
      })),
      shippingMethod,
      totalAmount: orderTotals.total,
    }),
    [selectedAddress, cartItems, shippingMethod, orderTotals]
  );

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    const orderPayload = {
      shippingAddressId: selectedAddress?.addressId,
      shippingMethod,
    };

    // console.log("Order Details:", orderPayload);
    try {
      // Step 1: Create Order on backend
      const razorpayCreatedOrderData = await dispatch(createRazorpayOrder(orderPayload)).unwrap();

      // console.log("Create order response:", razorpayCreatedOrderData);

      const options = {
        key: `rzp_test_fq5xX9fbSikzL0`, // Replace this
        amount: razorpayCreatedOrderData?.data?.amount,
        currency: razorpayCreatedOrderData?.data?.currency,
        order_id: razorpayCreatedOrderData?.data?.razorpayOrderId,

        handler: async function (response) {
          // console.log("Response from Razorpay : ", response);
          const paymentVerificationData = {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          };

          // console.log("Payment verification data : ", paymentVerificationData);


          try {
            // Step 2: Verify Payment
            await dispatch(verifyRazorpayPayment(paymentVerificationData)).unwrap();


            // const clearPromise = dispatch(clearCart());
            // if (clearPromise.unwrap) {
            //   await clearPromise.unwrap();
            // }

            console.log("✅ Payment verified and order updated successfully!");
          } catch (verifyError) {
            console.error("❌ Error verifying payment:", verifyError);
          }
        },
        prefill: {
          name: (user?.firstName + user?.lastName) || "Guest User",
          contact: selectedAddress?.phone || "0000000000",
          email: user?.email || "guest980@gmail.com",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (createError) {
      console.error("❌ Error creating Razorpay order:", createError);
    }
  };

  // Handle address form submission
  const onSubmit = async (data) => {
    try {
      console.log("Address data to dispatch ");

      await dispatch(addAddress(data)).unwrap();
      setShowAddressForm(false);
      form.reset();
    } catch (error) {
      toast.error(error);
    }
  };

  // Handle payment status changes
  useEffect(() => {
    if (paymentStatus === "verified" && razorpayOrderData) {
      // toast.success("Payment successful!");
      dispatch(clearPaymentState());
      dispatch(clearCart());
      navigate("/order-confirmation", {
        state: {
          orderId: razorpayOrderData.razorpayOrderId,
          // paymentId: razorpayOrderData.razorpayOrderId,
          shippingDetails: selectedAddress,
        },
        replace: true,
      });

    } else if (paymentStatus === "failed") {
      toast.error("Payment failed. Please try again.");
    }
  }, [paymentStatus, paymentError, razorpayOrderData, selectedAddress]);

  // Fetch addresses on mount
  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  // Set first address as selected by default when addresses are loaded
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      if (selectedAddressId)
        dispatch(setSelectedAddress(selectedAddressId));
    }
  }, [addresses, selectedAddress, dispatch, selectedAddressId]);

  // Loading and empty cart states
  if (cartLoading || paymentLoading || addressLoading) {
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
            className="bg-white p-6 rounded-lg border border-[#871845] shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#871845]" />
                <h2 className="text-xl font-semibold">Shipping Information</h2>
              </div>
              {!showAddressForm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddressForm(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add New Address
                </Button>
              )}
            </div>

            {showAddressForm ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              maxLength={10}
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Enter your complete address"
                                className="resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[200px] overflow-y-auto custom-scrollbar">
                              <div className="pr-2">
                                {INDIAN_STATES.map((state) => (
                                  <SelectItem key={state} value={state}>
                                    {state}
                                  </SelectItem>
                                ))}
                              </div>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pinCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PIN Code</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              maxLength={6}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddressForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-[#871845] hover:bg-[#611031]">
                      Save & Deliver Here
                    </Button>
                  </div>
                </form>
              </Form>
            ) : showAllAddresses ? (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address?.addressId}
                    className="p-4 border rounded-lg hover:border-[#871845] transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{address?.fullName}</p>
                      <p className="text-sm text-gray-600">{address?.phone}</p>
                      <p className="text-sm text-gray-600">{address?.address}</p>
                      <p className="text-sm text-gray-600">
                        {address?.city}, {address?.state} - {address?.pinCode}
                      </p>
                      <p className="text-sm text-gray-600">{address?.country}</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button
                        onClick={() => {
                          // console.log(" address id  : ", address?.addressId);

                          dispatch(setSelectedAddress(address?.addressId));
                          setShowAllAddresses(false);
                        }}
                        className="bg-[#871845] hover:bg-[#611031]"
                      >
                        Deliver Here
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {selectedAddress && (
                  <div className="p-4 border border-[#871845] rounded-lg bg-[#871845]/5">
                    <div className="space-y-1">
                      <p className="font-medium">{selectedAddress.fullName}</p>
                      <p className="text-sm text-gray-600">{selectedAddress.phone}</p>
                      <p className="text-sm text-gray-600">{selectedAddress.address}</p>
                      <p className="text-sm text-gray-600">
                        {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pinCode}
                      </p>
                      <p className="text-sm text-gray-600">{selectedAddress.country}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowAllAddresses(true)}
                      className="mt-4"
                    >
                      Change Address
                    </Button>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Shipping Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 border border-[#871845] rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <Truck className="h-5 w-5 text-[#871845]" />
              <h2 className="text-xl font-semibold">Shipping Method</h2>
            </div>

            <RadioGroup
              value={shippingMethod}
              onValueChange={setShippingMethod}
              className="space-y-4"
            >
              <div className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-[#871845] transition-colors">
                <RadioGroupItem value="dtdc" id="dtdc" />
                <Label htmlFor="dtdc" className="flex-1 ml-4 cursor-pointer">
                  <div>
                    <p className="font-medium">Standard Shipping (DTDC)</p>
                    <p className="text-sm text-gray-500">
                      Delivery in 5-7 business days
                    </p>
                  </div>
                </Label>
                <span className="font-medium">₹99</span>
              </div>

              <div className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-[#871845] transition-colors">
                <RadioGroupItem value="fasteg" id="fasteg" />
                <Label htmlFor="fasteg" className="flex-1 ml-4 cursor-pointer">
                  <div>
                    <p className="font-medium">Express Shipping (FastEG)</p>
                    <p className="text-sm text-gray-500">
                      Delivery in 2-3 business days
                    </p>
                  </div>
                </Label>
                <span className="font-medium">₹199</span>
              </div>

              <div className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-[#871845] transition-colors">
                <RadioGroupItem value="worldwide" id="worldwide" />
                <Label htmlFor="worldwide" className="flex-1 ml-4 cursor-pointer">
                  <div>
                    <p className="font-medium">International Shipping</p>
                    <p className="text-sm text-gray-500">
                      Delivery in 7-14 business days
                    </p>
                  </div>
                </Label>
                <span className="font-medium">₹299</span>
              </div>
            </RadioGroup>
          </motion.div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 border border-[#871845] rounded-lg shadow-sm"
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
            className="bg-white p-6 border border-[#871845] rounded-lg shadow-sm sticky top-24"
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
              disabled={paymentLoading || !selectedAddress}
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
