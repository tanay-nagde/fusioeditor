// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const initialState = {
  user: null,
  canvases: [], // Add this line
  loading: false,
  error: null,
};

// --- Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
     setCanvases: (state, action) => {
      state.canvases = action.payload;
    },
      removeCanvas: (state, action) => {
      state.canvases = state.canvases.filter(canvas => canvas._id !== action.payload);
    },
    updateUserField: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        state.loading = false;
        state.error = null;
      }
    },
  },
});

// --- Actions
export const { setUser, clearUser, removeCanvas, setCanvases, updateUserField } = authSlice.actions;

// --- RTK Query API Endpoints
export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (body) => ({
        url: "/users/register",
        method: "POST",
        body,
      }),
    }),
    getMe: builder.query({
      query: () => "/users/me",
    }),
    
    getUserByEmail: builder.query({
      query: (email) => `/users/email/${email}`,
    }),
  }),
});

// --- Hooks
export const {
  useLoginMutation,
  useSignupMutation,
  useGetMeQuery,
  useGetUserByEmailQuery,
} = authApi;

// --- Reducer
export default authSlice.reducer;
