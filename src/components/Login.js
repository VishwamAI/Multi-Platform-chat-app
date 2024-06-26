import React, { useState } from "react";
import { Box, Text, Input, Button } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ backendUrl }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/auth/login`, {
        username,
        password,
      });
      console.log("Login successful:", response.data);
      // Store the JWT token in localStorage
      localStorage.setItem('token', response.data.token);
      // Redirect to chat page or handle successful login
      navigate('/chat');
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
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <Button colorScheme="teal" onClick={() => navigate('/chat')}>Go to Chat</Button>
      </Box>
    </Box>
  );
};

export default Login;
