import React, { useState, useEffect } from "react";
import { Box, Text, Input, Button, Flex, Select } from "@chakra-ui/react";
import Picker from 'emoji-picker-react';
import GifUploader from './GifUploader';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [username, setUsername] = useState("testuser"); // Default username for testing
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch message history between the logged-in user and the selected receiver
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/messages/history/${username}/${receiver}`);
        const data = await response.json();
        setMessages(data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (receiver) {
      fetchMessages();
    }
  }, [receiver, username]);

  useEffect(() => {
    // Fetch the list of users
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users`);
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSendMessage = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: username,
          receiver,
          message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      console.log(data.message);

      // Update the message list with the new message
      setMessages([...messages, { sender: username, receiver, message, timestamp: new Date().toISOString() }]);
      setMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const onEmojiClick = (event, emojiObject) => {
    setMessage(message + emojiObject.emoji);
  };

  const onGifUpload = (gifData) => {
    setMessage(message + gifData);
  };

  const handleVideoCall = () => {
    navigate('/videocall');
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>Chat with {receiver}</Text>
      <Select placeholder="Select user to chat with" onChange={(e) => setReceiver(e.target.value)} mb={4}>
        {users.map((user, index) => (
          <option key={index} value={user.username}>{user.username}</option>
        ))}
      </Select>
      <Box borderWidth={1} borderRadius="lg" p={4} mb={4} height="400px" overflowY="scroll">
        {messages.map((msg, index) => (
          <Box key={index} mb={2} textAlign="left">
            <Text fontWeight="bold">{msg.sender}</Text>
            <Text>{msg.message}</Text>
            <Text fontSize="xs" color="gray.500">{new Date(msg.timestamp).toLocaleString()}</Text>
          </Box>
        ))}
      </Box>
      <Flex>
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          mr={2}
        />
        <Button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</Button>
        {showEmojiPicker && <Picker onEmojiClick={onEmojiClick} />}
        <GifUploader onGifUpload={onGifUpload} />
        <Button colorScheme="teal" onClick={handleSendMessage}>Send</Button>
      </Flex>
      <Button colorScheme="blue" mt={4} onClick={handleVideoCall}>Start Video Call</Button>
    </Box>
  );
};

export default Chat;
