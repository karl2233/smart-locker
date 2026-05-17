import { Text } from "@chakra-ui/react";
import AdminPageContainer from "../components/AdminPageContainer";

const StaffAccountsPage = () => {
  return (
    <AdminPageContainer
      title="Staff Accounts for Tablet Use"
      description="Create and manage staff accounts used by employees on the restaurant tablet."
    >
      <Text variant="cardDescription">
        This page will contain staff account creation, account list, edit actions, password reset, and activation or deactivation.
      </Text>
    </AdminPageContainer>
  );
};

export default StaffAccountsPage;