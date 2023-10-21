"use client";

import dynamic from "next/dynamic";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/utils/firebase/firebaseService";
import { useEffect, useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Task {
  id: string;
  content: string;
  column_id: string;
  position: number;
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

export default function ExampleChart() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [data, setData] = useState<number[]>([0, 0, 0]); // Initialize with zeros

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

    setData([qtdToDo, qtdInProgress, qtdCompleted]);
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
  }, [tasks]);

  const state = {
    options: {
      chart: {
        id: 'pie-chart',
      },
      labels: ['TO DO', 'IN-PROGRESS', 'COMPLETED'],
    },
    series: data,
  };

  return <Chart type="pie" options={state.options} series={state.series} height="100%" width="100%" />;
}
