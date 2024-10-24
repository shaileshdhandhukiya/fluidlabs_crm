import React from "react";
import Chart from "react-apexcharts";
import useDarkMode from "@/hooks/useDarkMode";
import { colors } from "@/constant/data";

const DonutChart = ({ height = 113, projectAnalytics }) => {
  const [isDark] = useDarkMode();

  function colorOpacity(color, opacity) {
    // Coerce values so it is between 0 and 1.
    var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
  }

  // Extract series data from projectAnalytics
  const completedProjects = projectAnalytics?.completed_projects || 0;
  const pendingProjects = projectAnalytics?.pending_projects || 0;

  const series = [completedProjects, pendingProjects]; // Use completed and pending values

  // Calculate total projects
  const totalProjects = completedProjects + pendingProjects;

  console.log(totalProjects);
  

  const options = {
    labels: ["Completed Projects", "Pending Projects"],
    dataLabels: {
      enabled: false,
    },
    colors: [colors.info, colorOpacity(colors.info, 0.16)],
    legend: {
      position: "bottom",
      fontSize: "12px",
      fontFamily: "Inter",
      fontWeight: 400,
      show: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "50%",
          labels: {
            show: true,
            name: {
              show: false,
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Inter",
              color: isDark ? "#cbd5e1" : "#475569",
            },
            value: {
              show: true,
              fontSize: '16px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              color: undefined,
              offsetY: 16,
              formatter: function (val) {
                return val
              }
            },
            total: {
              show: true,
              fontSize: "10px",
              label: "Total", // Optionally add a label
              color: isDark ? "#cbd5e1" : "#475569",
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => {
                  return a + b
                }, 0)
              }
            },
          },
        },
      },
    },
  };

  return (
    <div>
      <Chart options={options} series={series} type="pie" height={height} />
    </div>
  );
};

export default DonutChart;
