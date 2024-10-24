import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import GroupChart4 from "@/components/partials/widget/chart/group-chart-4";
import DonutChart from "./donut-chart";
import CalendarView from "@/components/partials/widget/CalendarView";
import HomeBredCurbs from "./HomeBredCurbs";
import { getRequest } from '../../utils/apiHelper';
import ProjectList from './Project-list';
import TaskList from './task-list';
import RevenueBarChart from "./revenue-bar-chart";
import Switch from "@/components/ui/Switch";
import TeamsTable from "./team-table";

const ProjectPage = () => {

  const [checked, setChecked] = useState(false);

  const [data, setData] = useState({
    projects: [],
    tasks: [],
    charts: [],
  });

  const [chartData, setChartData] = useState({
    series: [],
    categories: []
  });

  const [loading, setLoading] = useState(true);

  const [usersHoursData, setUsersHoursData] = useState([]); 

  // Fetch data from API once
  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await getRequest('/api/dashboard/analytics');
        if (response.success) {
          setData({
            projects: response.data.recent_projects,
            tasks: response.data.recent_tasks,
            charts: response.data.project_analytics,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUsersHoursData = async () => {
      try {
        const response = await getRequest('/api/allusershours');
        if (response.success) {
          const usersData = response.data;

          setUsersHoursData(usersData);

          console.log(usersData);
          

          // Map data to series and categories for the chart
          const userNames = usersData.map((user) => user.name);
          const totalHours = usersData.map((user) => user.total_hours);
          const consumedHours = usersData.map((user) => user.consumed_hours);
          const remainingHours = usersData.map((user) => user.remaining_hours);
          const overtimeHours = usersData.map((user) => user.overtime_hours);

          // Set chart data
          setChartData({
            series: [
              { name: "Total Hours", data: totalHours },
              { name: "Consumed Hours", data: consumedHours },
              { name: "Remaining Hours", data: remainingHours },
              { name: "Overtime Hours", data: overtimeHours },
            ],
            categories: userNames,
          });
        }
      } catch (error) {
        console.error("Error fetching user hours data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersHoursData();
  }, []);

  return (
    <div className="space-y-5">
      <HomeBredCurbs title="Project" />
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-8 col-span-12 space-y-5">
          <Card>
            <div className="grid grid-cols-12 gap-5">
              <div className="xl:col-span-8 col-span-12">
                <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3">
                  <GroupChart4 />
                </div>
              </div>
              <div className="xl:col-span-4 col-span-12">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-4">
                  <span className="block dark:text-slate-400 text-sm text-slate-600">
                    Progress
                  </span>
                  <DonutChart projectAnalytics={data.charts} height={113} />
                </div>
              </div>
            </div>
          </Card>
          <Card title="Team Report" headerslot={<Switch
            value={checked}
            onChange={() => setChecked(!checked)}
            checkedChildren="Show Table"
            unCheckedChildren="Show Chart"
            style={{ marginBottom: "16px" }}
          />} noborder >

            {checked ? (
              <TeamsTable usersHoursData={usersHoursData} loading={loading} />
            ) : (
              <RevenueBarChart chartData={chartData} />
            )}

          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12 space-y-5">
          <Card title="Tasks">
            <div className="mb-12">
              {!loading && (
                <>
                  <TaskList tasks={data.tasks} />
                </>
              )}
            </div>
          </Card>
          <Card title="Projects">
            <div className="mb-12">
              {!loading && (
                <>
                  <ProjectList projects={data.projects} />
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
