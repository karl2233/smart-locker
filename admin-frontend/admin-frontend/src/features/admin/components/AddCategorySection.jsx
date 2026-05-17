import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

const AddCategorySection = ({
  categoryName,
  error,
  isSubmitting,
  handleCategoryNameChange,
  handleAddCategory,
}) => {
  return (
    <Box
      w="100%"
      maxW="720px"
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="2xl"
      boxShadow="sm"
      p={6}
    >
      <VStack spacing={5} align="stretch">
        <Box>
          <Text fontSize="2xl" fontWeight="700" color="gray.800">
            Add New Category
          </Text>
          <Text fontSize="sm" color="gray.500" mt={1}>
            Create a category for your restaurant menu in a clean and organized way.
          </Text>
        </Box>

        <Box as="form" onSubmit={handleAddCategory}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                Category Name
              </FormLabel>
              <Input
                value={categoryName}
                onChange={handleCategoryNameChange}
                placeholder="Enter category name"
                size="lg"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="xl"
                focusBorderColor="blue.500"
              />
            </FormControl>

            {error && (
              <Text fontSize="sm" color="red.500">
                {error}
              </Text>
            )}

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              borderRadius="xl"
              alignSelf="flex-start"
              isLoading={isSubmitting}
              loadingText="Adding"
            >
              Add Category
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default AddCategorySection;