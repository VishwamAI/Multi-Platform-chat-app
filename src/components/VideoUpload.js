import React, { useState } from 'react';
import { Box, Button, Input, Text, useToast } from "@chakra-ui/react";

const VideoUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const toast = useToast();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected.",
        description: "Please select a video file to upload.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Implement the upload logic here
    // For now, we'll just show a success message
    toast({
      title: "Upload successful.",
      description: `Video file "${selectedFile.name}" uploaded successfully.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box p={4}>
      <Text fontSize="xl">Upload Video</Text>
      <Input type="file" accept="video/*" onChange={handleFileChange} />
      {selectedFile && (
        <Box mt={4}>
          <Text>Selected file: {selectedFile.name}</Text>
        </Box>
      )}
      <Button mt={4} colorScheme="teal" onClick={handleUpload}>
        Upload
      </Button>
    </Box>
  );
};

export default VideoUpload;
