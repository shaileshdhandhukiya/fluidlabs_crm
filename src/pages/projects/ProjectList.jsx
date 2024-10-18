import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import Switch from "@/components/ui/Switch";
import { fetchProfileImages } from "../../utils/apiHelper";

import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "../table/react-tables/GlobalFilter";

const handleDeleteProject = async (id, setProjects) => {
  const token = localStorage.getItem("auth_token");

  if (window.confirm("Are you sure you want to delete this project?")) {
    try {
      const response = await axios.delete(
        `https://phplaravel-1340915-4916922.cloudwaysapps.com/api/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== id)
        );
        alert("Project deleted successfully!");
      } else {
        alert("Failed to delete project. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting project:", error.response || error.message);
    }
  }
};


// Function to get the user's profile image by user ID


const COLUMNS = (navigate, setProjects) => [
  {
    Header: "Id",
    accessor: "id",
    Cell: (row) => <span>{row?.cell?.value}</span>,
  },
  {
    Header: "Project Name",
    accessor: "project_name",
    Cell: (row) => <span>{row?.cell?.value}</span>,
  },
  {
    Header: "Customer Name",
    accessor: "customer.customer_name", // Access the customer object
    Cell: (row) => {
      const customerName = row?.cell?.value;
      return (
        <div className="inline-flex items-center">
          <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">
            {typeof customerName === "object" ? customerName?.label : customerName}
          </span>
        </div>
      );
    },
  },
  {
    Header: "Start Date",
    accessor: "start_date",
    Cell: (row) => <span>{row?.cell?.value}</span>,
  },
  {
    Header: "Deadline",
    accessor: "deadline",
    Cell: (row) => <span>{row?.cell?.value || "N/A"}</span>, // Handle null deadline
  },
  {
    Header: "Members",
    accessor: "members",
    Cell: ({ cell: { value: members } }) => {
      
      const [profileImages, setProfileImages] = useState({});

      useEffect(() => {
        const fetchImages = async () => {
          if (members && members.length > 0) {

            const imageUrls = await fetchProfileImages(members);

            const imageMap = members.reduce((acc, member, index) => {
              const memberId = typeof member === "object" ? member.id : member;
              acc[memberId] = imageUrls[index];
              return acc;
            }, {});

            setProfileImages(imageMap);
          }
        };

        fetchImages();
      }, [members]);

      return (
        <div className="inline-flex items-center">
          {members && members.length > 0 ? (
            members.map((member) => {
              const memberId = typeof member === "object" ? member.id : member;
              return (
                <span key={memberId} className="inline-flex items-center">
                  {profileImages[memberId] ? (
                    <span className="inline-flex items-center">
                    <span className="w-7 h-7 rounded-full flex-none bg-slate-600 text-white text-center">
                      <img
                      src={profileImages[memberId]}
                      alt="Profile"
                      loading="lazy"
                      className="w-7 h-7 rounded-full flex-none bg-slate-600 text-white text-center"
                    />
                    </span>
                  </span>
                  ) : (
                    <p>No image</p>
                  )}
                </span>
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
            onClick={() => navigate(`/view-project/${row.original.id}`)}
          >
            <Icon icon="heroicons:eye" />
          </button>
        </Tooltip>
        <Tooltip content="Edit" placement="top" arrow animation="shift-away">
          <button
            className="action-btn"
            type="button"
            onClick={() => navigate(`/edit-project/${row.original.id}`)}
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
            onClick={() => handleDeleteProject(row.original.id, setProjects)}
          >
            <Icon icon="heroicons:trash" />
          </button>
        </Tooltip>
      </div>
    ),
  },
];

const ProjectList = ({ title = "Project List" }) => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate(); // useNavigate hook for redirection

  const columns = useMemo(() => COLUMNS(navigate, setProjects), [navigate, setProjects]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(
          "https://phplaravel-1340915-4916922.cloudwaysapps.com/api/projects",
          config
        );
        const fetchedData = response?.data?.data || [];

        const mappedData = fetchedData.map((item) => ({
          id: item.id,
          project_name: item.project_name,
          customer: item.customer,
          status: item.status,
          members: item.members,
          start_date: item.start_date,
          deadline: item.deadline,
        }));
        setProjects(mappedData);
      } catch (error) {
        console.error("Error fetching project data", error);
      }
    };
    fetchData();
  }, []);

  const tableInstance = useTable(
    { columns, data: projects },
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
    <>
      <Card>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">{title}</h4>
          <div className="md:flex justify-between items-center">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <Button
              icon="heroicons-outline:plus"
              text="Add Project"
              className="bg-slate-800 dark:hover:bg-opacity-70 h-min text-sm font-medium text-slate-50 hover:ring-2 hover:ring-opacity-80 ring-slate-900 hover:ring-offset-1 btn-sm dark:hover:ring-0 dark:hover:ring-offset-0 ml-5"
              iconclassName=" text-lg"
              onClick={() => navigate("/add-project")}
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
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
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
                <tbody {...getTableBodyProps()}>
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
              <div className="pagination mt-4">
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                  Previous
                </button>
                <span>
                  Page{" "}
                  <strong>
                    {pageIndex + 1} of {pageOptions.length}
                  </strong>{" "}
                </span>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ProjectList;
