import { Flex, Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminDashboardLayout = () => {
  return (
    <Flex minH="100vh" bg="app.bg">
      <AdminSidebar />

      <Box flex="1" p={6}>
        <Outlet />
      </Box>
    </Flex>
  );
};

export default AdminDashboardLayout;