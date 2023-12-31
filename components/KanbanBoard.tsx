/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { collection, doc, getDocs, query, writeBatch } from "firebase/firestore";
import { db } from "@/utils/firebase/firebaseService";

const Column = dynamic(() => import("./Column"), { ssr: false });

interface Task {
  id: string;
  content: string;
  column_id: string;
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

const fetchTasksFromFirestore = async () => {
  const tasksQuery = query(collection(db, "Tasks"));
  const tasksSnapshot = await getDocs(tasksQuery);
  const tasks = tasksSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Task[];

  return tasks;
}

const updateTaskPositionFirestore = async (newTaskIds: string[]) => {
  const batch = writeBatch(db);
  const taskRef = collection(db, "Tasks");

  newTaskIds.forEach((taskId, index) => {
    const taskDocRef = doc(taskRef, taskId);
    batch.update(taskDocRef, { position: index });
  });

  await batch.commit();
}

const updateTaskColumnPositionFirestore = async (newStartCol: ColumnData, newEndCol: ColumnData) => {
  const batch = writeBatch(db);
  const taskRef = collection(db, "Tasks");

  // Update tasks in the source column
  newStartCol.taskIds.forEach((taskId, index) => {
    const taskDocRef = doc(taskRef, taskId);
    batch.update(taskDocRef, {
      position: index,
      column_id: newStartCol.id,
      doneDate: null, // Set doneDate to null when moving away from column-3
    });
  });

  // Update tasks in the destination column
  newEndCol.taskIds.forEach((taskId, index) => {
    const taskDocRef = doc(taskRef, taskId);
    batch.update(taskDocRef, {
      position: index,
      column_id: newEndCol.id,
      doneDate: newEndCol.id === "column-3" ? new Date().toISOString() : null, // Set doneDate to current date if moving to column-3
    });
  });

  await batch.commit();
  console.log("Updated task positions and columns in Firestore");
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

export default function KanbanBoard() {
  const [state, setState] = useState<InitialData>(initialData);
  
  const fetchTasks = async () => {
    const data = await fetchTasksFromFirestore();
    const updatedColumns = { ...state.columns }; 

    data.sort((a, b) => a.position - b.position); // Sort tasks by position

    data.forEach((task) => {
      if (updatedColumns[task.column_id] && !updatedColumns[task.column_id].taskIds.includes(task.id)) {
        // Check if the task ID is not already in the column's taskIds array
        updatedColumns[task.column_id].taskIds.push(task.id);
      }
    });

    const newState = {
      ...state,
      tasks: {
        ...state.tasks,
        ...data.reduce((acc, task) => {
          acc[task.id] = task;
          return acc;
        }, {} as Record<string, Task>),
      },
      columns: updatedColumns,
    };

    setState(newState);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;

    // If user tries to drop in an unknown destination
    if (!destination) return console.log("Destination is null");

    // if the user drags and drops back in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return console.log("Destination is the same Column and position");
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
      
      await updateTaskPositionFirestore(newState.columns[newColumn.id].taskIds);

      // Update the positions of tasks in Firestore

      console.log("Updated task positions in Firestore");
      
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

    await updateTaskColumnPositionFirestore(newStartCol, newEndCol);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
        <Flex
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: 4, md: 8 }}
        justify={{ base: 'space-between', md: 'center' }}
        align={{ base: 'center', md: 'flex-start' }}
        rounded="lg"
        boxShadow="md"
      >
        {state.columnOrder.map((columnId) => {
            const column = state.columns[columnId];
            const tasks = column.taskIds
              .map((taskId) => state.tasks[taskId])
            return <Column key={column.id} column={column} tasks={tasks} fetchTasks={fetchTasks} />;
          })}
      </Flex>

    </DragDropContext>
  );
};

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
