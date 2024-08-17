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

const DailyWindSpeedChart = ({ data, labels }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "windSpeedData",
        data: data,
        fill: false,
        borderColor: "turquoise",
        backgroundColor: "turquoise",
        tension: 0.1,
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
        color: "turquoise",
        font: {
          weight: "bold",
            size:"14px"
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
        beginAtZero:true,
      },
    },
  };

  return (
    <div >
      <Line data={chartData} options={options} />
    </div>
  );
};

export default DailyWindSpeedChart;