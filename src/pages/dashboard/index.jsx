import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import GroupChart4 from "@/components/partials/widget/chart/group-chart-4";
import DonutChart from "./donut-chart";
import BasicArea from "../chart/appex-chart/BasicArea";
import SelectMonth from "@/components/partials/SelectMonth";
import MessageList from "@/components/partials/widget/message-list";
import TrackingParcel from "../../components/partials/widget/activity";
import TeamTable from "@/components/partials/Table/team-table";
import { meets, files } from "@/constant/data";
import CalendarView from "@/components/partials/widget/CalendarView";
import HomeBredCurbs from "./HomeBredCurbs";
import { getRequest } from '../../utils/apiHelper';
import ProjectList from './Project-list';
import TaskList from './task-list';

const ProjectPage = () => {

  const [data, setData] = useState({
    projects: [],
    tasks: [],
    charts:[],
  });
  const [loading, setLoading] = useState(true);

  // Fetch data from API once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRequest('/api/dashboard/analytics');
        if (response.success) {
          setData({
            projects: response.data.recent_projects,
            tasks: response.data.recent_tasks,
            charts:response.data.project_analytics,
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
                  <DonutChart projectAnalytics={data.charts} height={113}/>
                </div>
              </div>
            </div>
          </Card>
          <Card title="Team members" noborder>
            {/* <TeamTable /> */}
          </Card>
          <Card title="Calender" noborder>
            <CalendarView />
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
