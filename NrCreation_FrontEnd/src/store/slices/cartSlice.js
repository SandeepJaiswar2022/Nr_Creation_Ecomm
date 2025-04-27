import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../api";

// Async Thunks
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const cartIdResponse = await api.get("/cart/my-cart");
      const cartId = cartIdResponse.data?.data?.cartId;

      if (!cartId) {
        return [];
      }

      const cartItemsResponse = await api.get(`/cart-item/cart/${cartId}`);
      console.log("cart item in slice : ", cartIdResponse.data.data);
      const items = cartItemsResponse.data.data || [];
      console.log("Cart Items12: ", items);

      return items.map((item) => ({
        id: item.id,
        productId: item.product.id,
        quantity: item.quantity,
        unitprice: item.unitPrice,
        totalprice: item.totalPrice,
        cartId: cartId,
      }));
    } catch (error) {
      return rejectWithValue("Failed to fetch cart items");
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/cart-item/add`, null, {
        params: { productId, quantity },
      });
      toast.success("Product added to cart!");
      return response.data;
    } catch (error) {
      toast.error("Failed to add product to cart!");
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Helper Functions
const calculateTotals = (items) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.unitprice * item.quantity,
    0
  );
  return { totalQuantity, totalPrice };
};

// Initial State
const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

// Slice
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
    removeFromCart: (state, action) => {
      const productId = action.payload;
      const itemToRemove = state.cartItems.find(
        (item) => item.id === productId
      );

      if (itemToRemove) {
        state.cartItems = state.cartItems.filter(
          (item) => item.id !== productId
        );
        toast.info("Item removed from cart!");

        const totals = calculateTotals(state.cartItems);
        state.totalQuantity = totals.totalQuantity;
        state.totalPrice = totals.totalPrice;
      }
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find((item) => item.id === productId);

      if (item) {
        if (quantity <= 0) {
          state.cartItems = state.cartItems.filter(
            (item) => item.id !== productId
          );
          toast.info("Item removed from cart!");
        } else {
          item.quantity = quantity;
          item.totalprice = item.unitprice * quantity;
          toast.success("Quantity updated!");
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
      // Fetch Cart Items
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
        const totals = calculateTotals(action.payload);
        state.totalQuantity = totals.totalQuantity;
        state.totalPrice = totals.totalPrice;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.cartItems = [];
      })
      // Add to Cart
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        const product = action.payload;
        const existingItem = state.cartItems.find(
          (item) => item.productId === product.productId
        );

        if (existingItem) {
          existingItem.quantity += product.quantity;
          existingItem.totalprice =
            existingItem.unitprice * existingItem.quantity;
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

// Selectors
export const selectUniqueItemsCount = (state) => state.cart.cartItems.length;
export const selectCartTotal = (state) => state.cart.totalPrice;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

// Actions
export const { setCartItems, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
