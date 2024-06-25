import React, { useState } from "react";
import { Box, Text, Input, Button } from "@chakra-ui/react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      console.log("Login successful:", response.data);
      // Handle successful login, e.g., store token, redirect to chat page
    } catch (error) {
      console.error("Login failed:", error.response ? error.response.data : error.message);
      // Handle login failure, e.g., show error message to user
    }
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>Login</Text>
      <Box borderWidth={1} borderRadius="lg" p={4} mb={4}>
        <form onSubmit={handleLogin}>
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            mb={4}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            mb={4}
          />
          <Button colorScheme="teal" type="submit">Login</Button>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
