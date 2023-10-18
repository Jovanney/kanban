import KanbanBoard from "@/components/KanbanBoard";
import { Box, Heading, Text } from "@chakra-ui/react";


export default function Kanban() {
  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={2} textAlign="center">
        Kanban Board
      </Heading>
      <Text fontSize="20px" fontWeight={600} mb={4} textAlign="center" color="#718096">
            react-beautiful-dnd
      </Text>
      <KanbanBoard />
    </Box>
  );
}
