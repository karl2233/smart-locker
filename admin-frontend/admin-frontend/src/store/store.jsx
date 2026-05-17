import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice";
import menuReducer from "./slices/menuSlice";

const store = configureStore({
  reducer: {
    category: categoryReducer,
    menu: menuReducer,
  },
});

export default store;