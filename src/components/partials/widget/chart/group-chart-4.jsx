import React, { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import axios from "axios";

const GroupChart4 = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await axios.get(
          "https://phplaravel-1340915-4916922.cloudwaysapps.com/api/dashboard/analytics",
          config
        );

        const result = response.data;

        const mappedData = [
          {
            title: "Total Tasks",
            count: result.data.total_tasks || 0,
            bg: "bg-info-500",
            text: "text-info-500",
            icon: "heroicons-outline:menu-alt-1",
          },
          {
            title: "Projects",
            count: result.data.total_projects || 0,
            bg: "bg-warning-500",
            text: "text-warning-500",
            icon: "heroicons-outline:chart-pie",
          },
          {
            title: "Customers",
            count: result.data.total_customers || 0,
            bg: "bg-primary-500",
            text: "text-primary-500",
            icon: "heroicons-outline:user-group",
          },
          {
            title: "Employees",
            count: result.data.total_employees || 0,
            bg: "bg-success-500",
            text: "text-success-500",
            icon: "heroicons-outline:user-circle",
          },
        ];

        setStatistics(mappedData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{`Error: ${error}`}</p>;

  return (
    <>
      {statistics.map((item, i) => (
        <div
          key={i}
          className={`${item.bg} rounded-md p-4 bg-opacity-[0.15] dark:bg-opacity-50 text-center`}
        >
          <div
            className={`${item.text} mx-auto h-10 w-10 flex flex-col items-center justify-center rounded-full bg-white text-2xl mb-4`}
          >
            <Icon icon={item.icon} />
          </div>
          <span className="block text-sm text-slate-600 font-medium dark:text-white mb-1">
            {item.title}
          </span>
          <span className="block text-2xl text-slate-900 dark:text-white font-medium">
            {item.count}
          </span>
        </div>
      ))}
    </>
  );
};

export default GroupChart4;
