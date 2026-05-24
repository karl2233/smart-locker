import axiosInstance from "../interceptors/axiosInstance";

const createCategory = async (categoryReq) => {
  try {
    const response = await axiosInstance.post("/admin/api/category", categoryReq);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create category" };
  }
};

const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get("/admin/api/category");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch categories" };
  }
};

const selectCategories = async (categoryIds) => {
  try {
    const response = await axiosInstance.put("/admin/api/category/selected", {
      categoryIds,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Failed to save selected categories",
    };
  }
};

const deleteSelectedCategory = async (categorySelectedId) => {
  try {
    const response = await axiosInstance.delete(
      `/admin/api/category/selected-categories/${categorySelectedId}`
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Failed to delete selected category",
    };
  }
};

const deleteCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.delete(
      `/admin/api/category/${categoryId}`
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete category" };
  }
};

const updateCategory = async (categoryId, categoryName) => {
  try {
    const response = await axiosInstance.put(
      `/admin/api/category/${categoryId}`,
      null,
      {
        params: {
          categoryName,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update category" };
  }
};

const CategoryService = {
  createCategory,
  getAllCategories,
  selectCategories,
  deleteSelectedCategory,
  deleteCategory,
  updateCategory,
};

export default CategoryService;