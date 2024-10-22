import React from "react";
import Badge from "@/components/ui/Badge";

const TaskLists = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return <div>No tasks available</div>; // Fallback if no tasks are available
  }

  return (
    <div>
      <ul className="divide-y divide-slate-100 dark:divide-slate-700 -mx-6 -mb-6">
        {tasks.map((task, index) => (
          <li
            className="flex items-center px-6 space-x-4 py-4 rtl:space-x-reverse"
            key={task.id}
          >
            <div className="flex-1 flex">
              {/* Serial number */}
              <span className="mr-4">{index + 1}.</span>

              {/* Task title */}
              <span className="flex-1 text-sm text-slate-600 dark:text-slate-300">
                {task.subject.length > 50
                  ? task.subject.slice(0, 50) + "..."
                  : task.subject}
              </span>

              {/* Task status with Badge */}
              <span className="flex-1 text-sm text-slate-600 dark:text-slate-300">
                <Badge className="bg-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-400 bg-opacity-[0.12]">
                  {task.status.length > 50
                    ? task.status.slice(0, 50) + "..."
                    : task.status}
                </Badge>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskLists;
