import React, { useState, useEffect } from "react";
import { Box, Text, Input, Button, Flex } from "@chakra-ui/react";
import Picker from 'emoji-picker-react';
import { Grid } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';

const gf = new GiphyFetch('YOUR_GIPHY_API_KEY');

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);

  useEffect(() => {
    // Fetch message history between the logged-in user and the selected receiver
    const fetchMessages = async () => {
      try {
        const response = await fetch(`https://messaging-app-5btcll2g.devinapps.com/messages/history/${localStorage.getItem('username')}/${receiver}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setMessages(data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (receiver) {
      fetchMessages();
    }
  }, [receiver]);

  const handleSendMessage = async () => {
    try {
      const response = await fetch('https://messaging-app-5btcll2g.devinapps.com/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          sender: localStorage.getItem('username'),
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
      setMessages([...messages, { sender: localStorage.getItem('username'), receiver, message, timestamp: new Date().toISOString() }]);
      setMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const onEmojiClick = (event, emojiObject) => {
    setMessage(message + emojiObject.emoji);
  };

  const onGifClick = (gif) => {
    setMessage(message + gif.url);
    setShowGifPicker(false);
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>Chat with {receiver}</Text>
      <Input
        placeholder="Enter receiver's username..."
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
        mb={4}
      />
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
        <Button onClick={() => setShowGifPicker(!showGifPicker)}>GIF</Button>
        {showGifPicker && <Grid width={300} columns={3} fetchGifs={gf.trending} onGifClick={onGifClick} />}
        <Button colorScheme="teal" onClick={handleSendMessage}>Send</Button>
      </Flex>
    </Box>
  );
};

export default Chat;
