import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import Switch from "@/components/ui/Switch";

import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "../table/react-tables/GlobalFilter";

const handleDeleteCustomer = async (id, setCustomers) => {
  const token = localStorage.getItem("auth_token");

  if (window.confirm("Are you sure you want to delete this customer?")) {
    try {
      const response = await axios.delete(
        `https://phplaravel-1340915-4916922.cloudwaysapps.com/api/customers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        setCustomers((prevCustomers) =>
          prevCustomers.filter((customer) => customer.id !== id)
        );
        alert("Customer deleted successfully!");
      } else {
        alert("Failed to delete customer. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting customer:", error.response || error.message);
    }
  }
};

const COLUMNS = (navigate) => [
  {
    Header: "Id",
    accessor: "id",
    Cell: (row) => <span>{row?.cell?.value}</span>,
  },
  {
    Header: "Company",
    accessor: "company",
    Cell: (row) => <span>{row?.cell?.value}</span>,
  },
  {
    Header: "Customer Name",
    accessor: "customer_name",
    Cell: (row) => (
      <div className="inline-flex items-center">
        <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">
          {row?.cell?.value}
        </span>
      </div>
    ),
  },
  {
    Header: "Primary Email",
    accessor: "email",
    Cell: (row) => <span>{row?.cell?.value}</span>,
  },
  {
    Header: "Phone",
    accessor: "phone",
    Cell: (row) => <span>{row?.cell?.value}</span>,
  },
  {
    Header: "Services",
    accessor: "subscription_package",
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
            onClick={() => navigate(`/customer-profile/${row.original.id}`)} // Navigate to View Customer
          >
            <Icon icon="heroicons:eye" />
          </button>
        </Tooltip>
        <Tooltip content="Edit" placement="top" arrow animation="shift-away">
          <button
            className="action-btn"
            type="button"
            onClick={() => navigate(`/edit-profile/${row.original.id}`)} // Navigate to Edit Customer
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
            onClick={() => handleDeleteCustomer(row.original.id, setCustomers)} // Call delete function
          >
            <Icon icon="heroicons:trash" />
          </button>
        </Tooltip>
      </div>
    ),
  },
];

const Customerlist = ({ title = "Customer List" }) => {
  const [customers, setCustomers] = useState([]); 
  const navigate = useNavigate(); // useNavigate hook for redirection

  // Memoize the columns definition to pass the navigate function
  const columns = useMemo(() => COLUMNS(navigate), [navigate]);

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
          "https://phplaravel-1340915-4916922.cloudwaysapps.com/api/customers",
          config
        );
        const fetchedData = response.data.data;
        const mappedData = fetchedData.map((item) => ({
          id: item.id,
          company: item.company,
          customer_name: item.customer_name,
          email: item.email,
          phone: item.phone,
          subscription_package: item.subscription_package,
          status: item.status,
        }));
        setCustomers(mappedData);
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
    <>
      <Card>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">{title}</h4>
          <div className="md:flex justify-between items-center">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <Button
              icon="heroicons-outline:plus"
              text="Add Customers"
              className="bg-slate-800 dark:hover:bg-opacity-70 h-min text-sm font-medium text-slate-50 hover:ring-2 hover:ring-opacity-80 ring-slate-900 hover:ring-offset-1 btn-sm dark:hover:ring-0 dark:hover:ring-offset-0 ml-5"
              iconclassName=" text-lg"
              onClick={() => navigate("/add-customers")}
            />
          </div>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
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
                          className=" table-th "
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
          <div className=" flex items-center space-x-3">
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
                  className={
                    pageIndex === idx
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100"
                  }
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
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                {">>"}
              </button>
            </li>
          </ul>
        </div>
      </Card>
    </>
  );
};

export default Customerlist;
