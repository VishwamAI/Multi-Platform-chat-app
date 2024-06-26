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

// Determine the backend URL based on the hostname
const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://messaging-app-wzfezox9.devinapps.com';

function App() {
  const navigate = useNavigate();

  console.log("App component mounted");
  console.log("backendUrl:", backendUrl);

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
              <Route path="/chat" element={<Chat backendUrl={backendUrl} />} />
              <Route path="/login" element={<Login backendUrl={backendUrl} />} />
              <Route path="/register" element={<Register backendUrl={backendUrl} />} />
              <Route path="/status" element={<StatusUpdate backendUrl={backendUrl} />} />
              <Route path="/user-status/:username" element={<UserStatus backendUrl={backendUrl} />} />
              <Route path="/videocall" element={<VideoCall backendUrl={backendUrl} />} />
              <Route path="/contacts" element={<Contacts backendUrl={backendUrl} />} />
              <Route path="/groups" element={<Groups backendUrl={backendUrl} />} />
              <Route path="/settings" element={<Settings backendUrl={backendUrl} />} />
              <Route path="/upload-video" element={<VideoUpload backendUrl={backendUrl} />} />
              <Route path="/" element={<Login backendUrl={backendUrl} />} />
            </Routes>
          </Box>
        </Flex>
      </Router>
    </ThemeProvider>
  );
}

export default App;
