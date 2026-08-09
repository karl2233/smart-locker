import { renderHook, act } from "@testing-library/react";
import { toast } from "sonner";

import useMenuManagementPage from "@/features/admin/hooks/useMenuManagementPage";
import { useMenuManager } from "@/store/hooks/menuHooks";
import useConfirmDialog from "@/shared/hooks/useConfirmDialog";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/store/hooks/menuHooks", () => ({
  useMenuManager: vi.fn(),
}));

vi.mock("@/shared/hooks/useConfirmDialog", () => ({
  default: vi.fn(),
}));

const CATEGORY_ID = 3;

const buildManager = (overrides = {}) => ({
  categories: [],
  itemSelected: { categorySelectedId: CATEGORY_ID, items: [] },
  loading: false,
  status: "idle",
  statusDesc: "",
  fetchMenuSelectedCategories: vi.fn(),
  fetchItemsByCategorySelectedId: vi.fn(),
  createItem: vi.fn(),
  updateItem: vi.fn(),
  deleteItem: vi.fn(),
  setItemSelected: vi.fn(),
  resetMenuStatus: vi.fn(),
  ...overrides,
});

const buildConfirmDialog = (overrides = {}) => ({
  confirmBox: { isOpen: false, title: "", message: "", action: null },
  cancelRef: { current: null },
  openConfirmBox: vi.fn(),
  closeConfirmBox: vi.fn(),
  confirmAction: vi.fn(),
  ...overrides,
});

let manager;
let confirmDialog;

// --- setup helpers (never wrap the function under test) ---

const setCreateField = (result, name, value) =>
  act(() => {
    result.current.handleInputChange({ target: { name, value } });
  });

const setCreateFile = (result, name, file) =>
  act(() => {
    result.current.handleInputChange({ target: { name, files: [file] } });
  });

const setUpdateField = (result, name, value) =>
  act(() => {
    result.current.handleUpdateInputChange({ target: { name, value } });
  });

const setUpdateFile = (result, name, file) =>
  act(() => {
    result.current.handleUpdateInputChange({ target: { name, files: [file] } });
  });

const buildImage = (name = "pizza.png") =>
  new File(["fake-bytes"], name, { type: "image/png" });

const buildEvent = () => ({ preventDefault: vi.fn() });

// Runs the callback the hook handed to openConfirmBox (i.e. the user pressing "confirm").
const runConfirmedAction = async () => {
  const { action } = confirmDialog.openConfirmBox.mock.calls.at(-1)[0];
  await act(async () => {
    await action();
  });
};

beforeEach(() => {
  vi.clearAllMocks();

  manager = buildManager();
  confirmDialog = buildConfirmDialog();

  useMenuManager.mockReturnValue(manager);
  useConfirmDialog.mockReturnValue(confirmDialog);
});


describe("status effect", () => {
  it("statusEffect_shouldDoNothing_whenStatusIsLoading", () => {
    manager = buildManager({ status: "loading" });
    useMenuManager.mockReturnValue(manager);

    renderHook(() => useMenuManagementPage());

    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
    expect(manager.resetMenuStatus).not.toHaveBeenCalled();
  });

  it("statusEffect_shouldToastSuccessAndResetStatus_whenStatusIsSuccess", () => {
    manager = buildManager({
      status: "success",
      statusDesc: "Item created successfully",
    });
    useMenuManager.mockReturnValue(manager);

    renderHook(() => useMenuManagementPage());

    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith("Item created successfully");
    expect(toast.error).not.toHaveBeenCalled();
    expect(manager.resetMenuStatus).toHaveBeenCalledTimes(1);
  });

  it("statusEffect_shouldToastErrorAndResetStatus_whenStatusIsFailed", () => {
    manager = buildManager({
      status: "failed",
      statusDesc: "Item could not be created",
    });
    useMenuManager.mockReturnValue(manager);

    renderHook(() => useMenuManagementPage());

    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith("Item could not be created");
    expect(toast.success).not.toHaveBeenCalled();
    expect(manager.resetMenuStatus).toHaveBeenCalledTimes(1);
  });
});

