import React, { useState, useRef, useEffect } from "react";
import { Box, Text, Alert, AlertIcon } from "@chakra-ui/react";
import { DyteProvider, useDyteClient, useDyteMeeting } from "@dytesdk/react-web-core";
import { DyteMeeting } from "@dytesdk/react-ui-kit";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert status="error" mt={4}>
          <AlertIcon />
          Something went wrong: {this.state.error.message}
        </Alert>
      );
    }

    return this.props.children;
  }
}

const VideoCall = () => {
  const [meeting, setMeeting] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [cameraPermission, setCameraPermission] = useState("prompt");
  const [microphonePermission, setMicrophonePermission] = useState("prompt");

  const userVideo = useRef();

  useEffect(() => {
    console.log("Setting up Dyte client");

    navigator.permissions.query({ name: "camera" }).then((permissionStatus) => {
      setCameraPermission(permissionStatus.state);
      permissionStatus.onchange = () => {
        setCameraPermission(permissionStatus.state);
      };
    });

    navigator.permissions.query({ name: "microphone" }).then((permissionStatus) => {
      setMicrophonePermission(permissionStatus.state);
      permissionStatus.onchange = () => {
        setMicrophonePermission(permissionStatus.state);
      };
    });

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const hasVideoInput = devices.some((device) => device.kind === "videoinput");
      const hasAudioInput = devices.some((device) => device.kind === "audioinput");

      if (hasVideoInput && hasAudioInput) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((stream) => {
            if (userVideo.current) {
              userVideo.current.srcObject = stream;
            }
          })
          .catch((error) => {
            console.error("Error accessing media devices:", error);
            setErrorMessage("Could not access your camera and microphone. Please check your device settings and permissions.");
          });
      } else {
        setErrorMessage("No camera or microphone found. Please connect your devices and try again.");
      }
    });

    // Initialize Dyte client
    const initDyteClient = async () => {
      console.log("Initializing Dyte client...");
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/dyte/init`);
        console.log("Fetch response:", response);
        const data = await response.json();
        console.log("Meeting data:", data);
        setMeeting(data.meeting);
      } catch (error) {
        console.error("Error initializing Dyte client:", error);
        setErrorMessage("Could not initialize Dyte client. Please try again later.");
      }
    };

    initDyteClient();
  }, []);

  const dyteClient = useDyteClient();
  const dyteMeeting = useDyteMeeting(dyteClient, meeting);

  return (
    <ErrorBoundary>
      <DyteProvider value={dyteClient}>
        <Box p={4}>
          <Text fontSize="2xl" mb={4} textAlign="center">Video Call</Text>
          <Box display="flex" justifyContent="space-around" mb={4}>
            <video playsInline muted ref={userVideo} autoPlay style={{ width: "300px", borderRadius: "10px", border: "2px solid #4A90E2" }} />
            {dyteMeeting && <DyteMeeting meeting={dyteMeeting} style={{ width: "300px", borderRadius: "10px", border: "2px solid #4A90E2" }} />}
          </Box>
          {errorMessage && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              {errorMessage}
            </Alert>
          )}
          <Box mt={4} textAlign="center">
            <Text>Camera Permission: <b>{cameraPermission}</b></Text>
            <Text>Microphone Permission: <b>{microphonePermission}</b></Text>
            {cameraPermission === "prompt" && microphonePermission === "prompt" && (
              <Text color="red.500" mt={2}>Please allow camera and microphone access to use the video call feature.</Text>
            )}
          </Box>
        </Box>
      </DyteProvider>
    </ErrorBoundary>
  );
};

export default VideoCall;
