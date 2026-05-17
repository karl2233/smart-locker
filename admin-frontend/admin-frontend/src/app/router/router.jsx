import { createBrowserRouter, Navigate } from "react-router-dom";
import SigninPage from "../../features/auth/pages/SigninPage";
import SignupPage from "../../features/auth/pages/SignupPage";
import AdminDashboardLayout from "../../features/admin/pages/AdminDashboardLayout";
import MenuManagementPage from "../../features/admin/pages/MenuManagementPage";
import CategoryManagementPage from "../../features/admin/pages/CategoryManagementPage";
import StaffAccountsPage from "../../features/admin/pages/StaffAccountsPage";
import RestaurantSettingsPage from "../../features/admin/pages/RestaurantSettingsPage";
import ProtectedRoute from "../../guards/ProtectedRoute";
import PublicRoute from "../../guards/PublicRoute";

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/signin",
        element: <SigninPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminDashboardLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="menu-management" replace />,
          },
          {
            path: "menu-management",
            element: <MenuManagementPage />,
          },
          {
            path: "category-management",
            element: <CategoryManagementPage />,
          },
          {
            path: "staff-accounts",
            element: <StaffAccountsPage />,
          },
          {
            path: "restaurant-settings",
            element: <RestaurantSettingsPage />,
          },
        ],
      },
    ],
  },
{
  path: "*",
  element: <Navigate to="/admin/category-management" replace />,
},
]);

export default router;