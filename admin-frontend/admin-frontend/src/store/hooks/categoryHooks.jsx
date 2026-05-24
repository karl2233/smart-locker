import { useSelector, useDispatch } from "react-redux";
import {
  createCategory,
  resetStatus,
  fetchCategories,
  toggleCategoryClicked,
  saveSelectedCategories,
  deleteSelectedCategory,
  deleteCategory,
  updateCategory,
} from "../slices/categorySlice";

// Selector hooks
export const useCategories = () => {
  return useSelector((state) => state.category.categories);
};

export const useCategoriesSelected = () => {
  return useSelector((state) => state.category.categoriesSelected);
};

export const useCategoriesSelectedList = () => {
  return useSelector((state) => state.category.categoriesSelectedList);
};

export const useCategoryLoading = () => {
  return useSelector((state) => state.category.loading);
};

export const useCategoryStatus = () => {
  return useSelector((state) => ({
    status: state.category.status,
    statusDesc: state.category.statusMessage,
  }));
};

// Action hooks
export const useCategoryActions = () => {
  const dispatch = useDispatch();

  return {
    createCategory: (categoryName) =>
      dispatch(createCategory({ categoryName })),

    fetchCategories: () => dispatch(fetchCategories()),

    toggleCategoryClicked: (categoryId) =>
      dispatch(toggleCategoryClicked(categoryId)),

    saveSelectedCategories: (categoryIds) =>
      dispatch(saveSelectedCategories(categoryIds)),

    deleteSelectedCategory: (categorySelectedId) =>
      dispatch(deleteSelectedCategory(categorySelectedId)),

    deleteCategory: (categoryId) =>
      dispatch(deleteCategory(categoryId)),

    updateCategory: (categoryId, categoryName) =>
      dispatch(updateCategory({ categoryId, categoryName })),

    resetStatus: () => dispatch(resetStatus()),
  };
};

// Combined hook
export const useCategoryManager = () => {
  const categories = useCategories();
  const categoriesSelected = useCategoriesSelected();
  const categoriesSelectedList = useCategoriesSelectedList();
  const loading = useCategoryLoading();
  const { status, statusDesc } = useCategoryStatus();
  const actions = useCategoryActions();

  return {
    categories,
    categoriesSelected,
    categoriesSelectedList,
    loading,
    status,
    statusDesc,
    ...actions,
  };
};