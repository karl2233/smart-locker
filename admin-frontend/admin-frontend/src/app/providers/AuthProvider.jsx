import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthService } from "../../services/api/AuthService";
import { cookieManager } from "../../shared/utils/cookie";
import { getTokenExpiration, isTokenValid } from "../../shared/utils/token";
import AppLoadingScreen from "../../shared/components/components/AppLoadingScreen "; 

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = cookieManager.get("authToken");

        if (!token) {
          return;
        }

        if (!isTokenValid(token)) {
          return;
        }

        setIsAuthenticated(true);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

    const signOut = () => {
    cookieManager.remove("authToken");

    setIsAuthenticated(false);
    setUser(null);
  };

    const signin = useCallback(async (email, password) => {
      setLoading(true);
      setError("");

      try {
        const response = await AuthService.signin({ email, password });

        const accessToken = response.data.token;
        const responseUser = response.data.user ?? null;

        const expirationDate = getTokenExpiration(accessToken);

        cookieManager.set("authToken", accessToken, expirationDate);

        setIsAuthenticated(true);
        setUser(responseUser);

        return response;
      }
      catch (err) {
        const errorMessage =
          err.response?.data?.message || "Signin failed";

        setError(errorMessage);

        return null;
      }
    finally {
            setLoading(false);
          }
    }, []);

  const signup = useCallback(async (payload) => {
    setLoading(true);
    setError("");

    try {
      const response = await AuthService.signup(payload);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Signup failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      loading,
      error,
      signin,
      signup,
      clearError,
       signOut,
    }),
    [isAuthenticated, user, loading, error, signin, signup, clearError]
  );

  if (loading) {
    return <AppLoadingScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};