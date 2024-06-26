import React, { useState, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

const UserStatus = ({ backendUrl }) => {
  const { username } = useParams();
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${backendUrl}/status/${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch status');
        }
        const data = await response.json();
        setStatus(data.status);
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    fetchStatus();
  }, [username, backendUrl]);

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" mb={4}>
      <Text fontSize="xl">{username}</Text>
      <Text fontSize="md" color="gray.500">{status}</Text>
    </Box>
  );
};

export default UserStatus;
