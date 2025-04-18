import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../api";

export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/cart-item/add`, null, {
        params: {
          productId,
          quantity,
        },
      });
      toast.success(`${productId || "Product"} added to cart!`);
      return response.data;
    } catch (error) {
      toast.error("Failed to add product to cart!");
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

const calculateTotals = (items) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.unitprice * item.quantity,
    0
  );
  return { totalQuantity, totalPrice };
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      const totals = calculateTotals(state.cartItems);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
    },
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.productId === product.productId
      );

      if (existingItem) {
        existingItem.quantity += product.quantity;
        toast.success(`${product.title || "Product"} quantity increased!`);
      } else {
        state.cartItems.push(product);
        toast.success(`${product.title || "Product"} added to cart!`);
      }

      const totals = calculateTotals(state.cartItems);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      const itemToRemove = state.cartItems.find(
        (item) => item.id === productId
      );

      if (itemToRemove) {
        state.cartItems = state.cartItems.filter(
          (item) => item.id !== productId
        );
        toast.info(`${itemToRemove.title} removed from cart!`);
      }

      const totals = calculateTotals(state.cartItems);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find((item) => item.id === productId);

      if (item) {
        if (quantity <= 0) {
          state.cartItems = state.cartItems.filter(
            (item) => item.id !== productId
          );
          toast.info(`${item.title} removed from cart!`);
        } else {
          item.quantity = quantity;
          toast.success(`${item.title} quantity updated!`);
        }

        const totals = calculateTotals(state.cartItems);
        state.totalQuantity = totals.totalQuantity;
        state.totalPrice = totals.totalPrice;
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      toast.info("Cart cleared!");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        const product = action.payload;
        const existingItem = state.cartItems.find(
          (item) => item.productId === product.productId
        );

        if (existingItem) {
          existingItem.quantity += product.quantity;
        } else {
          state.cartItems.push(product);
        }

        const totals = calculateTotals(state.cartItems);
        state.totalQuantity = totals.totalQuantity;
        state.totalPrice = totals.totalPrice;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCartItems,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