describe("handleCreateItem", () => {
  it("handleCreateItem_shouldShowError_whenItemTitleIsEmpty", () => {
    const { result } = renderHook(() => useMenuManagementPage());
    const event = buildEvent();

    setCreateField(result, "itemDesc", "Cheesy and hot");
    setCreateField(result, "price", "12.5");
    setCreateFile(result, "image", buildImage());

    act(() => {
      result.current.handleCreateItem(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Please fill all fields");
    expect(confirmDialog.openConfirmBox).not.toHaveBeenCalled();
    expect(manager.createItem).not.toHaveBeenCalled();
  });

  it("handleCreateItem_shouldShowError_whenItemDescIsEmpty", () => {
    const { result } = renderHook(() => useMenuManagementPage());
    const event = buildEvent();

    setCreateField(result, "itemTitle", "Pizza");
    setCreateField(result, "price", "12.5");
    setCreateFile(result, "image", buildImage());

    act(() => {
      result.current.handleCreateItem(event);
    });

    expect(toast.error).toHaveBeenCalledWith("Please fill all fields");
    expect(confirmDialog.openConfirmBox).not.toHaveBeenCalled();
    expect(manager.createItem).not.toHaveBeenCalled();
  });

  it("handleCreateItem_shouldShowError_whenPriceIsEmpty", () => {
    const { result } = renderHook(() => useMenuManagementPage());
    const event = buildEvent();

    setCreateField(result, "itemTitle", "Pizza");
    setCreateField(result, "itemDesc", "Cheesy and hot");
    setCreateFile(result, "image", buildImage());

    act(() => {
      result.current.handleCreateItem(event);
    });

    expect(toast.error).toHaveBeenCalledWith("Please fill all fields");
    expect(confirmDialog.openConfirmBox).not.toHaveBeenCalled();
    expect(manager.createItem).not.toHaveBeenCalled();
  });

  it("handleCreateItem_shouldShowError_whenImageIsMissing", () => {
    const { result } = renderHook(() => useMenuManagementPage());
    const event = buildEvent();

    setCreateField(result, "itemTitle", "Pizza");
    setCreateField(result, "itemDesc", "Cheesy and hot");
    setCreateField(result, "price", "12.5");

    act(() => {
      result.current.handleCreateItem(event);
    });

    expect(toast.error).toHaveBeenCalledWith("Please fill all fields");
    expect(confirmDialog.openConfirmBox).not.toHaveBeenCalled();
    expect(manager.createItem).not.toHaveBeenCalled();
  });

  it("handleCreateItem_shouldOpenConfirmBoxAndCreateItemWithCorrectFormData_whenFormIsValid", async () => {
    const { result } = renderHook(() => useMenuManagementPage());
    const event = buildEvent();
    const image = buildImage();

    setCreateField(result, "itemTitle", "Pizza");
    setCreateField(result, "itemDesc", "Cheesy and hot");
    setCreateField(result, "price", "12.5");
    setCreateFile(result, "image", image);

    act(() => {
      result.current.handleCreateItem(event);
    });

    expect(toast.error).not.toHaveBeenCalled();
    expect(confirmDialog.openConfirmBox).toHaveBeenCalledTimes(1);
    expect(confirmDialog.openConfirmBox).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Create Menu Item",
        message: "Would you like to continue creating this menu item?",
        action: expect.any(Function),
      }),
    );

    await runConfirmedAction();

    expect(manager.createItem).toHaveBeenCalledTimes(1);

    const data = manager.createItem.mock.calls[0][0];

    expect(data.get("categorySelectedId")).toBe(String(CATEGORY_ID));
    expect(data.get("itemTitle")).toBe("Pizza");
    expect(data.get("itemDesc")).toBe("Cheesy and hot");
    expect(data.get("price")).toBe("12.5");
    expect(data.get("image")).toBeInstanceOf(File);
    expect(data.get("image").name).toBe("pizza.png");

    // form is cleared after a successful create
    expect(result.current.formData).toEqual({
      itemTitle: "",
      itemDesc: "",
      price: "",
      image: null,
    });
  });
});

