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

const DailyTemperatureChart = ({ data, labels }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Max Temperature",
        data: data.tempmax,
        fill:false,
        borderColor: "red",
        backgroundColor: "red",
        tension: 0.1,
        datalabels: {
            anchor: "start",
            align: "top",
            color: "red",
            font: {
              weight: "bold",
              size:"14px"
            },
            formatter: function (value) {
              return value + "°C";
            },
          },
          
      },
      {
        label: "Min Temperature",
        data: data.tempmin,
        fill:false,
        borderColor: "blue",
        backgroundColor: "blue",
        tension: 0.1,
        datalabels: {
            anchor: "start",
            align: "bottom",
            color: "blue",
            font: {
              size:"14px",
              weight: "bold",
            },
            formatter: function (value) {
              return value + "°C";
            },
          },
          
      },
      
      
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout:{
      padding:{
        top: 25,
        right: 15,
        left: 15,
        bottom:25,
      },
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false,
      },
     
    },
    scales: {
        x: {
          display: false,
          ticks:{
            display:false
          }
        },
        y: {
          display: false,
          beginAtZero:false,
        },
       
      },
  };

  return (
    <div style={{ width: "100%", height: "100%"}}>
    <Line data={chartData} options={options} />
  </div>
  );
};

export default DailyTemperatureChart;
