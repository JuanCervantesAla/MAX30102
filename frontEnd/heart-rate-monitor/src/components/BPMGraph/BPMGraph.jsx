import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  

const BPMGraph = ({ bpmData }) => {
  const data = {
    labels: bpmData.map((_, index) => `${index + 1}`),
    datasets: [
      {
        label: 'Beats per minute',
        data: bpmData,
        fill: false,
        borderColor: 'rgba(75, 122, 192, 1)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Beats per minute graph'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Seconds'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Beats por minuto'
        }
      }
    }
  };

  return <Line data={data} options={options} width={1200} height={4100} />;
};

export default BPMGraph;
