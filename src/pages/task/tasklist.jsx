import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import Switch from "@/components/ui/Switch";
import { deleteRequest } from "../../utils/apiHelper";
import { toast } from "react-toastify";
import AddTask from "./addtasks";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "../table/react-tables/GlobalFilter";

// Delete user function
const deleteTask = async (id, setTasks) => {
  const token = localStorage.getItem("auth_token");
  if (window.confirm("Are you sure you want to delete this Task?")) {

    try {
      const response = await deleteRequest("https://phplaravel-1340915-4916922.cloudwaysapps.com/api/tasks/" + `${id}`
      );

      if (response.status === 200 || response.status === 204) {
        // Remove user from the list locally
        setTasks((prevUsers) => prevUsers.filter((user) => user.id !== id));

        toast.success("Task deleted successfully!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

      } else {

        toast.warning("Failed to delete Task. Please try again.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

      }
    } catch (error) {
      console.error("Error deleting user:", error.response || error.message);
      // alert("An error occurred while deleting the user.");

      toast.error("An error occurred while deleting the Task.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }
};

const getImageUrl = (imagePath) => {
  return `https://phplaravel-1340915-4916922.cloudwaysapps.com/storage/uploads/${imagePath}`;
};

const COLUMNS = (navigate, setTasks) => [
  {
    Header: "Id",
    accessor: "id",
    Cell: (row) => <span>{row?.cell?.value}</span>,
  },
  {
    Header: "Task Name",
    accessor: "subject",
    Cell: (row) => <span>{row?.cell?.value}</span>,
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ cell }) => {
      const statusValue = cell.value;
      const statusClasses = {
        "in progress": "text-success-500 bg-success-500",
        cancelled: "text-warning-500 bg-warning-500",
        "Not Started": "text-danger-500 bg-danger-500",
        delivered: "text-primary-500 bg-primary-500",
      };
      const statusClass = statusClasses[statusValue] || "text-gray-500 bg-gray-300"; // Default style

      return (
        <span className="block w-full">
          <span
            className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${statusClass}`}
          >
            {statusValue}
          </span>
        </span>
      );
    },
  },
  {
    Header: "Start Date",
    accessor: "start_date",
    Cell: (row) => <span>{row?.cell?.value}</span>,
  },
  {
    Header: "Due Date",
    accessor: "due_date",
    Cell: (row) => <span>{row?.cell?.value}</span>,
  },
  {
    Header: "Project",
    accessor: "project_name", // Ensure alignment with mapped data
  },
  {
    Header: "Members",
    accessor: "assignees",
    Cell: (row) => {
      const members = row?.cell?.value || [];
      return (
        <div className="newmem inline-flex items-center">
          {members.length > 0 ? (
            members.map((member, index) => {
              const memberLabel = typeof member === "object" ? member.label : member;
              return (
                <Tooltip key={index} content={`Member: ${memberLabel}`} placement="top" arrow animation="shift-away">
                  <span className="inline-flex items-center">
                    <span className="w-7 h-7 rounded-full flex-none bg-slate-600 text-white text-center">
                      {memberLabel}
                    </span>
                  </span>
                </Tooltip>
              );
            })
          ) : (
            <span>No Members</span>
          )}
        </div>
      );
    },
  },
  {
    Header: "Priority",
    accessor: "priority",
    Cell: ({ cell }) => {
      const statusValue = cell.value;
      const statusClasses = {
        "in progress": "text-success-500",
        cancelled: "text-warning-500",
        "Not Started": "text-danger-500",
        delivered: "text-primary-500",
      };
      const statusClass = statusClasses[statusValue] || "text-gray-500"; // Default style

      return (
        <span className="block w-full">
          <span
            className={`inline-block rounded-[999px] ${statusClass}`}
          >
            {statusValue}
          </span>
        </span>
      );
    },
  },
  {
    Header: "Action",
    accessor: "action",
    Cell: ({ row }) => (
      <div className="flex space-x-3 rtl:space-x-reverse">
        <Tooltip content="View" placement="top" arrow animation="shift-away">
          <button
            className="action-btn"
            type="button"
            onClick={() => navigate(`/profile/${row.original.id}`)}
          >
            <Icon icon="heroicons:eye" />
          </button>
        </Tooltip>
        <Tooltip content="Edit" placement="top" arrow animation="shift-away">
          <button
            className="action-btn"
            type="button"
            onClick={() => navigate(`/edit-task/${row.original.id}`)}
          >
            <Icon icon="heroicons:pencil-square" />
          </button>
        </Tooltip>
        <Tooltip
          content="Delete"
          placement="top"
          arrow
          animation="shift-away"
          theme="danger"
        >
          <button
            className="action-btn"
            type="button"
            onClick={() => deleteTask(row.original.id, setTasks)}
          >
            <Icon icon="heroicons:trash" />
          </button>
        </Tooltip>
      </div>
    ),
  },
];

const Customerlist = ({ title = "Tasks Summary" }) => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  // Memoize the columns definition to pass navigate and setTasks functions
  const columns = useMemo(() => COLUMNS(navigate, setTasks), [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get("https://phplaravel-1340915-4916922.cloudwaysapps.com/api/tasks",
          config
        );
        const fetchedData = response.data.data;
        const mappedData = fetchedData.map((item) => ({
          id: item.id,
          subject: item.subject,
          start_date: item.start_date,
          due_date: item.due_date,
          priority: item.priority,
          status: item.status,
          assignees: item.assignees.map((assignee) => ({
            label: `${assignee}`, // Assuming assignee is a user ID
          })),
          project_name: item.project?.project_name || "N/A",
        }));
        console.log(mappedData);

        setTasks(mappedData);
      } catch (error) {
        console.error("Error fetching customer data", error);
      }
    };
    fetchData();
  }, []);

  const tableInstance = useTable(
    { columns, data: tasks },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <Card>
      <div className="md:flex justify-between items-center mb-6">
        <h4 className="card-title">{title}</h4>
        <div className="md:flex justify-between items-center">
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          <AddTask />
        </div>
      </div>
      <div className="overflow-x-auto -mx-6">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table
              className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
              {...getTableProps()}
            >
              <thead className="bg-slate-200 dark:bg-slate-700">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        scope="col"
                        className="table-th"
                      >
                        {column.render("Header")}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                {...getTableBodyProps()}
              >
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()} className="table-td">
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="md:flex justify-between mt-6 items-center">
        <div className="flex items-center space-x-3">
          <select
            className="form-control py-2 w-max"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 25, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Page {pageIndex + 1} of {pageOptions.length}
          </span>
        </div>
        <ul className="flex items-center space-x-3">
          <li>
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {"<<"}
            </button>
          </li>
          <li>
            <button onClick={previousPage} disabled={!canPreviousPage}>
              {"<"}
            </button>
          </li>
          {pageOptions.map((_, idx) => (
            <li key={idx}>
              <button
                onClick={() => gotoPage(idx)}
                className={pageIndex === idx ? "bg-slate-900 text-white" : "bg-slate-100"}
              >
                {idx + 1}
              </button>
            </li>
          ))}
          <li>
            <button onClick={nextPage} disabled={!canNextPage}>
              {">"}
            </button>
          </li>
          <li>
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              {">>"}
            </button>
          </li>
        </ul>
      </div>
    </Card>
  );
};

export default Customerlist;
