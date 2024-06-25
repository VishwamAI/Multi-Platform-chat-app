import React, { useState } from "react";
import { Box, Text, Input, Button } from "@chakra-ui/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Handle login logic here
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>Login</Text>
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
        <Button colorScheme="teal" onClick={handleLogin}>Login</Button>
      </Box>
    </Box>
  );
};

export default Login;
