import React, { useState, useMemo } from "react";
// import { advancedTable } from "../../constant/table-data";
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


import customer1 from "@/assets/images/all-img/customer_1.png";

const advancedTable = [
  {
    id: 1,
    company: "Hitesh",
    customer: {
      name: "Jenny Wilson",
      image: customer1,
    },
    email: "hitesh@fluidlabs.co.uk",
    phone: "7621089799",
    services: "Domain" + " , "+ "Hosting",
    status: 1,
    action: null,
  },
  {
    id: 2,
    company: "School Project",
    customer: {
      name: "Jenny Wilson",
      image: customer1,
    },
    email: "arun@fluidlabs.co.uk",
    phone: "7621089799",
    services: "Domain" + " , "+ "Web",
    status: 1,
    action: null,
  },
  {
    id: 3,
    company: "Lyness",
    customer: {
      name: "Jenny Wilson",
      image: customer1,
    },
    email: "arun@fluidlabs.co.uk",
    phone: "7621089799",
    services: "Domain" + " , "+ "Email",
    status: 1,
    action: null,
  },
  {
    id: 4,
    company: "Fluid Labs",
    customer: {
      name: "Jenny Wilson",
      image: customer1,
    },
    email: "arun@fluidlabs.co.uk",
    phone: "7621089799",
    services: "Domain" + " , "+ "SSL",
    status: 0,
    action: null,
  },
  {
    id: 5,
    company: "Andrew Project",
    customer: {
      name: "Jenny Wilson",
      image: customer1,
    },
    email: "arun@fluidlabs.co.uk",
    phone: "7621089799",
    services: "Domain" + " , "+ "Hosting",
    status: 0,
    action: null,
  }
];

const COLUMNS = [
  {
    Header: "Id",
    accessor: "id",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "Company",
    accessor: "company",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "customer",
    accessor: "customer",
    Cell: (row) => {
      return (
        <div>
          <span className="inline-flex items-center">
            <span className="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none bg-slate-600">
              <img
                src={row?.cell?.value.image}
                alt=""
                className="object-cover w-full h-full rounded-full"
              />
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">
              {row?.cell?.value.name}
            </span>
          </span>
        </div>
      );
    },
  },
  {
    Header: "Primary Email",
    accessor: "email",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "Phone",
    accessor: "phone",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "Services",
    accessor: "services",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "status",
    accessor: "status",
    Cell: (row) => {
      return (
        <Switch
        value={row?.cell?.value} 
        onChange={() => setChecked(!checked)}
      />
      );
    },
  },
  {
    Header: "action",
    accessor: "action",
    Cell: (row) => {
      return (
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
      );
    },
  },
];


const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input
          type="checkbox"
          ref={resolvedRef}
          {...rest}
          className="table-checkbox"
        />
      </>
    );
  }
);

const Customerlist = ({ title = "Customer List" }) => {
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => advancedTable, []);
  const [checked, setChecked] = useState(true);
  const navigate = useNavigate();

  const tableInstance = useTable(
    {
      columns,
      data,
    },

    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,

    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
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
              onClick={() => navigate('/add-customers')}
            />
          </div>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps}
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
                  {...getTableBodyProps}
                >
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()} className="table-td">
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
          <div className=" flex items-center space-x-3 rtl:space-x-reverse">
            <select
              className="form-control py-2 w-max"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 25, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Page{" "}
              <span>
                {pageIndex + 1} of {pageOptions.length}
              </span>
            </span>
          </div>
          <ul className="flex items-center  space-x-3  rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${!canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons:chevron-double-left-solid" />
              </button>
            </li>
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${!canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                Prev
              </button>
            </li>
            {pageOptions.map((page, pageIdx) => (
              <li key={pageIdx}>
                <button
                  href="#"
                  aria-current="page"
                  className={` ${pageIdx === pageIndex
                    ? "bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium "
                    : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  "
                    }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                  onClick={() => gotoPage(pageIdx)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${!canNextPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                Next
              </button>
            </li>
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className={` ${!canNextPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                <Icon icon="heroicons:chevron-double-right-solid" />
              </button>
            </li>
          </ul>
        </div>
        {/*end*/}
      </Card>
    </>
  );
};

export default Customerlist;
