import { Button, HStack, Input } from "@chakra-ui/react";

const UpdateCategoryForm = ({
  categoryToUpdateId,
  updatedCategoryName,
  loading,
  setCategoryToUpdateId,
  setUpdatedCategoryName,
  handleUpdateCategory,
}) => {
  return (
    <HStack w="100%" spacing={3} mt={3}>
      <Input
        value={updatedCategoryName}
        onChange={(e) => setUpdatedCategoryName(e.target.value)}
        placeholder="Enter new category name"
        bg="app.surface"
        borderColor="app.border"
      />

      <Button
        onClick={() =>
          handleUpdateCategory(categoryToUpdateId, updatedCategoryName)
        }
        isLoading={loading}
        bg="brand.500"
        color="white"
        _hover={{ bg: "brand.600" }}
      >
        Save
      </Button>

      <Button
        onClick={() => {
          setCategoryToUpdateId(null);
          setUpdatedCategoryName("");
        }}
        bg="grayBrand.200"
        color="grayBrand.700"
        _hover={{ bg: "grayBrand.300" }}
      >
        Cancel
      </Button>
    </HStack>
  );
};

export default UpdateCategoryForm;