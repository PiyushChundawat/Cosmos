import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Chart({
  type = 'bar',
  data,
  options = {},
  title,
}) {
  const defaultOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: { size: 12, weight: 'bold' },
          color: '#374151',
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        borderRadius: 8,
      },
      title: {
        display: !!title,
        text: title,
        font: { size: 16, weight: 'bold' },
        color: '#1f2937',
        padding: { bottom: 20 },
      },
    },
    maintainAspectRatio: true,
  };

  const mergedOptions = { ...defaultOptions, ...options };

  const chartComponents = {
    bar: <Bar data={data} options={mergedOptions} />,
    pie: <Pie data={data} options={mergedOptions} />,
    doughnut: <Doughnut data={data} options={mergedOptions} />,
    line: <Line data={data} options={mergedOptions} />,
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {chartComponents[type]}
    </div>
  );
}