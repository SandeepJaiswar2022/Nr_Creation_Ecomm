import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  product: null,
  quantity: 1,
};

const buyNowSlice = createSlice({
  name: "buyNow",
  initialState,
  reducers: {
    setBuyNowItem: (state, action) => {
      state.product = action.payload.product;
      state.quantity = action.payload.quantity;
    },
    clearBuyNowItem: (state) => {
      state.product = null;
      state.quantity = 1;
    },
  },
});

export const { setBuyNowItem, clearBuyNowItem } = buyNowSlice.actions;
export default buyNowSlice.reducer;
