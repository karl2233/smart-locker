import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

import AdminPageContainer from "../components/AdminPageContainer";
import UpdateCategoryForm from "../components/UpdateCategoryForm";
import useCategoryManagementPage from "../hooks/useCategoryManagementPage";
import ConfirmDialog from "../../../shared/components/components/ConfirmDialog";
import AppLoadingScreen from "../../../shared/components/components/AppLoadingScreen ";

const CategoryManagementPage = () => {
  const [categoryToUpdateId, setCategoryToUpdateId] = useState(null);
  const [updatedCategoryName, setUpdatedCategoryName] = useState("");

  const {
    categoryName,
    categories,
    loading,

    handleCategoryNameChange,
    handleCreateCategory,
    handleToggleCategoryClicked,

    categoriesSelected,
    handleSaveSelectedCategories,
    categoriesSelectedList,

    handleUpdateCategory,
    handleDeleteCategory,
    handleDeleteSelectedCategory,

    confirmBox,
    cancelRef,
    closeConfirmBox,
    confirmAction,
  } = useCategoryManagementPage();

    if (loading) {
    return <AppLoadingScreen />;
  }

  return (
    <AdminPageContainer
      title="Category Management"
      description="Create, update, and organize categories for your restaurant menu."
    >
      <VStack align="stretch" spacing={6}>
        <Box variant="adminCard" p={6}>
          <VStack align="stretch" spacing={4}>
            <Text fontSize="lg" fontWeight="bold" color="card.title">
              Create New Category
            </Text>

            <HStack align="stretch">
              <Input
                placeholder="Enter category name"
                value={categoryName}
                onChange={handleCategoryNameChange}
                bg="app.surface"
                borderColor="app.border"
              />

              <Button onClick={handleCreateCategory} isLoading={loading}>
                Add Category
              </Button>
            </HStack>
          </VStack>
        </Box>

        <HStack
          align="start"
          spacing={6}
          w="100%"
          flexWrap={{ base: "wrap", lg: "nowrap" }}
        >
          <Box w="100%" maxW="520px">
            <Box variant="adminCard" p={6}>
              <VStack align="stretch" spacing={3}>
                <Text fontSize="lg" fontWeight="bold" color="card.title">
                  Categories
                </Text>

                {categories.length === 0 ? (
                  <Text color="app.muted">No categories yet.</Text>
                ) : (
                  categories.map((category) => (
                    <Box
                      key={category.categoryId}
                      p={4}
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="app.border"
                      bg="app.surface"
                    >
                      <HStack justify="space-between" align="center">
                        <Text fontWeight="600" color="app.text">
                          {category.categoryName}
                        </Text>

                        <HStack spacing={3}>
                          <Button
                            size="sm"
                            bg="brand.500"
                            color="white"
                            _hover={{ bg: "brand.600" }}
                            onClick={() => {
                              setCategoryToUpdateId(category.categoryId);
                              setUpdatedCategoryName(category.categoryName);
                            }}
                          >
                            Update
                          </Button>

                          <Button
                            size="sm"
                            bg="brand.500"
                            color="white"
                            _hover={{ bg: "brand.600" }}
                            onClick={() =>
                              handleDeleteCategory(category.categoryId)
                            }
                            isLoading={loading}
                          >
                            Delete
                          </Button>

                          <Checkbox
                            isChecked={category.clicked || false}
                            onChange={() =>
                              handleToggleCategoryClicked(category.categoryId)
                            }
                          />
                        </HStack>
                      </HStack>

                      {categoryToUpdateId === category.categoryId && (
                        <UpdateCategoryForm
                          categoryToUpdateId={categoryToUpdateId}
                          updatedCategoryName={updatedCategoryName}
                          loading={loading}
                          setCategoryToUpdateId={setCategoryToUpdateId}
                          setUpdatedCategoryName={setUpdatedCategoryName}
                          handleUpdateCategory={handleUpdateCategory}
                        />
                      )}
                    </Box>
                  ))
                )}
              </VStack>
            </Box>
          </Box>

          <Box w="100%" maxW="520px">
            <Box variant="adminCard" p={6}>
              <VStack align="stretch" spacing={3}>
                <Text fontSize="lg" fontWeight="bold" color="card.title">
                  Selected Categories
                </Text>

                {categoriesSelectedList.length === 0 ? (
                  <Text color="app.muted">No selected categories yet.</Text>
                ) : (
                  categoriesSelectedList.map((category) => (
                    <HStack
                      key={category.categorySelectedId}
                      p={4}
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="app.border"
                      bg="app.surface"
                      justify="space-between"
                    >
                      <Text fontWeight="600" color="app.text">
                        {category.categoryName}
                      </Text>

                      <Button
                        size="sm"
                        bg="brand.500"
                        color="white"
                        _hover={{ bg: "brand.600" }}
                        onClick={() =>
                          handleDeleteSelectedCategory(
                            category.categorySelectedId
                          )
                        }
                        isLoading={loading}
                      >
                        Delete
                      </Button>
                    </HStack>
                  ))
                )}
              </VStack>
            </Box>
          </Box>
        </HStack>
      </VStack>

      {categoriesSelected && (
        <Box
          position="fixed"
          bottom="30px"
          left="55%"
          transform="translateX(-50%)"
          zIndex="1000"
        >
          <Button
            borderRadius="full"
            w="60px"
            h="60px"
            fontSize="28px"
            boxShadow="xl"
            onClick={handleSaveSelectedCategories}
            isLoading={loading}
          >
            +
          </Button>
        </Box>
      )}

      <ConfirmDialog
        confirmBox={confirmBox}
        cancelRef={cancelRef}
        closeConfirmBox={closeConfirmBox}
        confirmAction={confirmAction}
      />
    </AdminPageContainer>
  );
};

export default CategoryManagementPage;