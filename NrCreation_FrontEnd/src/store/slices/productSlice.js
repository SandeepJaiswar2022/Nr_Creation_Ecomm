import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { API_BASE_URL } from "../api";
import api from "../api";
import { toast } from "react-toastify";
import { normalizeError } from "@/utils/normalizeError";
import { act } from "react";
const BASE_URL = "https://fakestoreapi.com/products"; // Example API

const token =
  localStorage.getItem("adminToken") ||
  `eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXNoaWxrdW1hcnJvaGlkYXMwQGdtYWlsLmNvbSIsImlhdCI6MTc0NTA2MTA5NCwiZXhwIjoxNzQ1MTQ3NDk0fQ.K3j8u3rL5plQts2IRP3J9cgTfSPLAiRrd08iOnNuqFs`;

// Async Thunk to fetch All product
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // const response = await axios.get(`${API_BASE_URL}/public/product/get/all`);
      console.log("Slice : Get All product");
      const response = await api.get("/public/product/get/all");
      return response.data;
    } catch (error) {
      const message = normalizeError(error);
      return rejectWithValue(message);
    }
  }
);

// Async Thunk to fetch All product
export const fetchAllCategories = createAsyncThunk(
  "products/fetchAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      // const response = await axios.get(`${API_BASE_URL}/public/product/get/all`);
      console.log("Slice : Get All Categories");
      const response = await api.get("/public/category/get/all");
      // console.log("My Products : ", response.data.data);
      return response.data;
    } catch (error) {
      const message = normalizeError(error);
      return rejectWithValue(message);
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
      const message = normalizeError(error);
      return rejectWithValue(message);
    }
  }
);

//Async Thunk to Update a Product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (productDataWithId, { rejectWithValue }) => {
    try {
      const { id, ...productData } = productDataWithId;
      const response = await api.put(`/product/update/${id}`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const message = normalizeError(error);
      return rejectWithValue(message);
    }
  }
);

//Async Thunk to add Product
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/product/add`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const message = normalizeError(error);
      return rejectWithValue(message);
    }
  }
);

// Async Thunk to Delete a product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/product/delete/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { productId, message: response.data?.message };
    } catch (error) {
      const message = normalizeError(error);
      return rejectWithValue(message);
    }
  }
);

// Slice for managing product state
const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    product: null,
    categories: [],
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
        state.products = action.payload?.data || [];
        toast.success(action.payload?.message);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Fetch single product
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload?.data;
        toast.success(action.payload?.message);
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, message } = action.payload;
        state.products = state.products.filter(product => product.id != productId);
        toast.success(message);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const targetId = action.payload?.data?.id;
        const index = state.products.findIndex(item => item?.id === targetId);

        if (index !== -1) { state.products[index] = action.payload?.data; }
        toast.success(action.payload?.message)
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload?.data);
        toast.success(action.payload?.message)
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Fetch All Categories
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload?.data || [];
        toast.success(action.payload?.message);
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // toast.error(action.payload);
      })
  },
});

// Add these selectors at the bottom of the file
export const selectAllProducts = (state) => state.product.products;
export const selectProductById = (state, productId) =>
  state.product.products.find((product) => product.id === productId);
export const selectProductsLoading = (state) => state.product.loading;
export const selectProductsError = (state) => state.product.error;

export default productSlice.reducer;
