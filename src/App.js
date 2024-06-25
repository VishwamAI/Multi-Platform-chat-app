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
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
