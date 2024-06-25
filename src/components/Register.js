import React, { useState } from "react";
import { Box, Text, Input, Button } from "@chakra-ui/react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    // Handle registration logic here
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
