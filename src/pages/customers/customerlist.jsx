import React, { useState, useEffect, useMemo } from "react";
import axios from "axios"; // Import Axios for API calls
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

// Columns definition
const COLUMNS = [
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
    accessor: "subscription_package", // Mapping service package
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
    Cell: () => (
      <div className="flex space-x-3 rtl:space-x-reverse">
        <Tooltip content="View" placement="top" arrow animation="shift-away">
          <button className="action-btn" type="button">
            <Icon icon="heroicons:eye" />
          </button>
        </Tooltip>
        <Tooltip content="Edit" placement="top" arrow animation="shift-away">
          <button className="action-btn" type="button">
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
          <button className="action-btn" type="button">
            <Icon icon="heroicons:trash" />
          </button>
        </Tooltip>
      </div>
    ),
  },
];

// Component to list customers
const Customerlist = ({ title = "Customer List" }) => {
  const [customers, setCustomers] = useState([]); // State to store customer data
  const navigate = useNavigate();
  const columns = useMemo(() => COLUMNS, []);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {

        // Retrieve the auth token (assuming it's stored in localStorage)
        const token = localStorage.getItem('auth_token');

        // Set up the authorization header with Bearer token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Make the API call with the token in the Authorization header
        const response = await axios.get(
          "https://phplaravel-1340915-4916922.cloudwaysapps.com/api/customers",
          config
        );
        
        const fetchedData = response.data.data.data;

        // Mapping API data to table structure
        const mappedData = fetchedData.map((item) => ({
          id: item.id,
          company: item.company,
          customer_name: item.customer_name,
          email: item.email,
          phone: item.phone,
          subscription_package: item.subscription_package,
          status: item.status,
        }));

        setCustomers(mappedData); // Setting mapped data to the state
      } catch (error) {
        console.error("Error fetching customer data", error);
      }
    };

    fetchData();
  }, []);

  const tableInstance = useTable(
    {
      columns,
      data: customers, // Use fetched customer data
    },
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
        {/* Pagination */}
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
              <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
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
