import { describe, it, expect } from "vitest";
import menuReducer, { deleteItem } from "@/store/slices/menuSlice";

describe("deleteItem", () => {
  it("fulfilled removes only the item matching the returned id", () => {
    const previousState = {
      categories: [],
      itemSelected: {
        categorySelectedId: 1,
        isCategorySelected: true,
        items: [{ itemId: 1 }, { itemId: 2 }, { itemId: 3 }],
      },
      loading: true,
      status: "loading",
      statusMessage: "",
    };

    const state = menuReducer(
      previousState,
      deleteItem.fulfilled(2, "request-id", 2)
    );

    expect(state.itemSelected.items).toEqual([{ itemId: 1 }, { itemId: 3 }]);
  });
});