import { Box, VStack, Text, Link as ChakraLink, Divider } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const navItems = [
  {
    label: "Menu Management",
    path: "/admin/menu-management",
  },
  {
    label: "Category Management",
    path: "/admin/category-management",
  },
  {
    label: "Staff Accounts for Tablet Use",
    path: "/admin/staff-accounts",
  },
  {
    label: "Restaurant Profile / Settings",
    path: "/admin/restaurant-settings",
  },
];

const AdminSidebar = () => {
  return (
    <Box
      w="280px"
      minH="100vh"
      bg="sidebar.bg"
      borderRight="1px solid"
      borderColor="sidebar.border"
      boxShadow="sidebar"
      px={4}
      py={6}
    >
      <Text fontSize="2xl" fontWeight="700" color="sidebar.title" mb={2}>
        Restaurant Admin
      </Text>

      <Text variant="sidebarSubtitle" mb={6}>
        Dashboard Navigation
      </Text>

      <Divider mb={6} borderColor="sidebar.border" />

      <VStack align="stretch" spacing={2}>
        {navItems.map((item) => (
          <ChakraLink
            key={item.path}
            as={NavLink}
            to={item.path}
            variant="sidebarItem"
          >
            {item.label}
          </ChakraLink>
        ))}
      </VStack>
    </Box>
  );
};

export default AdminSidebar;