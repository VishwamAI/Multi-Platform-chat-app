import React, { useState } from "react";
import { Box, Flex, Avatar, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from "@chakra-ui/react";

const ChatList = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const chatItems = [
    {
      id: 1,
      name: "John Doe",
      message: "Hey, how are you?",
      timestamp: "2:30 PM",
      avatar: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Jane Smith",
      message: "Let's catch up later!",
      timestamp: "1:15 PM",
      avatar: "https://via.placeholder.com/150",
    },
    // Add more chat items as needed
  ];

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  return (
    <Box>
      {chatItems.map((chat) => (
        <Flex key={chat.id} p={4} alignItems="center" borderBottom="1px solid gray">
          <Avatar src={chat.avatar} size="md" />
          <Box ml={4}>
            <Text fontWeight="bold" onClick={() => handleUserClick(chat)} cursor="pointer">
              {chat.name}
            </Text>
            <Text>{chat.message}</Text>
            <Text fontSize="sm" color="gray.500">
              {chat.timestamp}
            </Text>
          </Box>
        </Flex>
      ))}

      {selectedUser && (
        <Modal isOpen={true} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedUser.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text><strong>Message:</strong> {selectedUser.message}</Text>
              <Text><strong>Timestamp:</strong> {selectedUser.timestamp}</Text>
              {/* Add more user information as needed */}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={closeModal}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default ChatList;
