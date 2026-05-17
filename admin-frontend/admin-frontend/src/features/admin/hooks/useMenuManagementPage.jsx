import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMenuManager } from "../../../store/hooks/menuHooks";

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
  setItemSelected,
  resetMenuStatus,
} = useMenuManager();

  const [formData, setFormData] = useState({
    itemTitle: "",
    itemDesc: "",
    price: "",
    image: null,
  });

  useEffect(() => {
    fetchMenuSelectedCategories();
  }, []);

  useEffect(() => {
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
    };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleCreateItem = async (e) => {
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

    const data = new FormData();

    data.append("categorySelectedId", itemSelected.categorySelectedId);
    data.append("itemTitle", formData.itemTitle);
    data.append("itemDesc", formData.itemDesc);
    data.append("price", formData.price);
    data.append("image", formData.image);

    await createItem(data);

    setFormData({
      itemTitle: "",
      itemDesc: "",
      price: "",
      image: null,
    });
  };

  return {
    categories,
    itemSelected,
    loading,
    formData,
    handleCategoryClick,
    handleInputChange,
    handleCreateItem,
  };
};

export default useMenuManagementPage;