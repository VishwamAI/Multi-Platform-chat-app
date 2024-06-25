import React from "react";
import { Box, Flex, Avatar, Text } from "@chakra-ui/react";

const ChatList = () => {
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

  return (
    <Box>
      {chatItems.map((chat) => (
        <Flex key={chat.id} p={4} alignItems="center" borderBottom="1px solid gray">
          <Avatar src={chat.avatar} size="md" />
          <Box ml={4}>
            <Text fontWeight="bold">{chat.name}</Text>
            <Text>{chat.message}</Text>
            <Text fontSize="sm" color="gray.500">
              {chat.timestamp}
            </Text>
          </Box>
        </Flex>
      ))}
    </Box>
  );
};

export default ChatList;
