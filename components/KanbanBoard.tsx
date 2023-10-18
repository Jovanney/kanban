"use client";

import { Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/utils/firebase/firebaseService";

const Column = dynamic(() => import("./Column"), { ssr: false });

interface Task {
  id: string;
  content: string;
  column_id: number;
  position: number;
}

interface ColumnData {
  id: string;
  title: string;
  taskIds: string[];
}

interface InitialData {
  tasks: Record<string, Task>;
  columns: Record<string, ColumnData>;
  columnOrder: string[];
}

export default function KanbanBoard() {
  const [state, setState] = useState<InitialData>(initialData);
  
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all tasks from Firebase
        const tasksCollection = collection(db, "Tasks");
        const tasksSnapshot = await getDocs(tasksCollection);

        const tasksData: Record<string, Task> = {};

        tasksSnapshot.forEach((doc) => {
          const task = doc.data() as Task;
          tasksData[doc.id] = task;
        });


        // Update the state with the fetched tasks
        const newState: InitialData = {
          ...state,
          tasks: tasksData,
        };
        setState(newState);

        // Update the taskIds of columns based on column_id
        const columnsWithTasks = { ...newState.columns };

        Object.values(state.tasks).forEach((task: Task) => {
          const columnId = task.column_id;
          if (columnsWithTasks[columnId]) {
            columnsWithTasks[columnId].taskIds.push(task.id);
          }
        });

        setState((prevState) => ({
          ...prevState,
          columns: columnsWithTasks,
        }));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }

    fetchData();
  }, []); // Only fetch data once when the component mounts

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // If user tries to drop in an unknown destination
    if (!destination) return;

    // if the user drags and drops back in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // If the user drops within the same column but in a different position
    const sourceCol = state.columns[source.droppableId];
    const destinationCol = state.columns[destination.droppableId];

    if (sourceCol.id === destinationCol.id) {
      const newColumn = reorderColumnList(
        sourceCol,
        source.index,
        destination.index
      );

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };
      setState(newState);
      return;
    }

    // If the user moves from one column to another
    const startTaskIds = Array.from(sourceCol.taskIds);
    
    const [removed] = startTaskIds.splice(source.index, 1);
   
    const newStartCol = {
      ...sourceCol,
      taskIds: startTaskIds,
    };

    const endTaskIds = [...destinationCol.taskIds];
    endTaskIds.splice(destination.index, 0, removed);
    
    const newEndCol = {
      ...destinationCol,
      taskIds: endTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      },
    };

    setState(newState);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Flex
        flexDir="column"
        bg="main-bg"
        minH="100vh"
        w="full"
        color="white-text"
        pb="2rem"
      >

        <Flex justify="space-between" px="4rem">
          {state.columnOrder.map((columnId) => {
            const column = state.columns[columnId];
            const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);

            return <Column key={column.id} column={column} tasks={tasks} />;
          })}
        </Flex>
      </Flex>
    </DragDropContext>
  );
}

const initialData: InitialData = {
  tasks: {
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "TO-DO",
      taskIds: [],
    },
    "column-2": {
      id: "column-2",
      title: "IN-PROGRESS",
      taskIds: [],
    },
    "column-3": {
      id: "column-3",
      title: "COMPLETED",
      taskIds: [],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ["column-1", "column-2", "column-3"],
};

const reorderColumnList = (sourceCol: ColumnData, startIndex: number, endIndex: number) => {
  const newTaskIds = Array.from(sourceCol.taskIds);
  const [removed] = newTaskIds.splice(startIndex, 1);
  newTaskIds.splice(endIndex, 0, removed);

  const newColumn: ColumnData = {
    ...sourceCol,
    taskIds: newTaskIds,
  };

  return newColumn;
};
