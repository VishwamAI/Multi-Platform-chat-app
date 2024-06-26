import React from "react";
import {
  ThemeProvider,
  CSSReset,
  Box,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { customTheme } from "./theme";
import { FaComments, FaUserFriends, FaUsers, FaCog, FaUpload } from "react-icons/fa";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Register from "./components/Register";
import StatusUpdate from "./components/StatusUpdate";
import UserStatus from "./components/UserStatus";
import VideoCall from "./components/VideoCall";
import Contacts from "./components/Contacts";
import Groups from "./components/Groups";
import Settings from "./components/Settings";
import VideoUpload from "./components/VideoUpload";

function App() {
  const navigate = useNavigate();

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
                onClick={() => navigate("/chat")}
              />
            </Box>
            <Box p={4}>
              <IconButton
                icon={<FaUserFriends />}
                aria-label="Contacts"
                variant="ghost"
                colorScheme="whiteAlpha"
                isRound
                onClick={() => navigate("/contacts")}
              />
            </Box>
            <Box p={4}>
              <IconButton
                icon={<FaUsers />}
                aria-label="Groups"
                variant="ghost"
                colorScheme="whiteAlpha"
                isRound
                onClick={() => navigate("/groups")}
              />
            </Box>
            <Box p={4}>
              <IconButton
                icon={<FaCog />}
                aria-label="Settings"
                variant="ghost"
                colorScheme="whiteAlpha"
                isRound
                onClick={() => navigate("/settings")}
              />
            </Box>
            <Box p={4}>
              <IconButton
                icon={<FaUpload />}
                aria-label="Upload Video"
                variant="ghost"
                colorScheme="whiteAlpha"
                isRound
                onClick={() => navigate("/upload-video")}
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
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/upload-video" element={<VideoUpload />} />
              <Route path="/" element={<Login />} />
            </Routes>
          </Box>
        </Flex>
      </Router>
    </ThemeProvider>
  );
}

export default App;
