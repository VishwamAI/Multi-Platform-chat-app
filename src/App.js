import React from "react";
import {
  ThemeProvider,
  CSSReset,
  Box,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { customTheme } from "./theme";
import { FaComments, FaUserFriends, FaUsers, FaCog } from "react-icons/fa";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Register from "./components/Register";
import StatusUpdate from "./components/StatusUpdate";
import UserStatus from "./components/UserStatus";
import VideoCall from "./components/VideoCall";

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <CSSReset />
      <Router>
        <Flex height="100vh">
          <Box width="60px" bg="gray.800" color="white">
            {/* Sidebar with navigation icons */}
            <Box p={4}>
              <IconButton
                icon={<FaComments />}
                aria-label="Chats"
                variant="ghost"
                colorScheme="whiteAlpha"
                isRound
              />
            </Box>
            <Box p={4}>
              <IconButton
                icon={<FaUserFriends />}
                aria-label="Contacts"
                variant="ghost"
                colorScheme="whiteAlpha"
                isRound
              />
            </Box>
            <Box p={4}>
              <IconButton
                icon={<FaUsers />}
                aria-label="Groups"
                variant="ghost"
                colorScheme="whiteAlpha"
                isRound
              />
            </Box>
            <Box p={4}>
              <IconButton
                icon={<FaCog />}
                aria-label="Settings"
                variant="ghost"
                colorScheme="whiteAlpha"
                isRound
              />
            </Box>
          </Box>
          <Box width="300px" bg="gray.700" color="white">
            {/* Chat list */}
            <Box p={4}>Chat List</Box>
          </Box>
          <Box flex="1" bg="gray.900" color="white">
            {/* Main chat area */}
            <Routes>
              <Route path="/chat" element={<Chat />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/status" element={<StatusUpdate />} />
              <Route path="/user-status/:username" element={<UserStatus />} />
              <Route path="/videocall" element={<VideoCall />} />
              <Route path="/" element={<Login />} />
            </Routes>
          </Box>
        </Flex>
      </Router>
    </ThemeProvider>
  );
}

export default App;
