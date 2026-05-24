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
    updateCategory,
    deleteSelectedCategory,
    deleteCategory,
  } = useCategoryManager();

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleToggleCategoryClicked = (categoryId) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );

    toggleCategoryClicked(categoryId);
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
    if (selectedCategoryIds.length === 0) return;

    openConfirmBox({
      title: "Save Selected Categories",
      message: "Would you like to continue saving these selected categories?",
      action: () => saveSelectedCategories(selectedCategoryIds),
    });
  };

  const handleUpdateCategory = (categoryToUpdateId, updatedCategoryName) => {
    if (!categoryToUpdateId || !updatedCategoryName.trim()) return;

    openConfirmBox({
      title: "Update Category",
      message: "Would you like to continue updating this category?",
      action: () => updateCategory(categoryToUpdateId, updatedCategoryName),
    });
  };

  const handleDeleteCategory = (categoryId) => {
    if (!categoryId) return;

    openConfirmBox({
      title: "Delete Category",
      message: "Would you like to continue deleting this category?",
      action: () => deleteCategory(categoryId),
    });
  };

  const handleDeleteSelectedCategory = (categorySelectedId) => {
    if (!categorySelectedId) return;

    openConfirmBox({
      title: "Delete Selected Category",
      message: "Would you like to continue removing this selected category?",
      action: () => deleteSelectedCategory(categorySelectedId),
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
      if (status === "loading") {
         return;
      }

    if (status === "success") {
      toast.success(statusDesc);
      setCategoryName("");
      setSelectedCategoryIds([]);
      resetStatus();
    }

    if (status === "failed") {
      toast.error(statusDesc);
      resetStatus();
    }
  }, [status, statusDesc, resetStatus]);

  return {
    categoryName,
    selectedCategoryIds,

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
    handleUpdateCategory,
    handleDeleteCategory,
    handleDeleteSelectedCategory,

    confirmBox,
    cancelRef,
    closeConfirmBox,
    confirmAction,
  };
};

export default useCategoryManagementPage;