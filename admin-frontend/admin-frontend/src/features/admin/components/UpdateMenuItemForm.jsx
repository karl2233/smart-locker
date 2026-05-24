import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  Input,
  Textarea,
} from "@chakra-ui/react";

const UpdateMenuItemForm = ({
  isOpen,
  onClose,
  updateFormData,
  loading,
  onInputChange,
  onSubmit,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(3px)" />

      <ModalContent borderRadius="2xl">
        <ModalHeader>Update Menu Item</ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4}>
            <Input
              name="itemTitle"
              placeholder="Item title"
              value={updateFormData.itemTitle}
              onChange={onInputChange}
              required
            />

            <Textarea
              name="itemDesc"
              placeholder="Item description"
              value={updateFormData.itemDesc}
              onChange={onInputChange}
              required
            />

            <Input
              name="price"
              type="number"
              step="0.01"
              placeholder="Price"
              value={updateFormData.price}
              onChange={onInputChange}
              required
            />

            <Input
              name="image"
              type="file"
              accept="image/*"
              onChange={onInputChange}
            />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>

          <Button
            colorScheme="brand"
            onClick={onSubmit}
            isLoading={loading}
          >
            Confirm Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateMenuItemForm;