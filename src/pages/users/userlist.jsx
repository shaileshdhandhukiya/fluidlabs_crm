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

import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "../table/react-tables/GlobalFilter";

// Delete user function
const deleteUser = async (id, setUsers) => {
  const token = localStorage.getItem("auth_token");
  if (window.confirm("Are you sure you want to delete this customer?")) {

    try {
      const response = await deleteRequest(`${import.meta.env.VITE_API_BASE_URL}` + "/api/users/" + `${id}`
      );

      if (response.status === 200 || response.status === 204) {
        // Remove user from the list locally
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));

        toast.success("User deleted successfully!", {
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

        toast.warning("Failed to delete user. Please try again.", {
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

      toast.error("An error occurred while deleting the user.", {
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
  return `${import.meta.env.VITE_API_BASE_URL}/storage/uploads/${imagePath}`;
};

const COLUMNS = (navigate, setUsers) => [
  {
    Header: "Id",
    accessor: "id",
    Cell: (row) => <span>{row?.cell?.value}</span>,
  },
  {
    Header: "Image",
    accessor: "profile_photo",
    Cell: (row) =>
      <div className="inline-flex items-center">
        <span className="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none bg-slate-600">
          <img
            src={ getImageUrl(row?.cell?.value) || 'default-profile.jpg'}
            alt="Profile"
            className="object-cover w-full h-full rounded-full"
          />
        </span>
      </div>,
  },
  {
    Header: "Name",
    accessor: "full_name",
    Cell: (row) => (
      <div className="inline-flex items-center">
        <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">
          {row?.cell?.value}
        </span>
      </div>
    ),
  },
  {
    Header: "Email Address",
    accessor: "email",
    Cell: (row) => <span>{row?.cell?.value}</span>,
  },
  {
    Header: "Phone",
    accessor: "phone",
    Cell: (row) => <span>{row?.cell?.value}</span>,
  },
  {
    Header: "Designation",
    accessor: "designation",
    Cell: (row) => <span>{row?.cell?.value}</span>,
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: (row) => <Switch value={row?.cell?.value} />,
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
            onClick={() => deleteUser(row.original.id, setUsers)}
          >
            <Icon icon="heroicons:trash" />
          </button>
        </Tooltip>
      </div>
    ),
  },
];

const Customerlist = ({ title = "Employee List" }) => {
  const [customers, setUsers] = useState([]);
  const navigate = useNavigate();

  // Memoize the columns definition to pass navigate and setUsers functions
  const columns = useMemo(() => COLUMNS(navigate, setUsers), [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}` + "/api/users",
          config
        );
        const fetchedData = response.data.data;
        // console.log(fetchedData);
        const mappedData = fetchedData.map((item) => ({
          id: item.id,
          profile_photo: item.profile_photo,
          full_name: item.first_name + ' ' + item.last_name,
          email: item.email,
          phone: item.phone,
          designation: item.designation,
          status: item.status,
        }));
        console.log(mappedData);

        setUsers(mappedData);
      } catch (error) {
        console.error("Error fetching customer data", error);
      }
    };
    fetchData();
  }, []);

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
    <Card>
      <div className="md:flex justify-between items-center mb-6">
        <h4 className="card-title">{title}</h4>
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
  );
};

export default Customerlist;
