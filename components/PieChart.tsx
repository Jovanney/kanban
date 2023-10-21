"use client"
import dynamic from "next/dynamic";
import React from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface PieChartProps {
  data: number[]; // Define data as a prop
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
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
};

export default PieChart;
