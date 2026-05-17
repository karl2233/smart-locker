import { useAuth } from "../../../shared/hooks/useAuth";
import { useEffect } from "react";
import { toast } from "sonner";

export const useAuthManagement = () => {
  const {
    isAuthenticated,
    user,
    loading,
    error,
    signin,
    signup,
    clearError,
  } = useAuth();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSignin = async (email, password) => {
    return signin(email, password);
  };

  const handleSignup = async (payload) => {
    return signup(payload);
  };

  return {
    isAuthenticated,
    user,
    loading,
    error,
    handleSignin,
    handleSignup,
    clearError,
  };
};