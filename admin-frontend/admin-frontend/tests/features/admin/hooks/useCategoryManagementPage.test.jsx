import { renderHook, act } from "@testing-library/react";
import { toast } from "sonner";
import useCategoryManagementPage from "@/features/admin/hooks/useCategoryManagementPage";

const h = vi.hoisted(() => ({ manager: null, confirm: null }));

vi.mock("@/store/hooks/categoryHooks", () => ({
  useCategoryManager: () => h.manager,
}));

vi.mock("@/shared/hooks/useConfirmDialog", () => ({
  default: () => h.confirm,
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const buildManager = (overrides = {}) => ({
  categories: [],
  categoriesSelected: [],
  categoriesSelectedList: [],
  loading: false,
  status: "idle",
  statusDesc: "",
  createCategory: vi.fn(),
  resetStatus: vi.fn(),
  fetchCategories: vi.fn(),
  toggleCategoryClicked: vi.fn(),
  saveSelectedCategories: vi.fn(),
  updateCategory: vi.fn(),
  deleteSelectedCategory: vi.fn(),
  deleteCategory: vi.fn(),
  ...overrides,
});

const buildConfirmDialog = () => ({
  confirmBox: { isOpen: false, title: "", message: "", action: null },
  cancelRef: { current: null },
  openConfirmBox: vi.fn(),
  closeConfirmBox: vi.fn(),
  confirmAction: vi.fn(),
});

beforeEach(() => {
  vi.clearAllMocks();
  h.manager = buildManager();
  h.confirm = buildConfirmDialog();
});

describe("status effect", () => {
  it("statusEffect_shouldDoNothing_whenStatusIsLoading", () => {
    h.manager = buildManager({ status: "loading" });

    renderHook(() => useCategoryManagementPage());

    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
    expect(h.manager.resetStatus).not.toHaveBeenCalled();
  });

  it("statusEffect_shouldToastSuccessAndResetStatus_whenStatusIsSuccess", () => {
    h.manager = buildManager({ status: "success" });

    renderHook(() => useCategoryManagementPage());

    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(h.manager.statusDesc);
    expect(toast.error).not.toHaveBeenCalled();
    expect(h.manager.resetStatus).toHaveBeenCalledTimes(1);
  });

  it("statusEffect_shouldToastErrorAndResetStatus_whenStatusIsFailed", () => {
    h.manager = buildManager({ status: "failed" });

    renderHook(() => useCategoryManagementPage());

    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith(h.manager.statusDesc);
    expect(toast.success).not.toHaveBeenCalled();
    expect(h.manager.resetStatus).toHaveBeenCalledTimes(1);
  });
});

describe("useCategoryManagementPage - mount", () => {
  it("fetches categories once on mount", () => {
    renderHook(() => useCategoryManagementPage());

    expect(h.manager.fetchCategories).toHaveBeenCalledTimes(1);
  });
});

describe("handleCreateCategory", () => {
  it("returns early when the category name is empty", () => {
    const { result } = renderHook(() => useCategoryManagementPage());

    act(() => {
      result.current.handleCreateCategory();
    });

    expect(h.confirm.openConfirmBox).not.toHaveBeenCalled();
    expect(h.manager.createCategory).not.toHaveBeenCalled();
  });

  it("returns early when the category name is only whitespace", () => {
    const { result } = renderHook(() => useCategoryManagementPage());
    act(() => {
      result.current.handleCategoryNameChange({ target: { value: "   " } });
    });

    act(() => {
      result.current.handleCreateCategory();
    });

    expect(h.confirm.openConfirmBox).not.toHaveBeenCalled();
    expect(h.manager.createCategory).not.toHaveBeenCalled();
  });

  it("opens the confirm box and creates the category once confirmed", () => {
    const { result } = renderHook(() => useCategoryManagementPage());
    act(() => {
      result.current.handleCategoryNameChange({ target: { value: "Drinks" } });
    });

    act(() => {
      result.current.handleCreateCategory();
    });

    expect(h.confirm.openConfirmBox).toHaveBeenCalledTimes(1);
    expect(h.confirm.openConfirmBox).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Add Category" })
    );
    expect(h.manager.createCategory).not.toHaveBeenCalled();

    act(() => {
      h.confirm.openConfirmBox.mock.calls[0][0].action();
    });

    expect(h.manager.createCategory).toHaveBeenCalledWith("Drinks");
  });
});

describe("handleToggleCategoryClicked", () => {
  it("adds then removes the id locally and forwards every click to the store", () => {
    const { result } = renderHook(() => useCategoryManagementPage());

    act(() => {
      result.current.handleToggleCategoryClicked(1);
    });
    expect(result.current.selectedCategoryIds).toEqual([1]);

    act(() => {
      result.current.handleToggleCategoryClicked(1);
    });
    expect(result.current.selectedCategoryIds).toEqual([]);

    expect(h.manager.toggleCategoryClicked).toHaveBeenCalledTimes(2);
    expect(h.manager.toggleCategoryClicked).toHaveBeenLastCalledWith(1);
  });
});

describe("handleSaveSelectedCategories", () => {
  it("returns early when nothing is selected", () => {
    const { result } = renderHook(() => useCategoryManagementPage());

    act(() => {
      result.current.handleSaveSelectedCategories();
    });

    expect(h.confirm.openConfirmBox).not.toHaveBeenCalled();
    expect(h.manager.saveSelectedCategories).not.toHaveBeenCalled();
  });

  it("saves the selected ids once confirmed", () => {
    const { result } = renderHook(() => useCategoryManagementPage());
    act(() => {
      result.current.handleToggleCategoryClicked(1);
    });
    act(() => {
      result.current.handleToggleCategoryClicked(2);
    });

    act(() => {
      result.current.handleSaveSelectedCategories();
    });

    expect(h.confirm.openConfirmBox).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Save Selected Categories" })
    );

    act(() => {
      h.confirm.openConfirmBox.mock.calls[0][0].action();
    });

    expect(h.manager.saveSelectedCategories).toHaveBeenCalledWith([1, 2]);
  });
});

describe("handleUpdateCategory", () => {
  it("returns early when the id is missing", () => {
    const { result } = renderHook(() => useCategoryManagementPage());

    act(() => {
      result.current.handleUpdateCategory(null, "Desserts");
    });

    expect(h.confirm.openConfirmBox).not.toHaveBeenCalled();
    expect(h.manager.updateCategory).not.toHaveBeenCalled();
  });

  it("returns early when the new name is blank", () => {
    const { result } = renderHook(() => useCategoryManagementPage());

    act(() => {
      result.current.handleUpdateCategory(3, "   ");
    });

    expect(h.confirm.openConfirmBox).not.toHaveBeenCalled();
    expect(h.manager.updateCategory).not.toHaveBeenCalled();
  });

  it("updates the category once confirmed", () => {
    const { result } = renderHook(() => useCategoryManagementPage());

    act(() => {
      result.current.handleUpdateCategory(3, "Desserts");
    });

    expect(h.confirm.openConfirmBox).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Update Category" })
    );

    act(() => {
      h.confirm.openConfirmBox.mock.calls[0][0].action();
    });

    expect(h.manager.updateCategory).toHaveBeenCalledWith(3, "Desserts");
  });
});

