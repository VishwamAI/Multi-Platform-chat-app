import React, { useState } from "react";
import { Box, Text, Input, Button } from "@chakra-ui/react";
import axios from "axios";

const Register = ({ backendUrl }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/auth/register`, {
        email,
        password,
      });
      console.log("Registration successful:", response.data);
      // Handle successful registration, e.g., redirect to login page
    } catch (error) {
      console.error("Registration failed:", error.response ? error.response.data : error.message);
      // Handle registration failure, e.g., show error message to user
    }
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>Register</Text>
      <Box borderWidth={1} borderRadius="lg" p={4} mb={4}>
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
        <Input
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          mb={4}
        />
        <Button colorScheme="teal" onClick={handleRegister}>Register</Button>
      </Box>
    </Box>
  );
};

export default Register;
