import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const DailyPressureChart = ({ data, labels }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Pressure (hPa)",
        data: data,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        barPercentage: 0.5,
        categoryPercentage: 0.4,
        datalabels : {
          formatter: function (value) {
              return Math.floor(value);
            },
          }
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    layout: {
      padding: {
        top: 25,
        bottom: 25,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      datalabels: {
        anchor: "end",
        align: "top",
        color: "rgba(0, 0, 0, 0.9)",
        borderColor: "black",
        font: {
          weight: "bold",
          size: "14px",
        },
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
          color: "white",
        },
      },
      y: {
        display: false,
        beginAtZero: false, 
        min: Math.min(...data) - 5, 
        
      },
    },
  };

  return (
      <Bar data={chartData} options={options} />
  );
};

export default DailyPressureChart;