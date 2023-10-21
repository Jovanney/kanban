"use client";

import React, { useEffect, useState } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/utils/firebase/firebaseService";
import PieChart from "@/components/PieChart";
import LineChart from "@/components/LineChart";

interface Task {
  id: string;
  content: string;
  column_id: string;
  position: number;
  doneDate: string; // Add doneDate property
}

interface TaskCountByDate {
  date: string;
  count: number;
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

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dataPieChart, setDataPieChart] = useState<number[]>([]);
  const [dataLineChart, setDataLineChart] = useState<TaskCountByDate[]>([]);

  const countTasksByColumn = (tasks: Task[]) => {
    let qtdToDo = 0;
    let qtdInProgress = 0;
    let qtdCompleted = 0;

    tasks.forEach((task) => {
      switch (task.column_id) {
        case "column-1":
          qtdToDo += 1;
          break;
        case "column-2":
          qtdInProgress += 1;
          break;
        case "column-3":
          qtdCompleted += 1;
          break;
        default:
          break;
      }
    });

    setDataPieChart([qtdToDo, qtdInProgress, qtdCompleted]);
  };

  const countTasksByDay = (tasks: Task[]) => {
    const doneTasksByDay: { [key: string]: number } = {};

    tasks.forEach((task) => {
      if (task.column_id === "column-3" && task.doneDate) {
        const date = new Date(task.doneDate);
        const formattedDate = date.toISOString().split("T")[0];

        if (doneTasksByDay[formattedDate]) {
          doneTasksByDay[formattedDate] += 1;
        } else {
          doneTasksByDay[formattedDate] = 1;
        }
      }
    });

    // Convert the object to an array of daily task counts with date
    const taskCountByDay: TaskCountByDate[] = Object.entries(doneTasksByDay).map(
      ([date, count]) => ({ date, count })
    );

    setDataLineChart(taskCountByDay);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTasksFromFirestore();
      setTasks(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    countTasksByColumn(tasks);
    countTasksByDay(tasks);
  }, [tasks]);

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
          Task Progress Pie Chart
        </Heading>
        <Box width={{ base: "100%", md: "80%" }} height={{ base: "100%", md: "80%" }}>
          <PieChart data={dataPieChart} />
        </Box>
        <Text>
          This pie chart visualizes the progress of tasks. It shows the distribution of tasks in different stages.
        </Text>
      </Box>
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
          Task Progress Line Chart
        </Heading>
        <Box width={{ base: "100%", md: "80%" }} height={{ base: "100%", md: "80%" }}>
        <LineChart data={dataLineChart} />
        </Box>
        <Text>
          This line chart visualizes the progress of tasks over time. It shows the number of tasks completed each day.
        </Text>
      </Box>

    </Flex>
  );
}
