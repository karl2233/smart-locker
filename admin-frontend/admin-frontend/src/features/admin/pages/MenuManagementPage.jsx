import {
  Box,
  Spinner,
  Text,
  VStack,
  HStack,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/react";

import AdminPageContainer from "../components/AdminPageContainer";
import useMenuManagementPage from "../hooks/useMenuManagementPage";
import ConfirmDialog from "../../../shared/components/components/ConfirmDialog";
import MenuItemCard from "../components/MenuItemCard";
import UpdateMenuItemForm from "../components/UpdateMenuItemForm";
import AppLoadingScreen from "../../../shared/components/components/AppLoadingScreen ";

const MenuManagementPage = () => {
  const {
    categories,
    itemSelected,
    loading,

    formData,
    updateFormData,
    itemBeingUpdated,

    handleCategoryClick,
    handleInputChange,
    handleCreateItem,

    handleOpenUpdateItem,
    handleCloseUpdateItem,
    handleUpdateInputChange,
    handleSubmitUpdateItem,

    handleDeleteItem,

    confirmBox,
    cancelRef,
    closeConfirmBox,
    confirmAction,
  } = useMenuManagementPage();

  
    if (loading) {
    return <AppLoadingScreen />;
      }

  return (
    <AdminPageContainer
      title="Menu Management"
      description="Add, update, and remove restaurant menu items from one place."
    >
      <VStack align="start" spacing={5} w="100%">
        <Text variant="cardDescription">
          Selected categories available for menu items.
        </Text>

        <HStack
          align="start"
          spacing={6}
          w="100%"
          flexDirection={{ base: "column", lg: "row" }}
        >
          <Box w={{ base: "100%", lg: "320px" }}>
            {loading && categories.length === 0 ? (
              <Spinner color="brand.500" />
            ) : (
              <VStack
                align="stretch"
                spacing={4}
                maxH="650px"
                overflowY="auto"
                pr={1}
              >
                {categories.map((category) => {
                  const isSelected =
                    itemSelected.categorySelectedId ===
                    category.categorySelectedId;

                  return (
                    <Box
                      key={category.categorySelectedId}
                      bg="card.bg"
                      border="2px solid"
                      borderColor={isSelected ? "brand.500" : "grayBrand.300"}
                      borderRadius="xl"
                      boxShadow="card"
                      p={4}
                      cursor="pointer"
                      transition="0.2s"
                      onClick={() =>
                        handleCategoryClick(category.categorySelectedId)
                      }
                      _hover={{
                        borderColor: "brand.400",
                        transform: "translateY(-2px)",
                      }}
                    >
                      <HStack justify="space-between">
                        <Text color="card.title" fontWeight="700">
                          {category.categoryName}
                        </Text>

                        {isSelected && (
                          <Text color="brand.500" fontSize="sm" fontWeight="700">
                            Selected
                          </Text>
                        )}
                      </HStack>
                    </Box>
                  );
                })}
              </VStack>
            )}
          </Box>

          {itemSelected.isCategorySelected && (
            <HStack
              align="start"
              spacing={6}
              flex="1"
              w="100%"
              flexDirection={{ base: "column", xl: "row" }}
            >
              <Box
                as="form"
                onSubmit={handleCreateItem}
                bg="card.bg"
                border="2px solid"
                borderColor="grayBrand.300"
                borderRadius="xl"
                boxShadow="card"
                p={5}
                flex="1"
                w="100%"
                maxW="600px"
              >
                <VStack align="stretch" spacing={4}>
                  <Text color="card.title" fontWeight="700" fontSize="lg">
                    Create Menu Item
                  </Text>

                  <Input
                    name="itemTitle"
                    placeholder="Item title"
                    value={formData.itemTitle}
                    onChange={handleInputChange}
                    required
                  />

                  <Textarea
                    name="itemDesc"
                    placeholder="Item description"
                    value={formData.itemDesc}
                    onChange={handleInputChange}
                    required
                  />

                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />

                  <Input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    required
                  />

                  <Button type="submit" colorScheme="brand" isLoading={loading}>
                    Create Item
                  </Button>
                </VStack>
              </Box>

              <Box
                bg="card.bg"
                border="2px solid"
                borderColor="grayBrand.300"
                borderRadius="xl"
                boxShadow="card"
                p={5}
                w={{ base: "100%", xl: "420px" }}
                h="650px"
              >
                <VStack align="stretch" spacing={4} h="100%">
                  <HStack justify="space-between">
                    <Text color="card.title" fontWeight="700" fontSize="lg">
                      Items
                    </Text>

                    <Text color="gray.500" fontSize="sm" fontWeight="600">
                      {itemSelected.items.length} item
                      {itemSelected.items.length !== 1 ? "s" : ""}
                    </Text>
                  </HStack>

                  <VStack
                    align="stretch"
                    spacing={4}
                    overflowY="auto"
                    flex="1"
                    pr={1}
                  >
                    {loading && itemSelected.items.length === 0 ? (
                      <Spinner color="brand.500" />
                    ) : itemSelected.items.length === 0 ? (
                      <Text color="gray.500" fontSize="sm">
                        No items found for this category.
                      </Text>
                    ) : (
                      itemSelected.items.map((item) => (
                        <MenuItemCard
                          key={item.itemId}
                          item={item}
                          onUpdateClick={handleOpenUpdateItem}
                          onDeleteClick={handleDeleteItem}
                        />
                      ))
                    )}
                  </VStack>
                </VStack>
              </Box>
            </HStack>
          )}
        </HStack>
      </VStack>

      <UpdateMenuItemForm
        isOpen={!!itemBeingUpdated}
        onClose={handleCloseUpdateItem}
        updateFormData={updateFormData}
        loading={loading}
        onInputChange={handleUpdateInputChange}
        onSubmit={handleSubmitUpdateItem}
      />

      <ConfirmDialog
        confirmBox={confirmBox}
        cancelRef={cancelRef}
        closeConfirmBox={closeConfirmBox}
        confirmAction={confirmAction}
      />
    </AdminPageContainer>
  );
};

export default MenuManagementPage;