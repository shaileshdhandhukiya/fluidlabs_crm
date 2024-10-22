
import React, { useState, useEffect } from "react";
import Badge from "@/components/ui/Badge";

const ProjectList = ({ projects }) => {

  console.log(projects);
  
  if (!projects || projects.length === 0) {
    return <div>No projects available</div>; 
  }

  return (
    <div>
      <ul className="divide-y divide-slate-100 dark:divide-slate-700 -mx-6 -mb-6">
        {projects.map((project, index) => (
          <li
            className="flex items-center px-6 space-x-4 py-4 rtl:space-x-reverse"
            key={project.id}
          >
            <div className="flex-1 flex">
              {/* Serial number */}
              <span className="mr-4">{index + 1}.</span>

              {/* Project title */}
              <span className="flex-1 text-sm text-slate-600 dark:text-slate-300">
                {project.project_name.length > 50
                  ? project.project_name.slice(0, 50) + "..."
                  : project.project_name}
              </span>

              {/* Project status with Badge */}
              <span className="flex-1 text-sm text-slate-600 dark:text-slate-300">
                <Badge className="bg-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-400 bg-opacity-[0.12]">
                  {project.status.length > 50
                    ? project.status.slice(0, 50) + "..."
                    : project.status}
                </Badge>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
