import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CategoryService from "../../services/api/CategoryService";

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async ({ categoryName }, thunkAPI) => {
    try {
      return await CategoryService.createCategory({ categoryName });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to create category" }
      );
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, thunkAPI) => {
    try {
      return await CategoryService.getAllCategories();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to fetch categories" }
      );
    }
  }
);

export const saveSelectedCategories = createAsyncThunk(
  "category/saveSelectedCategories",
  async (categoryIds, thunkAPI) => {
    try {
      const response = await CategoryService.selectCategories(categoryIds);

      return response; // ListSuccessResponse
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Failed to save selected categories",
        }
      );
    }
  }
);

const initialState = {
  categories: [],
  categoriesSelected: false, 
  categoriesSelectedList: [], 
  loading: false,
  status: null,
  statusMessage: "",
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = null;
      state.statusMessage = "";
    },

    toggleCategoryClicked: (state, action) => {
      const categoryId = action.payload;

      const category = state.categories.find(
        (category) => category.categoryId === categoryId
      );

      if (category) {
        category.clicked = !category.clicked;
      }

      // 👇 recompute after toggle
      state.categoriesSelected = state.categories.some(
        (category) => category.clicked
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.statusMessage = "";
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "success";
        state.statusMessage = action.payload.message || "Category created successfully";
        if (action.payload.data) {
          state.categories.push(action.payload.data);
        }
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.statusMessage =
          action.payload?.message || "Failed to create category";
      })
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.statusMessage = "";
      })
   .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "success";
        state.statusMessage = action.payload.message;

        console.log(action.payload.data.categoriesSelected);

        const categories = action.payload.data.categories || [];
        const categoriesSelected = action.payload.data.categoriesSelected || [];

        state.categoriesSelectedList = categoriesSelected;

        state.categories = categories.map((category) => ({
          ...category,
          clicked:false,
        }));

        state.categoriesSelected = categoriesSelected.length > 0;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.statusMessage =
          action.payload?.message || "Failed to fetch categories";
      })
      .addCase(saveSelectedCategories.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.statusMessage = "";
      })

      .addCase(saveSelectedCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "success";
        state.statusMessage = action.payload.message;
        // backend response
        state.categoriesSelectedList = action.payload.documents || [];
      })

      .addCase(saveSelectedCategories.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.statusMessage =
          action.payload?.message || "Failed to save selected categories";
      });
  },
});

export const { resetStatus, toggleCategoryClicked } = categorySlice.actions;
export default categorySlice.reducer;