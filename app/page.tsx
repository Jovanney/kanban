'use client';

import { Box } from "@chakra-ui/react";
import "@lottiefiles/lottie-player";

export default function Home() {
  return (
    <Box h="100vh" display="flex" alignItems="center" justifyContent="center">
      <lottie-player
        autoplay
        loop
        mode="normal"
        src="https://lottie.host/e34ce631-3f45-435b-a18a-64dc2306759a/spYSI08T3r.json"
        style={{ width: '800px', height: '800px' }}
      />
    </Box>
  );
}
