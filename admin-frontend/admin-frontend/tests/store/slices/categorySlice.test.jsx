import { describe, it, expect } from "vitest";

import reducer, {
  toggleCategoryClicked,
  fetchCategories,
  updateCategory,
} from "@/store/slices/categorySlice";

const baseState = {
  categories: [],
  categoriesSelected: false,
  categoriesSelectedList: [],
  loading: false,
  status: null,
  statusMessage: "",
};

describe("toggleCategoryClicked", () => {
  it("flips clicked on the matching category and updates categoriesSelected", () => {
    const state = {
      ...baseState,
      categories: [
        { categoryId: 1, categoryName: "Drinks", clicked: false },
        { categoryId: 2, categoryName: "Snacks", clicked: false },
      ],
    };

    const nextState = reducer(state, toggleCategoryClicked(1));

    expect(nextState.categories[0].clicked).toBe(true);
    expect(nextState.categories[1].clicked).toBe(false);
    expect(nextState.categoriesSelected).toBe(true);
  });
});

describe("fetchCategories.fulfilled", () => {
  it("stores categories with clicked=false and the selected list", () => {
    const payload = {
      message: "Categories fetched successfully",
      data: {
        categories: [
          { categoryId: 1, categoryName: "Drinks" },
          { categoryId: 2, categoryName: "Snacks" },
        ],
        categoriesSelected: [
          { categorySelectedId: 10, categoryId: 1, categoryName: "Drinks" },
        ],
      },
    };

    const nextState = reducer(
      { ...baseState, loading: true, status: "loading" },
      fetchCategories.fulfilled(payload)
    );

    expect(nextState.categories).toEqual([
      { categoryId: 1, categoryName: "Drinks", clicked: false },
      { categoryId: 2, categoryName: "Snacks", clicked: false },
    ]);
    expect(nextState.categoriesSelectedList).toEqual(
      payload.data.categoriesSelected
    );
    expect(nextState.categoriesSelected).toBe(false);
    expect(nextState.loading).toBe(false);
    expect(nextState.status).toBe("success");
    expect(nextState.statusMessage).toBe(payload.message);
  });
});

describe("updateCategory.fulfilled", () => {
  it("renames the category in both categories and categoriesSelectedList", () => {
    const state = {
      ...baseState,
      categories: [
        { categoryId: 1, categoryName: "Drinks", clicked: false },
        { categoryId: 2, categoryName: "Snacks", clicked: false },
      ],
      categoriesSelectedList: [
        { categorySelectedId: 10, categoryId: 1, categoryName: "Drinks" },
        { categorySelectedId: 11, categoryId: 2, categoryName: "Snacks" },
      ],
    };

    const payload = {
      message: "Category updated successfully",
      categoryId: 1,
      categoryName: "Beverages",
    };

    const nextState = reducer(state, updateCategory.fulfilled(payload));

    expect(nextState.categories[0].categoryName).toBe("Beverages");
    expect(nextState.categories[1].categoryName).toBe("Snacks");
    expect(nextState.categoriesSelectedList[0].categoryName).toBe("Beverages");
    expect(nextState.categoriesSelectedList[1].categoryName).toBe("Snacks");
    expect(nextState.loading).toBe(false);
    expect(nextState.status).toBe("success");
    expect(nextState.statusMessage).toBe(payload.message);
  });
});