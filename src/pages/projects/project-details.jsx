import React, { Fragment, useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import axios from "axios";
import CalendarView from "@/components/partials/widget/CalendarView";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import { Tab, Disclosure, Transition } from "@headlessui/react";
import Switch from "@/components/ui/Switch";
import Tooltip from "@/components/ui/Tooltip";

import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "../table/react-tables/GlobalFilter";

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const buttons = [
    {
      title: "Overview",
      icon: "heroicons-outline:view-boards",
    },
    {
      title: "Tasks",
      icon: "heroicons-outline:check-circle",
    },
    {
      title: "Files",
      icon: "heroicons-outline:document-text",
    },
    {
      title: "Timesheet",
      icon: "heroicons-outline:clock",
    },
  ];
  const deleteTask = async (id, setTask) => {
    const token = localStorage.getItem("auth_token");
    if (window.confirm("Are you sure you want to delete this Task?")) {
      try {
        const response = await axios.delete(
          `https://phplaravel-1340915-4916922.cloudwaysapps.com/api/tasks/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200 || response.status === 204) {
          // Remove user from the list locally
          setTask((prevUsers) => prevUsers.filter((user) => user.id !== id));
          alert("Task deleted successfully!");
        } else {
          alert("Failed to Task user. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting Task:", error.response || error.message);
        alert("An error occurred while deleting the Task.");
      }
    }
  };

  const COLUMNS = (navigate, setTask) => [
    {
      Header: "Id",
      accessor: "id",
      Cell: (row) => <span>{row?.cell?.value}</span>,
    },
    {
      Header: "Name",
      accessor: "subject",
      Cell: (row) => <span>{row?.cell?.value}</span>,
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
              onClick={() => navigate(`/edit-user/${row.original.id}`)}
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
              onClick={() => deleteTask(row.original.id, setTask)}
            >
              <Icon icon="heroicons:trash" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];
  const [customers, setTask] = useState([]);
  const navigate = useNavigate();

  // Memoize the columns definition to pass navigate and setTask functions
  const columns = useMemo(() => COLUMNS(navigate, setTask), [navigate]);
  // Fetch project details and tasks
  useEffect(() => {
    const fetchProjectDetails = async () => {
      const token = localStorage.getItem("auth_token");
      try {
        const response = await axios.get(
          `https://phplaravel-1340915-4916922.cloudwaysapps.com/api/projects/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const fetchedData = response.data.tasks;
        const mappedData = fetchedData.map((item) => ({
          id: item.id,
          subject: item.subject,
          start_date: item.start_date,
          due_date: item.due_date,
          assignees: item.assignees,
          status: item.status,
        }));
        setTask(mappedData);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const tableInstance = useTable(
    { columns, data: customers },
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
    <Tab.Group>
      <Tab.List className="lg:space-x-8 md:space-x-4 space-x-0 rtl:space-x-reverse bg-white p-5 mb-7 rounded-md	">
        {buttons.map((item, i) => (
          <Tab as={Fragment} key={i}>
            {({ selected }) => (
              <button
                className={` inline-flex items-start text-sm font-medium capitalize dark:bg-slate-800 ring-0 foucs:ring-0 focus:outline-none px-2 transition duration-150 before:transition-all before:duration-150 relative before:absolute
                     before:left-1/2 before:bottom-[-6px] before:h-[1.5px]
                      before:bg-primary-500 before:-translate-x-1/2
              
              ${selected
                    ? "text-primary-500 before:w-full"
                    : "text-slate-500 before:w-0 dark:text-slate-300"
                  }
              `}
              >
                <span className="text-base relative top-[1px] ltr:mr-1 rtl:ml-1">
                  <Icon icon={item.icon} />
                </span>
                {item.title}
              </button>
            )}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>
          <div className=" space-y-5">
            <div className="grid grid-cols-12 gap-5">
              {/* end single column*/}
              <Card
                title="About project"
                className="xl:col-span-6 col-span-12 lg:col-span-6 h-full"
              >
                <div>
                  <div className="flex flex-wrap flex-start mb-4">
                    <div className="mb-3 space-y-2 w-2/4	">
                      <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        Project Name
                      </div>
                      <div className="text-base text-slate-600 dark:text-slate-300 font-semibold	">
                        Vento
                      </div>
                    </div>
                    <div className="mb-3 space-y-2 w-2/4	">
                      <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        Status
                      </div>
                      <div className="text-base text-slate-600 dark:text-slate-300 font-semibold	">
                        In Progress
                      </div>
                    </div>
                    {/* end single */}
                    {/* end single */}
                  </div>
                  <div className="text-base font-medium text-slate-800 dark:text-slate-100 mb-3">
                    Project Description
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    The Optimistic Website Company - Amet minim mollit non deserunt
                    ullamco est sit aliqua dolor do amet sint. Velit officia consequat
                    duis enim velit mollit. Exercita -tion veniam consequat sunt
                    nostrud amet.
                  </p>
                  <br />
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Amet minim mollit non deserunt ullamco est sit aliqua dolor do
                    amet sint.The Optimistic Website Company - Amet minim mollit non
                    deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
                    consequat duis enim velit mollit. Exercita -tion veniam consequat
                    sunt nostrud amet.
                  </p>

                  {/* end flex */}
                  <div className="bg-slate-100 dark:bg-slate-700 rounded px-4 pt-4 pb-1 flex flex-wrap flex-start mt-6">
                    <div className="mr-4 mb-3 space-y-2 flex-1">
                      <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        Project owner
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        John Doe
                      </div>
                    </div>
                    <div className="mr-4 mb-3 space-y-2 flex-1">
                      <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        Start date
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        01/11/2021
                      </div>
                    </div>
                    {/* end single */}
                    <div className="mr-4 mb-3 space-y-2 flex-1">
                      <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        Deadline
                      </div>
                      <div className="text-xs text-warning-500">01/11/2021</div>
                    </div>
                    {/* end single */}
                  </div>
                </div>
              </Card>
              <Card title="Notes" className="xl:col-span-6 col-span-12">
                <div className="-mx-6 custom-calender mb-6">
                  <CalendarView />
                </div>
              </Card>
            </div>
          </div>
        </Tab.Panel>
        <Tab.Panel>
          <Card>
            <div className="md:flex justify-between items-center mb-6">
              <h4 className="card-title">Task List</h4>
              <div className="md:flex justify-between items-center">
                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                <Button
                  icon="heroicons-outline:plus"
                  text="Add Employee"
                  className="bg-slate-800 dark:hover:bg-opacity-70 h-min text-sm font-medium text-slate-50 hover:ring-2 hover:ring-opacity-80 ring-slate-900 hover:ring-offset-1 btn-sm dark:hover:ring-0 dark:hover:ring-offset-0 ml-5"
                  iconclassName="text-lg"
                  onClick={() => navigate("/add-users")}
                />
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
        </Tab.Panel>
        <Tab.Panel>

        </Tab.Panel>
        <Tab.Panel>

        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>

  );
};

export default ProjectDetailsPage;
