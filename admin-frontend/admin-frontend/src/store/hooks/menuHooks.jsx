import { useSelector, useDispatch } from "react-redux";
import {
  fetchMenuSelectedCategories,
  fetchItemsByCategorySelectedId,
  createItem,
  resetMenuStatus,
  setItemSelected,
  resetItemSelected,
} from "../slices/menuSlice";

export const useMenuCategories = () => {
  return useSelector((state) => state.menu.categories);
};

export const useItemSelected = () => {
  return useSelector((state) => state.menu.itemSelected);
};

export const useMenuLoading = () => {
  return useSelector((state) => state.menu.loading);
};

export const useMenuStatus = () => {
  return useSelector((state) => ({
    status: state.menu.status,
    statusDesc: state.menu.statusMessage,
  }));
};

export const useMenuActions = () => {
  const dispatch = useDispatch();

  return {
    fetchMenuSelectedCategories: () => dispatch(fetchMenuSelectedCategories()),

    fetchItemsByCategorySelectedId: (categorySelectedId) =>
      dispatch(fetchItemsByCategorySelectedId(categorySelectedId)),

    createItem: (formData) => dispatch(createItem(formData)),

    setItemSelected: (categorySelectedId) =>
      dispatch(setItemSelected(categorySelectedId)),

    resetItemSelected: () => dispatch(resetItemSelected()),

    resetMenuStatus: () => dispatch(resetMenuStatus()),
  };
};

export const useMenuManager = () => {
  const categories = useMenuCategories();
  const itemSelected = useItemSelected();
  const loading = useMenuLoading();
  const { status, statusDesc } = useMenuStatus();
  const actions = useMenuActions();

  return {
    categories,
    itemSelected,
    loading,
    status,
    statusDesc,
    ...actions,
  };
};