import api from "@/store/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Load Razorpay checkout script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Create payment (place order and get Razorpay order ID)
export const createPayment = createAsyncThunk(
  "payment/createPayment",
  async ({ orderDetails }, { rejectWithValue, dispatch }) => {
    try {
      // Call backend to place order
      const response = await api.post(`/orders/place`, orderDetails);
      const data = response.data;
      toast.success("Order placed successfully!");
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay script");
      }

      // Initialize Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Updated to use Vite environment variable
        amount: data.orderAmount * 100, // Amount in paise
        currency: "INR",
        name: "NR Creation", // Updated to actual company name
        description: "Order Payment",
        order_id: data.razorpayOrderId, // From backend response
        handler: async function (response) {
          // Dispatch updatePayment to verify payment
          dispatch(
            updatePayment({
              orderId: data.orderId,
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            })
          );
        },
        prefill: {
          name: orderDetails.customerName || "",
          email: orderDetails.customerEmail || "",
          contact: orderDetails.customerPhone || "",
        },
        theme: {
          color: "#871845", // Updated to match your brand color
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      return data; // Return order data to store in state
    } catch (error) {
      console.error("Error in createPayment: ", error.response || error);
      toast.error(
        error.response?.data?.message || "Failed to initiate payment"
      );
      return rejectWithValue(
        error.response?.data || { message: "Failed to initiate payment" }
      );
    }
  }
);

// Verify payment
export const updatePayment = createAsyncThunk(
  "payment/updatePayment",
  async (
    { orderId, paymentId, razorpayOrderId, razorpaySignature },
    { rejectWithValue }
  ) => {
    try {
      // Get JWT token from localStorage or other auth storage
      const jwtToken = localStorage.getItem("jwtToken");

      // Prepare headers with or without token
      const headers = {};
      if (jwtToken) {
        headers.Authorization = `Bearer ${jwtToken}`;
      }

      // Send payment verification request to backend
      const response = await api.post(
        `/orders/verify-payment`,
        {
          orderId,
          razorpayPaymentId: paymentId,
          razorpayOrderId,
          razorpaySignature,
        },
        { headers }
      );

      const data = response.data;
      toast.success("Payment verified and order confirmed!");
      return data;
    } catch (error) {
      console.error("Error in updatePayment: ", error.response || error);
      toast.error(
        error.response?.data?.message || "Payment verification failed"
      );
      return rejectWithValue(
        error.response?.data || { message: "Payment verification failed" }
      );
    }
  }
);

// Payment slice
const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    error: null,
    paymentData: null,
    paymentStatus: null, // Track payment status
  },
  reducers: {
    clearPaymentState: (state) => {
      state.error = null;
      state.paymentData = null;
      state.paymentStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentStatus = "pending";
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentData = action.payload;
        state.paymentStatus = "initiated";
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Payment initiation failed";
        state.paymentStatus = "failed";
      })
      .addCase(updatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentStatus = "verifying";
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentData = action.payload;
        state.paymentStatus = "verified";
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Payment verification failed";
        state.paymentStatus = "failed";
      });
  },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