describe("handleDeleteCategory", () => {
  it("returns early when the id is missing", () => {
    const { result } = renderHook(() => useCategoryManagementPage());

    act(() => {
      result.current.handleDeleteCategory(null);
    });

    expect(h.confirm.openConfirmBox).not.toHaveBeenCalled();
    expect(h.manager.deleteCategory).not.toHaveBeenCalled();
  });

  it("deletes the category once confirmed", () => {
    const { result } = renderHook(() => useCategoryManagementPage());

    act(() => {
      result.current.handleDeleteCategory(7);
    });

    expect(h.confirm.openConfirmBox).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Delete Category" })
    );

    act(() => {
      h.confirm.openConfirmBox.mock.calls[0][0].action();
    });

    expect(h.manager.deleteCategory).toHaveBeenCalledWith(7);
  });
});

describe("handleDeleteSelectedCategory", () => {
  it("returns early when the id is missing", () => {
    const { result } = renderHook(() => useCategoryManagementPage());

    act(() => {
      result.current.handleDeleteSelectedCategory(null);
    });

    expect(h.confirm.openConfirmBox).not.toHaveBeenCalled();
    expect(h.manager.deleteSelectedCategory).not.toHaveBeenCalled();
  });

  it("removes the selected category once confirmed", () => {
    const { result } = renderHook(() => useCategoryManagementPage());

    act(() => {
      result.current.handleDeleteSelectedCategory(9);
    });

    expect(h.confirm.openConfirmBox).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Delete Selected Category" })
    );

    act(() => {
      h.confirm.openConfirmBox.mock.calls[0][0].action();
    });

    expect(h.manager.deleteSelectedCategory).toHaveBeenCalledWith(9);
  });
});

describe("useCategoryManagementPage - status effect", () => {
  it("does nothing while the status is loading", () => {
    const { rerender } = renderHook(() => useCategoryManagementPage());

    h.manager.status = "loading";
    h.manager.statusDesc = "Saving...";
    rerender();

    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
    expect(h.manager.resetStatus).not.toHaveBeenCalled();
  });

  it("toasts success, clears the form and resets the status", () => {
    const { result, rerender } = renderHook(() => useCategoryManagementPage());
    act(() => {
      result.current.handleCategoryNameChange({ target: { value: "Drinks" } });
    });
    act(() => {
      result.current.handleToggleCategoryClicked(1);
    });

    h.manager.status = "success";
    h.manager.statusDesc = "Category added";
    rerender();

    expect(toast.success).toHaveBeenCalledWith("Category added");
    expect(toast.error).not.toHaveBeenCalled();
    expect(result.current.categoryName).toBe("");
    expect(result.current.selectedCategoryIds).toEqual([]);
    expect(h.manager.resetStatus).toHaveBeenCalledTimes(1);
  });

  it("toasts the error, keeps the form and resets the status", () => {
    const { result, rerender } = renderHook(() => useCategoryManagementPage());
    act(() => {
      result.current.handleCategoryNameChange({ target: { value: "Drinks" } });
    });

    h.manager.status = "failed";
    h.manager.statusDesc = "Category already exists";
    rerender();

    expect(toast.error).toHaveBeenCalledWith("Category already exists");
    expect(toast.success).not.toHaveBeenCalled();
    expect(result.current.categoryName).toBe("Drinks");
    expect(h.manager.resetStatus).toHaveBeenCalledTimes(1);
  });
});