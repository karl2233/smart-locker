import { Button, HStack, Image, Text, VStack } from "@chakra-ui/react";

const MenuItemCard = ({ item, onDeleteClick, onUpdateClick }) => {
  const handleDeleteClick = () => {
    onDeleteClick(item);
  };

  const handleUpdateClick = () => {
    onUpdateClick(item);
  };

  return (
    <HStack
      align="start"
      spacing={4}
      border="1px solid"
      borderColor="grayBrand.300"
      borderRadius="xl"
      p={3}
      bg="white"
    >
      <Image
        src={`http://localhost:8080${item.itemImageUrl}`}
        alt={item.itemTitle}
        boxSize="90px"
        objectFit="cover"
        borderRadius="lg"
        border="1px solid"
        borderColor="gray.200"
        fallbackSrc="https://via.placeholder.com/90"
      />

      <VStack align="start" spacing={2} flex="1">
        <HStack justify="space-between" w="100%" align="start">
          <Text color="card.title" fontWeight="700" fontSize="md">
            {item.itemTitle}
          </Text>

          <Text color="brand.500" fontWeight="700" fontSize="sm">
            ${item.price}
          </Text>
        </HStack>

        <Text color="gray.500" fontSize="sm" noOfLines={3}>
          {item.itemDesc}
        </Text>

        <HStack spacing={2} pt={2}>
          <Button size="sm" colorScheme="blue" onClick={handleUpdateClick}>
            Update
          </Button>

          <Button size="sm" colorScheme="red" onClick={handleDeleteClick}>
            Delete
          </Button>
        </HStack>
      </VStack>
    </HStack>
  );
};

export default MenuItemCard;