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
import Fileinput from "@/components/ui/Fileinput";
import { useDropzone } from "react-dropzone";
import uploadSvgImage from "@/assets/images/svg/upload.svg";


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
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    project_name: "",
    customer_id: "",
    status: "",
    start_date: "",
    deadline: "",
    description: "",
    members: "",
  });
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });
  const [customer_name, setCustomerName] = useState("");
  const [tasks, setTasks] = useState([]);
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

  const COLUMNS = (navigate) => [
    { Header: "Id", accessor: "id" },
    { Header: "Name", accessor: "subject" },
    { Header: "Start Date", accessor: "start_date" },
    { Header: "Due Date", accessor: "due_date" },
    {
      Header: "Members",
      accessor: "assignees",
      Cell: ({ cell }) => (
        <div className="inline-flex items-center">
          {cell.value.length > 0 ? (
            cell.value.map((assignee, index) => (
              <Tooltip key={index} content={`Member: ${assignee}`} placement="top" arrow animation="shift-away">
                <span className="w-7 h-7 rounded-full bg-slate-600 text-white text-center flex items-center justify-center">
                  {assignee}
                </span>
              </Tooltip>
            ))
          ) : (
            <span>No Members</span>
          )}
        </div>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ cell }) => (
        <span
          className={`px-3 py-1 rounded-full bg-opacity-25 ${cell.value === "in progress"
            ? "bg-success-500 text-success-500"
            : cell.value === "testing"
              ? "bg-warning-500 text-warning-500"
              : "bg-gray-300 text-gray-500"
            }`}
        >
          {cell.value}
        </span>
      ),
    },
    {
      Header: "Priority",
      accessor: "priority",
      Cell: ({ cell }) => (
        <span
          className={`px-3 py-1 rounded-full bg-opacity-25 ${cell.value === "in progress"
            ? "bg-success-500 text-success-500"
            : cell.value === "testing"
              ? "bg-warning-500 text-warning-500"
              : "bg-gray-300 text-gray-500"
            }`}
        >
          {cell.value}
        </span>
      ),
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => (
        <div className="flex space-x-3">
          <Tooltip content="View" placement="top" arrow animation="shift-away">
            <button onClick={() => navigate(`/profile/${row.original.id}`)}>
              <Icon icon="heroicons:eye" />
            </button>
          </Tooltip>
          <Tooltip content="Edit" placement="top" arrow animation="shift-away">
            <button onClick={() => navigate(`/edit-user/${row.original.id}`)}>
              <Icon icon="heroicons:pencil-square" />
            </button>
          </Tooltip>
          <Tooltip content="Delete" placement="top" arrow animation="shift-away" theme="danger">
            <button onClick={() => deleteTask(row.original.id)}>
              <Icon icon="heroicons:trash" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];


  const [customers, setTask] = useState([]);

  const formatText = (text) => {
    if (!text) return "";
    return text.replace(/\n/g, "<br />");
  };
  // Memoize the columns definition to pass navigate and setTask functions
  const columns = useMemo(() => COLUMNS(navigate, setTask), [navigate]);
  // Fetch project details and tasks
  useEffect(() => {
    const fetchProfileData = async () => {
      const authToken = localStorage.getItem('auth_token');
      try {
        const response = await axios.get(`https://phplaravel-1340915-4916922.cloudwaysapps.com/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.data.success) {
          const project = response.data.data;
          setFormData({
            project_name: project.project_name,
            customer_id: project.customer_id,
            status: project.status,
            members: project.members,
            start_date: project.start_date,
            deadline: project.deadline,
            description: project.description,
          });
          setTasks(project.tasks);
          fetchCustomerName(project.customer_id);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [id]);

  const fetchCustomerName = async (customerId) => {
    try {
      const authToken = localStorage.getItem("auth_token");
      const response = await axios.get(
        `https://phplaravel-1340915-4916922.cloudwaysapps.com/api/customers/${customerId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (response.data.success) {
        setCustomerName(response.data.data.customer_name); // Set customer name
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };
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
                        {formData.project_name || "Project Name"}
                      </div>
                    </div>
                    <div className="mb-3 space-y-2 w-2/4	">
                      <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        Status
                      </div>
                      <div className="text-base text-slate-600 dark:text-slate-300 font-semibold	">
                        {formData.status || "Status"}
                      </div>
                    </div>
                    {/* end single */}
                    {/* end single */}
                  </div>
                  <div className="text-base font-medium text-slate-800 dark:text-slate-100 mb-3">
                    Project Description
                  </div>
                  <div
                    className="text-base font-medium text-slate-800 dark:text-slate-100 mb-3"
                    dangerouslySetInnerHTML={{ __html: formatText(formData.description || "description") }}
                  />

                  {/* end flex */}
                  <div className="bg-slate-100 dark:bg-slate-700 rounded px-4 pt-4 pb-1 flex flex-wrap flex-start mt-6">
                    <div className="mr-4 mb-3 space-y-2 flex-1">
                      <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        Project owner
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        {customer_name || "Customer Name"}
                      </div>
                    </div>
                    <div className="mr-4 mb-3 space-y-2 flex-1">
                      <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        Start date
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        {formData.start_date || "Start Date"}
                      </div>
                    </div>
                    {/* end single */}
                    <div className="mr-4 mb-3 space-y-2 flex-1">
                      <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        Deadline
                      </div>
                      <div className="text-xs text-warning-500">{formData.deadline || "End Date"}</div>
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
          <div className="xl:col-span-2 col-span-1">
            <Card title="Upload Files">
              <div className="w-full text-center border-dashed border border-secondary-500 rounded-md py-[52px] flex flex-col justify-center items-center">
                {files.length === 0 && (
                  <div {...getRootProps({ className: "dropzone" })}>
                    <input className="hidden" {...getInputProps()} />
                    <img src={uploadSvgImage} alt="" className="mx-auto mb-4" />
                    {isDragAccept ? (
                      <p className="text-sm text-slate-500 dark:text-slate-300 ">
                        Drop the files here ...
                      </p>
                    ) : (
                      <p className="text-sm text-slate-500 dark:text-slate-300 f">
                        Drop files here or click to upload.
                      </p>
                    )}
                  </div>
                )}
                <div className="flex space-x-4">
                  {files.map((file, i) => (
                    <div key={i} className="mb-4 flex-none">
                      <div className="h-[300px] w-[300px] mx-auto mt-6 rounded-md">
                        <img
                          src={file.preview}
                          className=" object-contain h-full w-full block rounded-md"
                          onLoad={() => {
                            URL.revokeObjectURL(file.preview);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </Tab.Panel>
        <Tab.Panel>

        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>

  );
};

export default ProjectDetailsPage;
