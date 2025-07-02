import api from '@/utils/api';
import { normalizeError } from '@/utils/normalizeError';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Async thunks
export const fetchAllOrders = createAsyncThunk(
    'orders/fetchAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/orders/all-orders');
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
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/orders/my-orders`);
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
                toast.success(action.payload?.message || "Order fetched Successfully!")
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
                toast.success(action.payload?.message);
            })
            .addCase(fetchParticularCustomerOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            });
    },
});

export const { clearCurrentOrder, clearCustomerOrders } = ordersSlice.actions;
export default ordersSlice.reducer; 