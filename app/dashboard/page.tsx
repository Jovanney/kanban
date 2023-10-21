import { Box, Flex, Heading } from "@chakra-ui/react";
import ExampleChart from "../../components/Charts";

export default function Dashboard() {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      height="100vh"
      alignItems="center"
      justifyContent="center"
      gap={10}
    >
      <Box
        flex="1"
        height={{ base: "50%", md: "90%" }}
        bg="gray.100"
        w="90%"
        p="6"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Heading size="lg" mb="4">
          Task Progress Chart
        </Heading>
        <Box width={{base: "100%", md: "80%"}} height={{base: "100%", md: "80%"}}>
          <ExampleChart/>
        </Box>
        <p>
          This pie chart visualizes the progress of tasks. It shows the distribution of tasks in different stages.
        </p>
      </Box>
      <Box
        flex="1"
        height={{ base: "50%", md: "90%" }}
        bg="gray.200"
        p="6"
        w="90%"
      >
        <Heading size="lg" mb="4">
          Chart 2
        </Heading>
        {/* Include another chart or content here */}
      </Box>
    </Flex>
  );
}
