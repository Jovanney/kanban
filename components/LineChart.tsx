"use client";
import dynamic from "next/dynamic";
import React from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface TaskCountByDate {
  date: string;
  count: number;
}

// Modify the LineChartProps interface to accept TaskCountByDate[]
interface LineChartProps {
  data: {
    date: string;
    count: number;
  }[];
}


const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const categories = sortedData.map((item) => item.date);
  const series = sortedData.map((item) => item.count);

  const state = {
    options: {
      chart: {
        id: 'basic-line',
      },
      xaxis: {categories},
    },
    series: [{name: 'Completed', data: series}]
  };

  return <Chart type="line" options={state.options} series={state.series} height="100%" width="100%" />;
};

export default LineChart;
