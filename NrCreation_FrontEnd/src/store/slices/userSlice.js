import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { normalizeError } from "@/utils/normalizeError";
import api from "@/utils/api";


// Only Admin can access this APIs

// Async Thunk to fetch All Users
export const fetchAllUser = createAsyncThunk(
    "products/fetchAllUser",
    async ({ loggedInAdminEmail, filters }, { rejectWithValue }) => {
        try {
            // console.log("Fetching all users with filters:", filters);

            const params = {
                search: filters.search || null,
                birthYear: filters.birthYear || null,
                city: filters.city || null,
                state: filters.state || null,
                page: (filters.page - 1) || 0,
                size: filters.pageSize || 10,
            };

            const response = await api.get("/user/get-all", { params });
            return { loggedInAdminEmail, ...response.data };
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
        filters: {
            search: "",
            birthYear: "",
            city: "",
            state: "",
            role: "",
            page: 1,
            pageSize: 10,
            totalPages: 0,
            totalElements: 0,
            last: false
        },
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Products
            .addCase(fetchAllUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload?.data.filter(user => user?.email !== action.payload?.loggedInAdminEmail) || [];
                state.filters.totalPages = action.payload?.totalPages || 0;
                state.filters.page = action.payload?.pageNumber || 1;
                state.filters.totalElements = action.payload?.totalElements || 0;
                state.filters.last = action.payload?.last;
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

export const { setFilters } = userSlice.actions;
export default userSlice.reducer;