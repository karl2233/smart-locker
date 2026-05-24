import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMenuManager } from "../../../store/hooks/menuHooks";
import useConfirmDialog from "../../../shared/hooks/useConfirmDialog";

const initialCreateFormData = {
  itemTitle: "",
  itemDesc: "",
  price: "",
  image: null,
};

const initialUpdateFormData = {
  itemTitle: "",
  itemDesc: "",
  price: "",
  image: null,
};

const useMenuManagementPage = () => {
  const {
    categories,
    itemSelected,
    loading,
    status,
    statusDesc,
    fetchMenuSelectedCategories,
    fetchItemsByCategorySelectedId,
    createItem,
    updateItem,
    deleteItem,
    setItemSelected,
    resetMenuStatus,
  } = useMenuManager();

  const {
    confirmBox,
    cancelRef,
    openConfirmBox,
    closeConfirmBox,
    confirmAction,
  } = useConfirmDialog();

  const [formData, setFormData] = useState(initialCreateFormData);
  const [updateFormData, setUpdateFormData] = useState(initialUpdateFormData);
  const [itemBeingUpdated, setItemBeingUpdated] = useState(null);

  useEffect(() => {
    fetchMenuSelectedCategories();
  }, []);

  useEffect(() => {
    if(status==="loading"){
      return;
    }
    if (status === "success") {
      toast.success(statusDesc);
      resetMenuStatus();
    }

    if (status === "failed") {
      toast.error(statusDesc);
      resetMenuStatus();
    }
  }, [status, statusDesc, resetMenuStatus]);

  const handleCategoryClick = (categorySelectedId) => {
    setItemSelected(categorySelectedId);
    fetchItemsByCategorySelectedId(categorySelectedId);
    setItemBeingUpdated(null);
    setUpdateFormData(initialUpdateFormData);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleCreateItem = (e) => {
    e.preventDefault();

    if (
      !formData.itemTitle.trim() ||
      !formData.itemDesc.trim() ||
      !formData.price ||
      !formData.image
    ) {
      toast.error("Please fill all fields");
      return;
    }

    openConfirmBox({
      title: "Create Menu Item",
      message: "Would you like to continue creating this menu item?",
      action: async () => {
        const data = new FormData();

        data.append("categorySelectedId", itemSelected.categorySelectedId);
        data.append("itemTitle", formData.itemTitle);
        data.append("itemDesc", formData.itemDesc);
        data.append("price", formData.price);
        data.append("image", formData.image);

        await createItem(data);

        setFormData(initialCreateFormData);
      },
    });
  };

  const handleOpenUpdateItem = (item) => {
    setItemBeingUpdated(item);

    setUpdateFormData({
      itemTitle: item.itemTitle || "",
      itemDesc: item.itemDesc || "",
      price: item.price || "",
      image: null,
    });
  };

  const handleCloseUpdateItem = () => {
    setItemBeingUpdated(null);
    setUpdateFormData(initialUpdateFormData);
  };

  const handleUpdateInputChange = (e) => {
    const { name, value, files } = e.target;

    setUpdateFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmitUpdateItem = (e) => {
    e.preventDefault();

    if (!itemBeingUpdated) return;

    if (
      !updateFormData.itemTitle.trim() ||
      !updateFormData.itemDesc.trim() ||
      !updateFormData.price
    ) {
      toast.error("Please fill title, description, and price");
      return;
    }

    openConfirmBox({
      title: "Update Menu Item",
      message: `Are you sure you want to update "${itemBeingUpdated.itemTitle}"?`,
      action: async () => {
        const data = new FormData();

        data.append("itemId", itemBeingUpdated.itemId);
        data.append("categorySelectedId", itemSelected.categorySelectedId);
        data.append("itemTitle", updateFormData.itemTitle);
        data.append("itemDesc", updateFormData.itemDesc);
        data.append("price", updateFormData.price);

        if (updateFormData.image) {
          data.append("image", updateFormData.image);
        }

        await updateItem(data);

        setItemBeingUpdated(null);
        setUpdateFormData(initialUpdateFormData);
      },
    });
  };

  const handleDeleteItem = (item) => {
    openConfirmBox({
      title: "Delete Menu Item",
      message: `Are you sure you want to delete "${item.itemTitle}"?`,
      action: async () => {
        await deleteItem(item.itemId);
      },
    });
  };

  return {
    categories,
    itemSelected,
    loading,

    formData,
    updateFormData,
    itemBeingUpdated,

    handleCategoryClick,
    handleInputChange,
    handleCreateItem,

    handleOpenUpdateItem,
    handleCloseUpdateItem,
    handleUpdateInputChange,
    handleSubmitUpdateItem,

    handleDeleteItem,

    confirmBox,
    cancelRef,
    closeConfirmBox,
    confirmAction,
  };
};

export default useMenuManagementPage;