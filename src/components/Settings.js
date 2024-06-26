import React, { useState, useEffect } from 'react';
import { Box, Text, Input, Button } from "@chakra-ui/react";
import axios from "axios";

const Settings = ({ backendUrl }) => {
  const [preferences, setPreferences] = useState({
    theme: '',
    notifications: false,
  });

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get(`${backendUrl}/settings`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setPreferences(response.data.preferences);
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };

    fetchPreferences();
  }, [backendUrl]);

  const handleSave = async () => {
    try {
      await axios.post(`${backendUrl}/settings`, preferences, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Preferences saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <Box p={4}>
      <Text fontSize="xl">Settings Page</Text>
      <Text>This is the Settings page. Here you can adjust your preferences.</Text>
      <Box mt={4}>
        <Text>Theme:</Text>
        <Input
          value={preferences.theme}
          onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
        />
        <Text mt={4}>Notifications:</Text>
        <Input
          type="checkbox"
          checked={preferences.notifications}
          onChange={(e) => setPreferences({ ...preferences, notifications: e.target.checked })}
        />
        <Button mt={4} onClick={handleSave}>Save</Button>
      </Box>
    </Box>
  );
};

export default Settings;
