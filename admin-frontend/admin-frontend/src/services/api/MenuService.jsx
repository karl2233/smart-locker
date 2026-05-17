import axiosInstance from "../interceptors/axiosInstance";

const getSelectedCategories = async () => {
  const response = await axiosInstance.get(
    "/admin/api/menu/selected-categories"
  );

  return response.data;
};

const createItem = async (formData) => {
  try {
    const response = await axiosInstance.post(
      "/admin/api/menu/create-items",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Failed to create item",
    };
  }
};

const getItemsByCategorySelectedId = async (categorySelectedId) => {
  try {
    const response = await axiosInstance.get(
      `/admin/api/menu/items/${categorySelectedId}`
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch items",
      }
    );
  }
};


const MenuService = {
  getSelectedCategories,
  createItem,
  getItemsByCategorySelectedId,
};

export default MenuService;