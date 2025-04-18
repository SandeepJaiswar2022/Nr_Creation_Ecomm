import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
// import { API_BASE_URL } from "../api";
import api from "../api";
const BASE_URL = "https://fakestoreapi.com/products"; // Example API

// Async Thunk to fetch products
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async ({ rejectWithValue }) => {
    try {
      // const response = await axios.get(`${API_BASE_URL}/public/product/get/all`);
      console.log("get product");
      const response = await api.get("/public/product/get/all");
      console.log(response.data.data);
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch products!");
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);
// Async Thunk to fetch a single product
export const fetchSingleProduct = createAsyncThunk(
  "products/fetchSingle",
  async (productId, { rejectWithValue }) => {
    try {
      // const response = await axios.get(
      //   `${API_BASE_URL}/public/product/get/${productId}`
      const response = await api.get(`/public/product/get/${productId}`);
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch product details!");
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Slice for managing product state
const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    product: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single product
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.data;
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default productSlice.reducer;
