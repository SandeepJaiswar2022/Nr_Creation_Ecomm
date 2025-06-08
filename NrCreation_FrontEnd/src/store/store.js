import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/Auth/authSlice";
import cartReducer from "./slices/cartSlice";
import userReducer from "./slices/userSlice";
import addressReducer from "./slices/addressSlice";
import paymentReducer from "./slices/Payment/paymentSlice"; // Assuming you have a paymentSlice.js

export const store = configureStore({
  reducer: {
    product: productReducer,
    auth: authReducer,
    cart: cartReducer,
    user: userReducer,
    address: addressReducer,
    payment: paymentReducer, // Assuming you have a paymentSlice.js
  },
});
