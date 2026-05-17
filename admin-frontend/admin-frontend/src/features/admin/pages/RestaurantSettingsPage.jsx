import { Text } from "@chakra-ui/react";
import AdminPageContainer from "../components/AdminPageContainer";

const RestaurantSettingsPage = () => {
  return (
    <AdminPageContainer
      title="Restaurant Profile / Settings"
      description="Manage restaurant information, profile details, and system settings."
    >
      <Text variant="cardDescription">
        This page will contain restaurant name, logo, contact details, opening hours, and other general settings.
      </Text>
    </AdminPageContainer>
  );
};

export default RestaurantSettingsPage;