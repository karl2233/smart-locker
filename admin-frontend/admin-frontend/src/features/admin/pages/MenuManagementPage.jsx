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

const MenuManagementPage = () => {
  const {
    categories,
    itemSelected,
    loading,
    formData,
    handleCategoryClick,
    handleInputChange,
    handleCreateItem,
  } = useMenuManagementPage();

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
          flexDirection={{
            base: "column",
            lg: "row",
          }}
        >
          {/* Categories List */}
          <Box
            w={{
              base: "100%",
              lg: "350px",
            }}
          >
            {loading && categories.length === 0 ? (
              <Spinner color="brand.500" />
            ) : (
              <VStack
                align="start"
                spacing={4}
                w="100%"
                maxH="500px"
                overflowY="auto"
                pr={1}
                sx={{
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#CBD5E1",
                    borderRadius: "999px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#94A3B8",
                  },
                  scrollbarWidth: "thin",
                  scrollbarColor: "#CBD5E1 transparent",
                }}
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
                      w="100%"
                      cursor="pointer"
                      transition="all 0.2s ease"
                      onClick={() =>
                        handleCategoryClick(category.categorySelectedId)
                      }
                      _hover={{
                        borderColor: "brand.400",
                        transform: "translateY(-2px)",
                      }}
                    >
                      <HStack justify="space-between">
                        <Text
                          color="card.title"
                          fontWeight="700"
                          fontSize="md"
                        >
                          {category.categoryName}
                        </Text>

                        {isSelected && (
                          <Text
                            color="brand.500"
                            fontSize="sm"
                            fontWeight="700"
                          >
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

          {/* Form + Items */}
          {itemSelected.isCategorySelected && (
            <HStack
              align="start"
              spacing={6}
              flex="1"
              w="100%"
              flexDirection={{
                base: "column",
                xl: "row",
              }}
            >
              {/* Create Item Form */}
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

{/* Items List */}
<Box
  bg="card.bg"
  border="2px solid"
  borderColor="grayBrand.300"
  borderRadius="xl"
  boxShadow="card"
  p={5}
  w={{
    base: "100%",
    xl: "380px",
  }}
  h="500px"
>
  <VStack
    align="stretch"
    spacing={4}
    h="100%"
  >
    <HStack justify="space-between">
      <Text
        color="card.title"
        fontWeight="700"
        fontSize="lg"
      >
        Items
      </Text>

      <Text
        color="gray.500"
        fontSize="sm"
        fontWeight="600"
      >
        {itemSelected.items.length} item
        {itemSelected.items.length !== 1 ? "s" : ""}
      </Text>
    </HStack>

    {/* Scrollable Items */}
    <VStack
      align="stretch"
      spacing={3}
      flex="1"
      overflowY="auto"
      pr={1}
      sx={{
        "&::-webkit-scrollbar": {
          width: "8px",
        },

        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },

        "&::-webkit-scrollbar-thumb": {
          background: "#CBD5E1",
          borderRadius: "999px",
        },

        "&::-webkit-scrollbar-thumb:hover": {
          background: "#94A3B8",
        },

        scrollbarWidth: "thin",
        scrollbarColor: "#CBD5E1 transparent",
      }}
    >
      {loading && itemSelected.items.length === 0 ? (
        <Spinner color="brand.500" />
      ) : itemSelected.items.length === 0 ? (
        <Text
          color="gray.500"
          fontSize="sm"
        >
          No items found for this category.
        </Text>
      ) : (
        itemSelected.items.map((item) => (
          <HStack
            key={item.itemId}
            justify="space-between"
            align="center"
            border="1px solid"
            borderColor="grayBrand.300"
            borderRadius="lg"
            p={3}
            bg="white"
            w="100%"
          >
            <VStack
              align="start"
              spacing={1}
              flex="1"
            >
              <Text
                color="card.title"
                fontWeight="700"
                fontSize="sm"
              >
                {item.itemTitle}
              </Text>

              <Text
                color="gray.500"
                fontSize="xs"
                noOfLines={1}
              >
                {item.itemDesc}
              </Text>
            </VStack>

            <Text
              color="brand.500"
              fontWeight="700"
              fontSize="sm"
            >
              ${item.price}
            </Text>
          </HStack>
        ))
      )}
    </VStack>
  </VStack>
</Box>
            </HStack>
          )}
        </HStack>
      </VStack>
    </AdminPageContainer>
  );
};

export default MenuManagementPage;