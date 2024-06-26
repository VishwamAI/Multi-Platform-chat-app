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
  console.log("VideoCall component is being called");
  console.log("Rendering VideoCall component");
  const [meeting, setMeeting] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [cameraPermission, setCameraPermission] = useState("prompt");
  const [microphonePermission, setMicrophonePermission] = useState("prompt");

  const userVideo = useRef();

  useEffect(() => {
    console.log("Executing useEffect in VideoCall component");
    console.log("Setting up Dyte client");
    console.log("REACT_APP_API_URL:", process.env.REACT_APP_API_URL);

    navigator.permissions.query({ name: "camera" }).then((permissionStatus) => {
      console.log("Camera permission status:", permissionStatus.state);
      setCameraPermission(permissionStatus.state);
      permissionStatus.onchange = () => {
        console.log("Camera permission status changed:", permissionStatus.state);
        setCameraPermission(permissionStatus.state);
      };
    }).catch((error) => {
      console.error("Error querying camera permissions:", error);
      setErrorMessage("Could not query camera permissions. Please check your browser settings.");
    });

    navigator.permissions.query({ name: "microphone" }).then((permissionStatus) => {
      console.log("Microphone permission status:", permissionStatus.state);
      setMicrophonePermission(permissionStatus.state);
      permissionStatus.onchange = () => {
        console.log("Microphone permission status changed:", permissionStatus.state);
        setMicrophonePermission(permissionStatus.state);
      };
    }).catch((error) => {
      console.error("Error querying microphone permissions:", error);
      setErrorMessage("Could not query microphone permissions. Please check your browser settings.");
    });

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const hasVideoInput = devices.some((device) => device.kind === "videoinput");
      const hasAudioInput = devices.some((device) => device.kind === "audioinput");
      console.log("Has video input:", hasVideoInput);
      console.log("Has audio input:", hasAudioInput);

      if (hasVideoInput && hasAudioInput) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((stream) => {
            console.log("Media stream obtained");
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
    }).catch((error) => {
      console.error("Error enumerating media devices:", error);
      setErrorMessage("Could not enumerate media devices. Please check your device settings.");
    });

    // Initialize Dyte client
    const initDyteClient = async () => {
      console.log("Initializing Dyte client...");
      try {
        const requestUrl = `${process.env.REACT_APP_API_URL}/dyte/init`;
        console.log("Fetch request URL:", requestUrl);
        const response = await fetch(requestUrl);
        console.log("Fetch response status:", response.status);
        const responseBody = await response.text();
        console.log("Fetch response body:", responseBody);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = JSON.parse(responseBody);
        console.log("Meeting data:", data);
        if (!data.meeting) {
          throw new Error("No meeting data found in response");
        }
        setMeeting(data.meeting);
        console.log("Meeting state set:", data.meeting);
      } catch (error) {
        console.error("Error initializing Dyte client:", error);
        setErrorMessage("Could not initialize Dyte client. Please try again later.");
      }
    };

    console.log("Calling initDyteClient function");
    initDyteClient();
    console.log("Completed initDyteClient function call");
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
            {dyteMeeting && (
              <>
                <DyteMeeting meeting={dyteMeeting} style={{ width: "300px", borderRadius: "10px", border: "2px solid #4A90E2" }} />
                {console.log("DyteMeeting component rendered")}
              </>
            )}
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
