// src/redux/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    totalItems: 0,
  },
  reducers: {
    setTotalItems: (state, action) => {
      state.totalItems = action.payload;
    },
  },
});

// Export actions to use in components
export const { setTotalItems } = cartSlice.actions;

// Export the reducer to be included in the store
export default cartSlice.reducer;
