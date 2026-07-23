import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CategoryService from "../../services/api/CategoryService";

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async ({ categoryName }, thunkAPI) => {
    try {
      return await CategoryService.createCategory({ categoryName });
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, thunkAPI) => {
    try {
      return await CategoryService.getAllCategories();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const saveSelectedCategories = createAsyncThunk(
  "category/saveSelectedCategories",
  async (categoryIds, thunkAPI) => {
    try {
      return await CategoryService.selectCategories(categoryIds);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteSelectedCategory = createAsyncThunk(
  "category/deleteSelectedCategory",
  async (categorySelectedId, thunkAPI) => {
    try {
      await CategoryService.deleteSelectedCategory(categorySelectedId);
      return categorySelectedId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId, thunkAPI) => {
    try {
      await CategoryService.deleteCategory(categoryId);
      return categoryId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const updateCategory = async (categoryId, categoryName) => {
  try {
    const response = await axiosInstance.put(
      `/admin/api/category/${categoryId}`,
      { categoryName }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update category" };
  }
};

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
        state.statusMessage =
          action.payload.message || "Category created successfully";

        if (action.payload.data) {
          state.categories.push({
            ...action.payload.data,
            clicked: false,
          });
        }
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.statusMessage =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to create category";
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

        const categories = action.payload.data?.categories || [];
        const categoriesSelected = action.payload.data?.categoriesSelected || [];

        state.categoriesSelectedList = categoriesSelected;

        state.categories = categories.map((category) => ({
          ...category,
          clicked: false,
        }));

        state.categoriesSelected = state.categories.some(
          (category) => category.clicked
        );
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.statusMessage =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to fetch categories";
      })

      .addCase(saveSelectedCategories.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.statusMessage = "";
      })
      .addCase(saveSelectedCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "success";
        state.statusMessage =
          action.payload.message || "Categories selected successfully";

        state.categoriesSelectedList = action.payload.documents || [];
      })
      .addCase(saveSelectedCategories.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.statusMessage =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to save selected categories";
      })

      .addCase(deleteSelectedCategory.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.statusMessage = "";
      })
      .addCase(deleteSelectedCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "success";
        state.statusMessage = "Selected category deleted successfully";

        state.categoriesSelectedList = state.categoriesSelectedList.filter(
          (category) => category.categorySelectedId !== action.payload
        );
      })
      .addCase(deleteSelectedCategory.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.statusMessage =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to delete selected category";
      })

      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.statusMessage = "";
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "success";
        state.statusMessage = "Category deleted successfully";

        state.categories = state.categories.filter(
          (category) => category.categoryId !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.statusMessage =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to delete category";
      })

      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.statusMessage = "";
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "success";
        state.statusMessage =
          action.payload.message || "Category updated successfully";
      
        const category = state.categories.find(
          (category) => category.categoryId === action.payload.categoryId
        );

        if (category) {
          category.categoryName = action.payload.categoryName;
        }

          const selectedCategory = state.categoriesSelectedList.find(
            (category) => category.categoryId === action.payload.categoryId
          );

          if (selectedCategory) {
            selectedCategory.categoryName = action.payload.categoryName;
          }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.statusMessage =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to update category";
      });
  },
});

export const { resetStatus, toggleCategoryClicked } = categorySlice.actions;
export default categorySlice.reducer;