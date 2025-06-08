import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { normalizeError } from "@/utils/normalizeError";
import api from "@/utils/api";

// Async Thunks
export const fetchAddresses = createAsyncThunk(
    "address/fetchAddresses",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/address/get-all-my-addresses");
            return response.data;
        } catch (error) {
            const message = normalizeError(error);
            return rejectWithValue(message);
        }
    }
);

export const addAddress = createAsyncThunk(
    "address/addAddress",
    async (addressData, { rejectWithValue }) => {
        try {
            const response = await api.post("/address/add", addressData);
            return response.data;
        } catch (error) {
            const message = normalizeError(error);
            return rejectWithValue(message);
        }
    }
);

export const updateAddress = createAsyncThunk(
    "address/updateAddress",
    async ({ addressId, addressData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/address/update/${addressId}`, addressData);
            return response.data;
        } catch (error) {
            const message = normalizeError(error);
            return rejectWithValue(message);
        }
    }
);

export const deleteAddress = createAsyncThunk(
    "address/deleteAddress",
    async (addressId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/address/delete/${addressId}`);
            return response.data;
        } catch (error) {
            const message = normalizeError(error);
            return rejectWithValue(message);
        }
    }
);

// Initial State
const initialState = {
    addresses: [],
    selectedAddressId: null,
    loading: false,
    error: null,
};

// Slice
const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        setSelectedAddress: (state, action) => {
            state.selectedAddressId = action.payload;
        },
        clearAddressState: (state) => {
            state.addresses = [];
            state.selectedAddressId = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Addresses
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload?.data || [];
                if (action.payload?.data?.length > 0) {
                    state.selectedAddressId = action.payload.data[0].addressId || null;
                }
                toast.success(action.payload?.message);
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            // Add Address
            .addCase(addAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses.push(action.payload?.data);
                state.selectedAddressId = action.payload?.data?.id;
                toast.success(action.payload?.message);
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            // Update Address
            .addCase(updateAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.addresses.findIndex(
                    (addr) => addr.id === action.payload?.data?.id
                );
                if (index !== -1) {
                    state.addresses[index] = action.payload?.data;
                }
                toast.success(action.payload?.message);
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            // Delete Address
            .addCase(deleteAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = state.addresses.filter(
                    (addr) => addr.id !== action.payload?.data?.id
                );
                if (state.selectedAddressId === action.payload?.data?.id) {
                    state.selectedAddressId = state.addresses[0]?.id || null;
                }
                toast.success(action.payload?.message);
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            });
    },
});

// Selectors
export const selectAddresses = (state) => state.address.addresses;
export const selectSelectedAddress = (state) =>
    state.address.addresses.find((addr) => addr?.addressId === state.address.selectedAddressId);
export const selectAddressLoading = (state) => state.address.loading;
export const getSelectedAddressId = (state) => state.address.selectedAddressId;
export const selectAddressError = (state) => state.address.error;

// Actions
export const { setSelectedAddress, clearAddressState } = addressSlice.actions;

export default addressSlice.reducer; 