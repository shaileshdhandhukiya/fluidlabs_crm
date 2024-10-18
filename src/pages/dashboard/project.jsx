import React from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import GroupChart4 from "@/components/partials/widget/chart/group-chart-4";
import DonutChart from "@/components/partials/widget/chart/donut-chart";
import BasicArea from "../chart/appex-chart/BasicArea";
import SelectMonth from "@/components/partials/SelectMonth";
import TaskLists from "@/components/partials/widget/task-list";
import MessageList from "@/components/partials/widget/message-list";
import TrackingParcel from "../../components/partials/widget/activity";
import TeamTable from "@/components/partials/Table/team-table";
import { meets, files } from "@/constant/data";
import CalendarView from "@/components/partials/widget/CalendarView";
import HomeBredCurbs from "./HomeBredCurbs";

const ProjectPage = () => {
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
                  <DonutChart />
                </div>
              </div>
            </div>
          </Card>
          <Card title="Team members" noborder>
            <TeamTable />
          </Card>
          <Card title="Calender" noborder>
            <CalendarView />
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12 space-y-5">
          <Card title="Tasks">
            <div className="mb-12">
              <TaskLists />
            </div>
          </Card>
          <Card title="Projects">
            <div className="mb-12">
              <TaskLists />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
