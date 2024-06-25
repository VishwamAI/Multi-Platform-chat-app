import React, { useState } from "react";
import { Box, Text, Input, Button } from "@chakra-ui/react";

const StatusUpdate = () => {
  const [status, setStatus] = useState("");

  const handleStatusUpdate = async () => {
    try {
      const response = await fetch('https://messaging-app-5btcll2g.devinapps.com/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>Update Status</Text>
      <Box borderWidth={1} borderRadius="lg" p={4} mb={4}>
        <Input
          placeholder="Set your status..."
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          mb={4}
        />
        <Button colorScheme="teal" onClick={handleStatusUpdate}>Update</Button>
      </Box>
    </Box>
  );
};

export default StatusUpdate;
