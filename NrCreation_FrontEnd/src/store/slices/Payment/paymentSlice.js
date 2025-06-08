import api from "@/utils/api";
import { normalizeError } from "@/utils/normalizeError";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// // Load Razorpay checkout script dynamically
// const loadRazorpayScript = () => {
//   return new Promise((resolve) => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// };

// Create payment (place order and get Razorpay order ID)
export const createRazorpayOrder = createAsyncThunk(
  "payment/createRazorpayOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await api.post("/orders/place", orderData);
      return res.data.data;
    } catch (error) {
      const message = normalizeError(error);
      return rejectWithValue(message);
    }
  }
);

// Verify payment
export const verifyRazorpayPayment = createAsyncThunk(
  "payment/verifyRazorpayPayment",
  async (paymentVerificationData, { rejectWithValue }) => {
    try {
      const res = await api.post("/orders/verify-payment", paymentVerificationData);
      console.log("Payment verification response:", res.data);

      return res.data;
    } catch (error) {
      const message = normalizeError(error);
      return rejectWithValue(message);
    }
  }
);


// Payment slice
const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    orderData: null,
    loading: false,
    error: null,
    paymentVerified: false,
  },
  reducers: {
    resetPaymentState: (state) => {
      state.orderData = null;
      state.loading = false;
      state.error = null;
      state.paymentVerified = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRazorpayOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload;
        toast.success("Order created successfully. Redirecting to payment...");
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Optional - if you want to track payment verification
      .addCase(verifyRazorpayPayment.pending, (state) => {
        state.paymentVerified = false;
        state.error = null;
      })
      .addCase(verifyRazorpayPayment.fulfilled, (state, action) => {
        state.paymentVerified = action.payload.data?.isPaymentVerified;
        toast.success(action.payload?.message);
      })
      .addCase(verifyRazorpayPayment.rejected, (state, action) => {
        state.paymentVerified = false;
        state.error = action.payload;
        toast.error(action.payload || "Payment verification failed");
      });
  },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
