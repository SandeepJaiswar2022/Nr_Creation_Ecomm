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
      return res.data;
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
    razorpayOrderData: null,
    loading: false,
    error: null,
    paymentStatus: null,
  },
  reducers: {
    clearPaymentState: (state) => {
      state.razorpayOrderData = null;
      state.loading = false;
      state.error = null;
      state.paymentStatus = null;
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
        state.razorpayOrderData = action.payload?.data;
        toast.success(action.payload?.message);
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Optional - if you want to track payment verification
      .addCase(verifyRazorpayPayment.pending, (state) => {
        state.paymentStatus = false;
        state.error = null;
      })
      .addCase(verifyRazorpayPayment.fulfilled, (state, action) => {
        state.paymentStatus = action.payload.data?.isPaymentVerified ? "verified" : "failed";
        toast.success(action.payload?.message);
      })
      .addCase(verifyRazorpayPayment.rejected, (state, action) => {
        state.paymentStatus = "failed";
        state.error = action.payload;
        toast.error(action.payload || "Payment verification failed");
      });
  },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
