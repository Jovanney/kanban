import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import {
  Flex,
  Text,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

interface ColumnProps {
  column: {
    id: string;
    title: string;
  };
  tasks: {
    id: string;
    content: string;
  }[];
}

const Column: React.FC<ColumnProps> = ({ column, tasks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskDetails, setNewTaskDetails] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveTask = () => {
    // Here, you can save the task with the details in newTaskDetails.
    // For a simple example, you can just log the task details for now.
    console.log("New Task Details: ", newTaskDetails);

    // Close the modal
    closeModal();
  };

  return (
    <Flex rounded="3px" bg="#EDF2F7" w="400px" h="620px" flexDir="column" position="relative">
      <IconButton 
        icon={<AddIcon />}
        onClick={openModal}
        aria-label="Add Task"
        position="absolute"
        top="1rem"
        right="1rem"
      />
      <Flex
        align="center"
        h="60px"
        bg="#CBD5E0"
        rounded="3px 3px 0 0"
        px="1.5rem"
        mb="1.5rem"
      >
        <Text fontSize="17px" fontWeight={600}>
          {column.title}
        </Text>
      </Flex>

      <Droppable droppableId={column.id}>
        {(droppableProvided, droppableSnapshot) => (
          <Flex
            px="1.5rem"
            flex={1}
            flexDir="column"
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(draggableProvided, draggableSnapshot) => (
                  <Flex
                    mb="1rem"
                    h="72px"
                    bg="#CBD5E0"
                    rounded="3px"
                    p="1.5rem"
                    outline="2px solid"
                    outlineColor={
                      draggableSnapshot.isDragging ? "#000000" : "transparent"
                    }
                    boxShadow={
                      draggableSnapshot.isDragging
                        ? "0 5px 10px rgba(0, 0, 0, 0.6)"
                        : "unset"
                    }
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                  >
                    <Text>{task.content}</Text>
                  </Flex>
                )}
              </Draggable>
            ))}
          </Flex>
        )}
      </Droppable>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Task details..."
              value={newTaskDetails}
              onChange={(e) => setNewTaskDetails(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveTask}>
              Save
            </Button>
            <Button onClick={closeModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Column;