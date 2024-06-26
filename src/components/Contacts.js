import React, { useState, useEffect } from 'react';
import { Box, Text } from "@chakra-ui/react";
import axios from "axios";

const Contacts = ({ backendUrl }) => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/contacts`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setContacts(response.data.contacts);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, [backendUrl]);

  return (
    <Box p={4}>
      <Text fontSize="xl">Contacts Page</Text>
      {contacts.length > 0 ? (
        contacts.map(contact => (
          <Text key={contact.id}>{contact.name}</Text>
        ))
      ) : (
        <Text>No contacts found.</Text>
      )}
    </Box>
  );
};

export default Contacts;
