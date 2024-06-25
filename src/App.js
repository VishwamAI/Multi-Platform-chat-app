import React from "react";
import {
  ThemeProvider,
  CSSReset,
} from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { customTheme } from "./theme";
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
        <Routes>
          <Route path="/chat" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/status" element={<StatusUpdate />} />
          <Route path="/user-status/:username" element={<UserStatus />} />
          <Route path="/videocall" element={<VideoCall />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
