import React, { useState } from "react";
import {
  Flex,
  Box,
  Card,
  CardBody,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuthManagement } from "../hooks/useAuthManagement";

const SigninPage = () => {
  const navigate = useNavigate();
  const { handleSignin, loading } = useAuthManagement();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await handleSignin(form.email, form.password);
      navigate("/admin");
    } catch (error) {
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="surface.50">
      <Box w="full" maxW="420px">
        <Card>
          <CardBody p={8}>
            <Stack spacing={5}>
              <Box textAlign="center">
                <Heading size="lg">Sign in</Heading>
                <Text color="gray.500">Access your account</Text>
              </Box>

              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <Button type="submit" isLoading={loading}>
                    Sign in
                  </Button>
                </Stack>
              </form>
            </Stack>
          </CardBody>
        </Card>
      </Box>
    </Flex>
  );
};

export default SigninPage;