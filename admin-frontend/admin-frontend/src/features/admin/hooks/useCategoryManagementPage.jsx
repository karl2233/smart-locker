import { useEffect, useState } from "react";
import { useCategoryManager } from "../../../store/hooks/categoryHooks";
import useConfirmDialog from "../../../shared/hooks/useConfirmDialog";
import { toast } from "sonner";

const useCategoryManagementPage = () => {
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  const {
    confirmBox,
    cancelRef,
    openConfirmBox,
    closeConfirmBox,
    confirmAction,
  } = useConfirmDialog();

  const {
    categories,
    categoriesSelected,
    categoriesSelectedList,
    loading,
    status,
    statusDesc,
    createCategory,
    resetStatus,
    fetchCategories,
    toggleCategoryClicked,
    saveSelectedCategories,
  } = useCategoryManager();

  const handleToggleCategoryClicked = (categoryId) => {
    setSelectedCategoryIds((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      }

      return [...prev, categoryId];
    });

    toggleCategoryClicked(categoryId);
  };

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleCreateCategory = () => {
    if (!categoryName.trim()) return;

    openConfirmBox({
      title: "Add Category",
      message: "Would you like to continue adding this category?",
      action: () => createCategory(categoryName),
    });
  };

  const handleSaveSelectedCategories = () => {
    openConfirmBox({
      title: "Save Selected Categories",
      message:
        "Would you like to continue saving these selected categories?",
      action: () =>
        saveSelectedCategories(selectedCategoryIds),
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (status === "success") {
      toast.success(statusDesc);
      setCategoryName("");
      resetStatus();
    }

    if (status === "failed") {
      toast.error(statusDesc);
      resetStatus();
    }
  }, [status, statusDesc, resetStatus]);

  return {
    categoryName,
    categories,
    categoriesSelected,
    categoriesSelectedList,
    loading,
    status,
    statusDesc,
    handleCategoryNameChange,
    handleCreateCategory,
    handleToggleCategoryClicked,
    handleSaveSelectedCategories,
    resetStatus,

    confirmBox,
    cancelRef,
    closeConfirmBox,
    confirmAction,
  };
};

export default useCategoryManagementPage;