import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  HStack,
  Checkbox,
} from "@chakra-ui/react";

import AdminPageContainer from "../components/AdminPageContainer";
import useCategoryManagementPage from "../hooks/useCategoryManagementPage";
import ConfirmDialog from "../../../shared/components/components/ConfirmDialog";
//"../../../shared/components/ConfirmDialog";

const CategoryManagementPage = () => {
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
    confirmBox,
    cancelRef,
    closeConfirmBox,
    confirmAction,
  } = useCategoryManagementPage();

  return (
    <AdminPageContainer
      title="Category Management"
      description="Create, update, and organize categories for your restaurant menu."
    >
      <VStack align="stretch" spacing={6}>
        <Box
          p={6}
          borderRadius="16px"
          bg="white"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.200"
        >
          <VStack align="stretch" spacing={4}>
            <Text fontSize="lg" fontWeight="bold">
              Create New Category
            </Text>

            <HStack align="stretch">
              <Input
                placeholder="Enter category name"
                value={categoryName}
                onChange={handleCategoryNameChange}
              />

              <Button
                colorScheme="blue"
                onClick={handleCreateCategory}
                isLoading={loading}
                loadingText="Creating"
              >
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
          <Box w="100%" maxW="500px">
            <Box
              p={6}
              borderRadius="16px"
              bg="white"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.200"
            >
              <VStack align="stretch" spacing={3}>
                <Text fontSize="lg" fontWeight="bold">
                  Categories
                </Text>

                {categories.length === 0 ? (
                  <Text color="gray.500">No categories yet.</Text>
                ) : (
                  categories.map((category) => (
                    <HStack
                      key={category.categoryId}
                      p={4}
                      borderRadius="12px"
                      border="1px solid"
                      borderColor="gray.200"
                      justify="space-between"
                    >
                      <Text fontWeight="medium">
                        {category.categoryName}
                      </Text>

                      <Checkbox
                        isChecked={category.clicked || false}
                        onChange={() =>
                          handleToggleCategoryClicked(category.categoryId)
                        }
                      />
                    </HStack>
                  ))
                )}
              </VStack>
            </Box>
          </Box>

          <Box w="100%" maxW="500px">
            <Box
              p={6}
              borderRadius="16px"
              bg="white"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.200"
            >
              <VStack align="stretch" spacing={3}>
                <Text fontSize="lg" fontWeight="bold">
                  Selected Categories
                </Text>

                {categoriesSelectedList.length === 0 ? (
                  <Text color="gray.500">
                    No selected categories yet.
                  </Text>
                ) : (
                  categoriesSelectedList.map((category) => (
                    <HStack
                      key={category.categoryId}
                      p={4}
                      borderRadius="12px"
                      border="1px solid"
                      borderColor="gray.200"
                    >
                      <Text fontWeight="medium">
                        {category.categoryName}
                      </Text>
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