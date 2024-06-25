import React, { useState } from "react";
import { Box, Button, Input, Text } from "@chakra-ui/react";

const GifUploader = ({ onGifUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onGifUpload(reader.result);
        setSelectedFile(null);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" mb={4}>
      <Text fontSize="lg" mb={2}>Upload a GIF</Text>
      <Input type="file" accept="image/gif" onChange={handleFileChange} mb={2} />
      <Button colorScheme="teal" onClick={handleUpload} isDisabled={!selectedFile}>
        Upload
      </Button>
    </Box>
  );
};

export default GifUploader;
