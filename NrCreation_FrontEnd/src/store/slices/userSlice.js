import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { normalizeError } from "@/utils/normalizeError";
import api from "@/utils/api";


// Only Admin can access this APIs

// Async Thunk to fetch All Users
export const fetchAllUser = createAsyncThunk(
    "products/fetchAllUser",
    async (currentAdminEmail, { rejectWithValue }) => {
        try {
            const response = await api.get("/user/get-all");
            return { currentAdminEmail, ...response.data };
        } catch (error) {
            const message = normalizeError(error);
            return rejectWithValue(message);
        }
    }
);


// Async Thunk to update User Role
export const updateUserRole = createAsyncThunk(
    "products/updateUserRole",
    async ({ userEmail, role }, { rejectWithValue }) => {
        try {
            const response = await api.put("/user/update-role",
                { userEmail: userEmail, role: role },
            );
            return { userEmail, role, ...response.data };
        } catch (error) {
            const message = normalizeError(error);
            return rejectWithValue(message);
        }
    }
);



// Slice for managing product state
const userSlice = createSlice({
    name: "user",
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch All Products
            .addCase(fetchAllUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload?.data.filter(user => user?.email !== action.payload?.currentAdminEmail) || [];
                toast.success(action.payload?.message);
            })
            .addCase(fetchAllUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            // Update User Role
            .addCase(updateUserRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.loading = false;
                const userIndex = state.users.findIndex(user => user?.email === action.payload?.userEmail);
                // Update the role of the user in the state
                if (userIndex !== -1) {
                    state.users[userIndex].role = action.payload?.role;
                }
                toast.success(action.payload?.message);
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
        // Add more cases for other async actions if needed
    },
});

export default userSlice.reducer;