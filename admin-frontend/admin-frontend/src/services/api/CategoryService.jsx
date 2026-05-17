import axiosInstance from "../interceptors/axiosInstance";

const createCategory = async (categoryReq) => {
  const response = await axiosInstance.post("/admin/api/category", categoryReq);
  return response.data;
};

const getAllCategories = async () => {
  const response = await axiosInstance.get("/admin/api/category");
  return response.data;
};

const selectCategories = async (categoryIds) => {
  const response = await axiosInstance.put(
    "/admin/api/category/selected",
    {
      categoryIds, // shorthand (same as categoryIds: categoryIds)
    }
  );

  return response.data;
};

const CategoryService = {
  createCategory,
  getAllCategories,
  selectCategories
};

export default CategoryService;