import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import MenuService from "../../services/api/MenuService";

export const fetchMenuSelectedCategories = createAsyncThunk(
  "menu/fetchMenuSelectedCategories",
  async (_, thunkAPI) => {
    try {
      return await MenuService.getSelectedCategories();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch selected categories",
        }
      );
    }
  }
);

export const createItem = createAsyncThunk(
  "menu/createItem",
  async (formData, thunkAPI) => {
    try {
      return await MenuService.createItem(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchItemsByCategorySelectedId = createAsyncThunk(
  "menu/fetchItemsByCategorySelectedId",
  async (categorySelectedId, thunkAPI) => {
    try {
      return await MenuService.getItemsByCategorySelectedId(categorySelectedId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteItem = createAsyncThunk(
  "menu/deleteItem",
  async (itemId, thunkAPI) => {
    try {
       await MenuService.deleteItem(itemId);
       return itemId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  categories: [],

  itemSelected: {
    categorySelectedId: null,
    isCategorySelected: false,
    items: [],
  },

  loading: false,
  status: null,
  statusMessage: "",
};

const menuSlice = createSlice({
  name: "menu",
  initialState,

  reducers: {
    resetMenuStatus: (state) => {
      state.status = null;
      state.statusMessage = "";
    },

    setItemSelected: (state, action) => {
      state.itemSelected = {
        ...state.itemSelected,
        categorySelectedId: action.payload,
        isCategorySelected: true,
      };
    },

    resetItemSelected: (state) => {
      state.itemSelected = {
        isItemSelected: false,
        categorySelectedId: null,
        isCategorySelected: false,
        items: [],
      };
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch selected categories
      .addCase(fetchMenuSelectedCategories.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.statusMessage = "";
      })

      .addCase(fetchMenuSelectedCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "success";
        state.statusMessage =
          action.payload.message || "Selected categories fetched successfully";

        state.categories = action.payload.documents || [];
      })

      .addCase(fetchMenuSelectedCategories.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.statusMessage =
          action.payload?.message || "Failed to fetch selected categories";
      })

      // Create item
      .addCase(createItem.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.statusMessage = "";
      })

      .addCase(createItem.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "success";
        state.statusMessage =
          action.payload.message || "Item created successfully";

        state.itemSelected.items.push(action.payload.data);
      })

      .addCase(createItem.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.statusMessage =
          action.payload?.message || "Failed to create item";
      })
      .addCase(fetchItemsByCategorySelectedId.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.statusMessage = "";
        state.itemSelected.items = [];
      })

      .addCase(fetchItemsByCategorySelectedId.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "success";
        state.statusMessage =
        action.payload.message || "Items fetched successfully";

        state.itemSelected.items = action.payload.documents || [];
      })

      .addCase(fetchItemsByCategorySelectedId.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.statusMessage =
          action.payload?.message || "Failed to fetch items";

        state.itemSelected.items = [];
      })
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.statusMessage = "";
      })

      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "success";
        state.statusMessage = "Item deleted successfully";

        state.itemSelected.items = state.itemSelected.items.filter(
          (item) => item.itemId !== action.payload
        );
      })

      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.statusMessage =
          action.payload?.message || "Failed to delete item";
      });

  },
});

export const {
  resetMenuStatus,
  setItemSelected,
  resetItemSelected,
} = menuSlice.actions;

export default menuSlice.reducer;