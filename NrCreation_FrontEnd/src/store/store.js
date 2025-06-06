import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/Auth/authSlice";
import cartReducer from "./slices/cartSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    auth: authReducer,
    cart: cartReducer,
    user: userReducer,
  },
});
