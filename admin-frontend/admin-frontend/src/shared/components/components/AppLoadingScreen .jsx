// shared/components/AppLoadingScreen.jsx
import { Center, Spinner, VStack, Text } from "@chakra-ui/react";

const AppLoadingScreen = () => {
  return (
    <Center minH="100vh" bg="app.bg">
      <VStack spacing={4}>
        <Spinner
          size="xl"
          thickness="4px"
          speed="0.65s"
          color="brand.500"
        />

        <Text color="app.muted" fontWeight="600">
          Initializing...
        </Text>
      </VStack>
    </Center>
  );
};

export default AppLoadingScreen;