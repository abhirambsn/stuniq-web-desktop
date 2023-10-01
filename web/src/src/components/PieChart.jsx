import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const colors = {
  red: {
    backgroundColor: "rgba(255, 99, 132, 0.2)",
    borderColor: "rgba(255, 99, 132, 1)",
  },
  blue: {
    backgroundColor: "rgba(54, 162, 235, 0.2)",
    borderColor: "rgba(54, 162, 235, 1)",
  },
  green: {
    backgroundColor: "rgba(75, 192, 192, 0.2)",
    borderColor: "rgba(75, 192, 192, 1)",
  },
  purple: {
    backgroundColor: "rgba(153, 102, 255, 0.2)",
    borderColor: "rgba(153, 102, 255, 1)",
  },
  orange: {
    backgroundColor: "rgba(255, 159, 64, 0.2)",
    borderColor: "rgba(255, 159, 64, 1)",
  },
};

const PieChart = ({ data, labels, title, bg_colors, type, count }) => {
  const backgroundColors = [
    colors[bg_colors[0]].backgroundColor,
    colors[bg_colors[1]].backgroundColor,
  ];
  const borderColors = [
    colors[bg_colors[0]].borderColor,
    colors[bg_colors[1]].borderColor,
  ];
  const data_chart = {
    labels: labels,
    datasets: [
      {
        label: "# of Images",
        data: data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center flex-col">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <h6 className="text-sm mb-1">
        Total {type}: <strong>{count}</strong>
      </h6>
      <div className="w-64 h-64 flex items-center justify-center">
        <Pie data={data_chart} />
      </div>
    </div>
  );
};

export default PieChart;
