import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

const ConfirmDialog = ({
  confirmBox,
  cancelRef,
  closeConfirmBox,
  confirmAction,
}) => {
  return (
    <AlertDialog
      isOpen={confirmBox.isOpen}
      leastDestructiveRef={cancelRef}
      onClose={closeConfirmBox}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>{confirmBox.title}</AlertDialogHeader>

          <AlertDialogBody>{confirmBox.message}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={closeConfirmBox}>
              Cancel
            </Button>

            <Button colorScheme="blue" ml={3} onClick={confirmAction}>
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ConfirmDialog;