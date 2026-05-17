import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./AuthProvider";
import theme from "../../shared/theme/theme";

const AppProviders = ({ children }) => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>{children}</AuthProvider>
    </ChakraProvider>
  );
};

export default AppProviders;