describe("handleSubmitUpdateItem", () => {
  const existingItem = {
    itemId: 42,
    itemTitle: "Pizza",
    itemDesc: "Cheesy and hot",
    price: "12.5",
  };

  const openUpdateFor = (result, item = existingItem) =>
    act(() => {
      result.current.handleOpenUpdateItem(item);
    });

  it("handleSubmitUpdateItem_shouldShowError_whenItemTitleIsEmpty", () => {
    const { result } = renderHook(() => useMenuManagementPage());
    const event = buildEvent();

    openUpdateFor(result);
    setUpdateField(result, "itemTitle", "   ");

    act(() => {
      result.current.handleSubmitUpdateItem(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(
      "Please fill title, description, and price",
    );
    expect(confirmDialog.openConfirmBox).not.toHaveBeenCalled();
    expect(manager.updateItem).not.toHaveBeenCalled();
  });

  it("handleSubmitUpdateItem_shouldShowError_whenItemDescIsEmpty", () => {
    const { result } = renderHook(() => useMenuManagementPage());
    const event = buildEvent();

    openUpdateFor(result);
    setUpdateField(result, "itemDesc", "");

    act(() => {
      result.current.handleSubmitUpdateItem(event);
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Please fill title, description, and price",
    );
    expect(confirmDialog.openConfirmBox).not.toHaveBeenCalled();
    expect(manager.updateItem).not.toHaveBeenCalled();
  });

  it("handleSubmitUpdateItem_shouldShowError_whenPriceIsEmpty", () => {
    const { result } = renderHook(() => useMenuManagementPage());
    const event = buildEvent();

    openUpdateFor(result);
    setUpdateField(result, "price", "");

    act(() => {
      result.current.handleSubmitUpdateItem(event);
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Please fill title, description, and price",
    );
    expect(confirmDialog.openConfirmBox).not.toHaveBeenCalled();
    expect(manager.updateItem).not.toHaveBeenCalled();
  });

  it("handleSubmitUpdateItem_shouldAppendImageAndCallUpdateItem_whenANewImageIsPicked", async () => {
    const { result } = renderHook(() => useMenuManagementPage());
    const event = buildEvent();
    const image = buildImage("new-pizza.png");

    openUpdateFor(result);
    setUpdateField(result, "itemTitle", "Pizza Updated");
    setUpdateField(result, "itemDesc", "Now with basil");
    setUpdateField(result, "price", "15");
    setUpdateFile(result, "image", image);

    act(() => {
      result.current.handleSubmitUpdateItem(event);
    });

    expect(confirmDialog.openConfirmBox).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Update Menu Item",
        message: 'Are you sure you want to update "Pizza"?',
        action: expect.any(Function),
      }),
    );

    await runConfirmedAction();

    expect(manager.updateItem).toHaveBeenCalledTimes(1);

    const data = manager.updateItem.mock.calls[0][0];

    expect(data.get("itemId")).toBe(String(existingItem.itemId));
    expect(data.get("categorySelectedId")).toBe(String(CATEGORY_ID));
    expect(data.get("itemTitle")).toBe("Pizza Updated");
    expect(data.get("itemDesc")).toBe("Now with basil");
    expect(data.get("price")).toBe("15");
    expect(data.get("image")).toBeInstanceOf(File);
    expect(data.get("image").name).toBe("new-pizza.png");
    expect(data.get("image").type).toBe("image/png");

    // update panel is closed and reset afterwards
    expect(result.current.itemBeingUpdated).toBeNull();
    expect(result.current.updateFormData).toEqual({
      itemTitle: "",
      itemDesc: "",
      price: "",
      image: null,
    });
  });

  it("handleSubmitUpdateItem_shouldNotAppendImageButStillCallUpdateItem_whenNoNewImageIsPicked", async () => {
    const { result } = renderHook(() => useMenuManagementPage());
    const event = buildEvent();

    openUpdateFor(result);
    setUpdateField(result, "itemTitle", "Pizza Updated");

    act(() => {
      result.current.handleSubmitUpdateItem(event);
    });

    await runConfirmedAction();

    expect(manager.updateItem).toHaveBeenCalledTimes(1);

    const data = manager.updateItem.mock.calls[0][0];

    expect(data.has("image")).toBe(false);

    expect(data.get("itemId")).toBe(String(existingItem.itemId));
    expect(data.get("categorySelectedId")).toBe(String(CATEGORY_ID));
    expect(data.get("itemTitle")).toBe("Pizza Updated");
    expect(data.get("itemDesc")).toBe(existingItem.itemDesc);
    expect(data.get("price")).toBe(String(existingItem.price));
  });
});