import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { normalizeError } from "@/utils/normalizeError";
import api from "@/utils/api";


// Async Thunk to fetch All product
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (selectedFilters, { rejectWithValue }) => {
    try {
      // const response = await axios.get(`${API_BASE_URL}/public/product/get/all`);
      console.log("Slice : Get All product : ", selectedFilters);
      const search = ""
      const category = "dupattas"
      const available = selectedFilters.avavailability === 'Out of Stock' ? false : true;
      const low = selectedFilters.priceLow || 0;
      const high = selectedFilters.priceHigh || 10000000;
      const page = selectedFilters.page - 1 || 0;
      const size = selectedFilters.pageSize || 10;
      const sortDir = selectedFilters.sortOrFeaturedOrNewest || 'asc';


      const response = await api.get(`/public/product/get-all`, {
        params: { search, category, available, low, high, page, size, sortDir }
      });
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

// Cannot destructure property 'id' of 'productDataWithId' as it is undefined.

//Async Thunk to Update a Product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (productDataWithId, { rejectWithValue }) => {
    try {
      const { id, ...productData } = productDataWithId;
      const response = await api.put(`/product/update/${id}`, productData);
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
      const response = await api.post(`/product/add`, productData);
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
      const response = await api.delete(`/product/delete/${productId}`);
      return { productId, message: response.data?.message };
    } catch (error) {
      const message = normalizeError(error);
      return rejectWithValue(message);
    }
  }
);

// Async Thunk to Delete a product
export const deleteAnImageFromProduct = createAsyncThunk(
  "products/deleteAnImageFromProduct",
  async ({ deletedImageUrl, productId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/image/delete/${productId}`,
        {
          params: { url: deletedImageUrl }
        }
      );
      return { deletedImageUrl, message: response.data?.message };
    } catch (error) {
      const message = normalizeError(error);
      return rejectWithValue(message);
    }
  }
);


// Async Thunk to Delete a product
export const uploadProductImages = createAsyncThunk(
  "product/uploadImages",
  async ({ productId, images }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("images", image);
      });

      console.log("My data images : ", images);
      console.log("productid : ", productId);


      const response = await api.post(
        `/image/add/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
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
    totalPages: 0,
    productImages: [],
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
        state.totalPages = action.payload?.totalPages;
        if (action.payload?.data?.length > 0)
          toast.success(action.payload?.message);
        else
          toast.error("No products found with selected filters!")
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
        state.productImages = action.payload?.data?.imageUrls;
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

      // Delete product
      .addCase(deleteAnImageFromProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAnImageFromProduct.fulfilled, (state, action) => {
        state.loading = false;
        const { deletedImageUrl, message } = action.payload;
        state.productImages = state.productImages.filter(imageUrl => imageUrl != deletedImageUrl);
        toast.success(message);
      })
      .addCase(deleteAnImageFromProduct.rejected, (state, action) => {
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
        // toast.success(action.payload?.message);
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // toast.error(action.payload);
      })

      // Upload the product Images
      .addCase(uploadProductImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProductImages.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Upload product : ", action.payload.data);
        // console.log("productid : ", productId);

        state.productImages = action.payload?.data?.imageUrls;
        toast.success(action.payload?.message);
      })
      .addCase(uploadProductImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
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
