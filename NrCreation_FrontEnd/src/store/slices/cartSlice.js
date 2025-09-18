import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { normalizeError } from "@/utils/normalizeError";
import api from "@/utils/api";


// Async Thunks
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const cartResponse = await api.get("/cart/my-cart");
      // console.info("In Cart Slice : Fetching cart Information....");
      // console.log("response fetchCartItems : ", cartResponse.data);

      return cartResponse.data;
    } catch (error) {
      const message = normalizeError(error);
      return rejectWithValue(message);
    }
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cart-item/update`, null, {
        params: { cartItemId, quantity },
      });

      return { message: response.data?.message, cartItemId, quantity };
    } catch (error) {
      const message = normalizeError(error);
      return rejectWithValue(message);
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

      return response.data;
    } catch (error) {
      const message = normalizeError(error);
      return rejectWithValue(message);
    }
  }
);


export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/clear-cart`);
      return response.data;
    } catch (error) {
      const message = normalizeError(error);
      return rejectWithValue(message);
    }
  }
);

// Add this with other thunks
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ cartId, cartItemId }, { rejectWithValue }) => {
    try {
      if (!cartId || !cartItemId) {
        return rejectWithValue("Missing cartId or cartItemId");
      }

      const response = await api.delete("/cart-item/delete", {
        params: {
          cartId,
          cartItemId
        }
      });

      return { message: response.data?.message, cartItemId };
    } catch (error) {
      const message = normalizeError(error);
      return rejectWithValue(message);
    }
  }
);

// Helper Functions
const calculateTotals = (items) => {
  const totalQuantity = items.reduce((sum, item) => sum + item?.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item?.totalPrice, 0);
  return { totalQuantity, totalPrice };
};

// Initial State
const initialState = {
  cartId: null,
  cartItems: [],
  totalQuantity: 0,
  cartTotalAmount: 0,
  buyNowProductInfo: {
    productId: null,
    productPrice: null
  },
  isBuyNowRequest: false,
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
      state.cartTotalAmount = totals.totalPrice;
    },

    setCartItemForBuyNow: (state, action) => {
      // console.log("Product to dispatch : ", action.payload);
      state.buyNowProductInfo.productId = action.payload?.product?.id || null;
      state.buyNowProductInfo.productPrice = action.payload?.product?.price || null;
      state.isBuyNowRequest = action.payload?.isBuyNowRequest ?? false;
      // toast.success("product converted to item to dispatch for Buy Now!");
      // const totals = calculateTotals(state.cartItems);
      // state.totalQuantity = totals.totalQuantity;
      // state.cartTotalAmount = totals.totalPrice;
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
        state.cartTotalAmount = totals.totalPrice;
      }
    },

    // clearCart: (state) => {
    //   state.cartItems = [];
    //   state.totalQuantity = 0;
    //   state.cartTotalAmount = 0;
    //   toast.info("Cart cleared!");
    // },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart Items
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = `FetchingCart`;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("Fetched Cart Items:", action.payload);

        state.cartItems = action.payload?.data?.items || [];
        state.cartId = action.payload?.data?.cartId || null;

        const totals = calculateTotals(action.payload?.data?.items || []);
        state.totalQuantity = totals.totalQuantity;
        state.cartTotalAmount = totals.totalPrice;
        // toast.success(action.payload?.message);
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.cartItems = [];
        // toast.error(action.payload);
      })
      // Add to Cart
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        const product = action.payload?.data;
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
        state.cartTotalAmount = totals.totalPrice;
        toast.success("Product added to cart!");
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      //Update quantity
      .addCase(updateQuantity.pending, (state) => {
        state.loading = `updatingQuantity`;
        state.error = null;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.loading = false;
        const { cartItemId, quantity, message } = action.payload || {};
        //find the index of the cartItem of the
        // state and then update the quantity to that object
        const itemIndex = state.cartItems.findIndex(
          (item) => item.itemId === cartItemId
        );
        if (itemIndex !== -1) {
          const item = state.cartItems[itemIndex];
          item.quantity = quantity;
          item.totalPrice = item.unitPrice * quantity;
        }

        const totals = calculateTotals(state.cartItems);
        state.totalQuantity = totals.totalQuantity;
        state.cartTotalAmount = totals.totalPrice;
        toast.success(message);
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Add these cases in extraReducers
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = "deleting";
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const { cartItemId, message } = action.payload;
        state.cartItems = state.cartItems.filter(
          (item) => item.itemId !== cartItemId
        );

        const totals = calculateTotals(state.cartItems);
        state.totalQuantity = totals.totalQuantity;
        state.cartTotalAmount = totals.totalPrice;
        toast.success(message || "Item removed from cart");
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      //clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading = `FetchingCart`;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = [];
        state.totalQuantity = 0;
        state.cartTotalAmount = 0;
        // toast.success(action.payload?.message);
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
  },
});

// Selectors
export const selectUniqueItemsCount = (state) => state.cart.cartItems.length;
export const selectCartTotal = (state) => state.cart.cartTotalAmount;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

// Actions
export const { setCartItems, removeFromCart, setCartItemForBuyNow } = cartSlice.actions;

export default cartSlice.reducer;
