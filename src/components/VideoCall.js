import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Text, Input, Alert, AlertIcon } from "@chakra-ui/react";
import SimplePeer from "simple-peer";
import io from "socket.io-client";

const socket = io("https://messaging-app-5btcll2g.devinapps.com");

const VideoCall = () => {
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [peer, setPeer] = useState(null);
  const [cameraPermission, setCameraPermission] = useState("prompt");
  const [microphonePermission, setMicrophonePermission] = useState("prompt");
  const [userIdToCall, setUserIdToCall] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const userVideo = useRef();
  const partnerVideo = useRef();

  useEffect(() => {
    console.log("Setting up socket event listeners");

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
            setStream(stream);
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

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("callUser", (data) => {
      console.log("Received callUser event:", data);
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });

    socket.on("callAccepted", (signal) => {
      console.log("Received callAccepted event");
      setCallAccepted(true);
      peer.signal(signal);
    });

    socket.on("callError", (data) => {
      console.log("Received callError event:", data);
      setErrorMessage(data.message);
      console.log("Error Message Set:", data.message);
    });

    console.log("Socket event listeners set up");
  }, [peer]);

  const callUser = () => {
    if (!userIdToCall) {
      setErrorMessage("Please enter a valid user ID.");
      return;
    }

    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", { userToCall: userIdToCall, signalData: data, from: socket.id });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    setPeer(peer);
  };

  const acceptCall = () => {
    setCallAccepted(true);
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("acceptCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    setPeer(peer);
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4} textAlign="center">Video Call</Text>
      <Box display="flex" justifyContent="space-around" mb={4}>
        <video playsInline muted ref={userVideo} autoPlay style={{ width: "300px", borderRadius: "10px", border: "2px solid #4A90E2" }} />
        {callAccepted && <video playsInline ref={partnerVideo} autoPlay style={{ width: "300px", borderRadius: "10px", border: "2px solid #4A90E2" }} />}
      </Box>
      <Box display="flex" justifyContent="center" mb={4}>
        <Input placeholder="Enter user ID to call..." width="300px" mr={2} value={userIdToCall} onChange={(e) => setUserIdToCall(e.target.value)} />
        <Button colorScheme="teal" onClick={callUser}>Call User</Button>
      </Box>
      {receivingCall && !callAccepted && (
        <Box textAlign="center" mt={4}>
          <Text fontSize="lg" mb={2}>{caller} is calling you</Text>
          <Button colorScheme="teal" onClick={acceptCall}>Accept Call</Button>
        </Box>
      )}
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
  );
};

export default VideoCall;
