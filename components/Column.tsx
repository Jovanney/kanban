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
import { collection, addDoc } from "firebase/firestore"; 
import { db } from "@/utils/firebase/firebaseService";

interface ColumnProps {
  column: {
    id: string;
    title: string;
  };
  tasks: {
    id: string;
    content: string;
  }[];
  fetchTasks: () => void;
}

const Column: React.FC<ColumnProps> = ({ column, tasks, fetchTasks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskDetails, setNewTaskDetails] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveTask = async () => {
    try {
      const columnId = column.id; // Get the column ID
      const newTaskContent = newTaskDetails;
  
      // Determine if the task is in column-3
      const isColumn3 = columnId === "column-3";
  
      // Set the doneDate to the current date if it's in column-3
      const doneDate = isColumn3 ? new Date().toISOString() : null;
  
      const docData = {
        column_id: columnId,
        content: newTaskContent,
        position: tasks.length,
        doneDate, // Set doneDate property
      };
  
      const docRef = await addDoc(collection(db, "Tasks"), docData);
      fetchTasks();
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  
    // Close the modal
    closeModal();
  };
  

  return (
    <Flex rounded="3px" bg="#EDF2F7" w="400px" h={{base: "310px", md:"620px"}} overflow={"auto"} flexDir="column" position="relative" border="1px solid #4D6C73" boxShadow="md">
      <Flex
        align="center"
        h="60px"
        minH={"60px"}
        bg="#CBD5E0"
        rounded="3px 3px 0 0"
        px="1.5rem"
        mb="1.5rem"
        justify="space-between"
      >
        <Text fontSize="17px" fontWeight={600}>
          {column.title}
        </Text>

        <IconButton 
        icon={<AddIcon />}
        onClick={openModal}
        aria-label="Add Task"
      />
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
            {droppableProvided.placeholder}
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