import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const HourlyTemperatureChart = ({ data, labels }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Temperature",
        data: data,
        fill: false,
        borderColor: "yellow",
        backgroundColor: "yellow",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout:{
        padding:{
            top:25,
            bottom:25,
            right:15,
            left:15,
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
        color: "yellow",
        font: {
          weight: "bold",
            size:"14px"
        },
        formatter: function (value) {
          return value + "°C";
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
        beginAtZero:false,
       
          min: Math.min(...data) - 10,
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default HourlyTemperatureChart;
