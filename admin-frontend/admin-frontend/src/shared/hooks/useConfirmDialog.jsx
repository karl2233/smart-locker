import { useRef, useState } from "react";

const useConfirmDialog = () => {
  const [confirmBox, setConfirmBox] = useState({
    isOpen: false,
    title: "",
    message: "",
    action: null,
  });

  const cancelRef = useRef();

  const openConfirmBox = ({ title, message, action }) => {
    setConfirmBox({
      isOpen: true,
      title,
      message,
      action,
    });
  };

  const closeConfirmBox = () => {
    setConfirmBox({
      isOpen: false,
      title: "",
      message: "",
      action: null,
    });
  };

  const confirmAction = () => {
    if (confirmBox.action) {
      confirmBox.action();
    }

    closeConfirmBox();
  };

  return {
    confirmBox,
    cancelRef,
    openConfirmBox,
    closeConfirmBox,
    confirmAction,
  };
};

export default useConfirmDialog;