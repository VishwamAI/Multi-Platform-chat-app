import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
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

  const userVideo = useRef();
  const partnerVideo = useRef();

  useEffect(() => {
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

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
        alert("Could not access your camera and microphone. Please check your device settings and permissions.");
      });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
  }, [peer]);

  const callUser = (id) => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", { userToCall: id, signalData: data, from: socket.id });
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
      <Text fontSize="2xl" mb={4}>Video Call</Text>
      <Box display="flex" justifyContent="space-around" mb={4}>
        <video playsInline muted ref={userVideo} autoPlay style={{ width: "300px" }} />
        {callAccepted && <video playsInline ref={partnerVideo} autoPlay style={{ width: "300px" }} />}
      </Box>
      <Button colorScheme="teal" onClick={() => callUser("user-id")}>Call User</Button>
      {receivingCall && !callAccepted && (
        <Box>
          <Text>{caller} is calling you</Text>
          <Button colorScheme="teal" onClick={acceptCall}>Accept Call</Button>
        </Box>
      )}
      <Box mt={4}>
        <Text>Camera Permission: {cameraPermission}</Text>
        <Text>Microphone Permission: {microphonePermission}</Text>
        {cameraPermission === "prompt" && microphonePermission === "prompt" && (
          <Text>Please allow camera and microphone access to use the video call feature.</Text>
        )}
      </Box>
    </Box>
  );
};

export default VideoCall;
