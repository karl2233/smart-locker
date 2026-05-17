import { Box, Heading, Text, VStack } from "@chakra-ui/react";

const AdminPageContainer = ({ title, description, children }) => {
  return (
    <Box variant="adminCard" p={6}>
      <VStack align="stretch" spacing={5}>
        <Box>
          <Heading size="lg" mb={2}>
            {title}
          </Heading>

          {description && (
            <Text variant="pageDescription">
              {description}
            </Text>
          )}
        </Box>

        <Box>{children}</Box>
      </VStack>
    </Box>
  );
};

export default AdminPageContainer;