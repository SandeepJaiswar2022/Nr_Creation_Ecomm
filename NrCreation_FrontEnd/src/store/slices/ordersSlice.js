import api from '@/utils/api';
import { normalizeError } from '@/utils/normalizeError';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Add initial filters state
const initialFilters = {
    search: "",
    startDate: "",
    endDate: "",
    orderStatus: "",
    priceLow: 0,
    priceHigh: 1000000,
    shippingMethod: "",
    page: 1,
    pageSize: 10,
};

// Async thunks
export const fetchAllOrders = createAsyncThunk(
    'orders/fetchAllOrders',
    async (filters = initialFilters, { rejectWithValue }) => {
        try {
            const params = {
                search: filters.search || null,
                startDate: filters.startDate || null,
                endDate: filters.endDate || null,
                status: filters.orderStatus || null,
                priceLow: filters.priceLow || 0,
                priceHigh: filters.priceHigh || 1000000,
                shippingMethod: filters.shippingMethod || null,
                page: (filters.page - 1) || 0,
                size: filters.pageSize || 10,
            };
            const response = await api.get('/orders/all-orders', { params });
            return response.data;
        } catch (error) {
            const message = normalizeError(error);
            return rejectWithValue(message);
        }
    }
);

export const fetchOrderById = createAsyncThunk(
    'orders/fetchOrderById',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            const message = normalizeError(error);
            return rejectWithValue(message);
        }
    }
);

export const fetchParticularCustomerOrders = createAsyncThunk(
    'orders/fetchParticularCustomerOrders',
    async (filters = initialFilters, { rejectWithValue }) => {
        try {
            const params = {
                search: filters.search || null,
                startDate: filters.startDate || null,
                endDate: filters.endDate || null,
                status: filters.orderStatus || null,
                priceLow: filters.priceLow || 0,
                priceHigh: filters.priceHigh || 1000000,
                shippingMethod: filters.shippingMethod || null,
                page: (filters.page - 1) || 0,
                size: filters.pageSize || 10,
            };
            const response = await api.get(`/orders/my-orders`, { params });
            return response.data;
        } catch (error) {
            const message = normalizeError(error);
            return rejectWithValue(message);
        }
    }
);

const initialState = {
    orders: [],
    currentOrder: null,
    customerOrders: [],
    loading: false,
    error: null,
    selectedOrderFilters: initialFilters,
    totalPages: 0,
    pageNumber: 0,
    totalElements: 0,
    last: true,
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
        clearCustomerOrders: (state) => {
            state.customerOrders = [];
        },
        setSelectedOrderFilters: (state, action) => {
            state.selectedOrderFilters = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Orders
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload?.data || [];
                state.totalPages = action.payload?.totalPages || 0;
                state.pageNumber = action.payload?.pageNumber || 0;
                state.totalElements = action.payload?.totalElements || 0;
                state.last = action.payload?.last;
                // toast.success(action.payload?.message || "Order fetched Successfully!")

                if (state.orders.length === 0) {
                    toast.error("No orders found. Try adjusting the filters.");
                } else {
                    toast.success(action.payload?.message);
                }
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Order By ID
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload?.data || {};
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Particular Customer Orders
            .addCase(fetchParticularCustomerOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchParticularCustomerOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.customerOrders = action.payload?.data || [];
                state.totalPages = action.payload?.totalPages || 0;
                state.pageNumber = action.payload?.pageNumber || 0;
                state.totalElements = action.payload?.totalElements || 0;
                state.last = action.payload?.last;
                if (state.customerOrders.length === 0) {
                    toast.error("No orders found. Try adjusting the filters.");
                } else {
                    toast.success(action.payload?.message);
                }
            })
            .addCase(fetchParticularCustomerOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            });
    },
});

export const { clearCurrentOrder, clearCustomerOrders, setSelectedOrderFilters } = ordersSlice.actions;
export default ordersSlice.reducer; 