import React, { useState, useEffect } from 'react';
import { Box, Text } from "@chakra-ui/react";
import axios from "axios";

const Groups = ({ backendUrl }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${backendUrl}/groups`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setGroups(response.data.groups);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, [backendUrl]);

  return (
    <Box p={4}>
      <Text fontSize="xl">Groups Page</Text>
      {groups.length > 0 ? (
        groups.map(group => (
          <Text key={group.id}>{group.name}</Text>
        ))
      ) : (
        <Text>No groups found.</Text>
      )}
    </Box>
  );
};

export default Groups;
