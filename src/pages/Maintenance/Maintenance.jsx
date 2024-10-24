import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRequest, postRequest, putRequest, deleteRequest } from "../../utils/apiHelper";
import Flatpickr from "react-flatpickr";
import InputGroup from "@/components/ui/InputGroup";
import axios from "axios";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import { useTable, useRowSelect, useSortBy, useGlobalFilter, usePagination } from "react-table";
import GlobalFilter from "../table/react-tables/GlobalFilter";
import { toast } from "react-toastify";




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

const Maintenance = ({ title = "Maintenance List" }) => {


  const COLUMNS = [
    {
      Header: "ID",
      accessor: "id",
      Cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      Header: "Customer Name",
      accessor: "customer.customer_name", // Accessing nested 'customer_name' field
      Cell: (row) => <span>{row?.cell?.value}</span>,
    },
    {
      Header: "Company Name",
      accessor: "customer.company", // Accessing nested 'company' field
      Cell: (row) => <span>{row?.cell?.value}</span>,
    },
    {
      Header: "Email",
      accessor: "email", // This is directly in the data object
      Cell: (row) => <span>{row?.cell?.value}</span>,
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: (row) => <span>{row?.cell?.value}</span>,
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row: { original } }) => (
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Tooltip content="Edit" placement="top" arrow animation="shift-away">
            <button onClick={() => handleEdit(original)} className=" action-btn text-blue-600 hover:underline">
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
            <button onClick={() => openDeleteModal(original)} className="action-btn text-red-600 hover:underline">
              <Icon icon="heroicons:trash" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [data, setData] = useState([]);
  const [activeModal, setActiveModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteData, setDeleteData] = useState(null); 
  const [formValues, setFormValues] = useState({
    customer_id: '',
    web_link: "",
    email: "",
    onboard_date: "",
    billing_type: "",
    currency: "",
    status: "",
    description: "",
  });


  const handleEdit = (editformdata) => {
    console.log("edit data->>", editformdata);

    setFormValues(editformdata);
    setEditMode(true);
    setActiveModal(true);
  };


  // Fetch customers and set to state
  const fetchCustomers = async () => {
    try {
      const response = await getRequest("/api/customers"); // Adjust API endpoint if needed
      if (response.success) {
        const customerOptions = response.data.map(customer => ({
          value: customer.id,
          label: customer.customer_name, // Assuming customer_name is the field you want to display
        }));
        setCustomers(customerOptions);

        console.log(customerOptions);

      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchMaintenances = async () => {

    setLoading(true);

    try {
      const response = await getRequest('/api/maintenances');
      if (response.success) {
        setData(response.data);
      }

    } catch (error) {

      console.error("Error fetching data:", error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchMaintenances();
    fetchCustomers();
  }, []);


  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      let response;

      setActiveModal(false);

      if (editMode) {
        response = await putRequest("/api/maintenances/" + `${formValues.id}`, formValues, config);
      } else {
        response = await postRequest("/api/maintenances", formValues, config);
      }

      if (response.success) {

        toast.success("Added Successfully!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setEditMode(false);

        fetchMaintenances();
      }
    } catch (error) {
      console.error("Error saving maintenance", error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues({ ...formValues, [id]: value });
  };

  const openDeleteModal = (maintananceData) => {
    setDeleteData(maintananceData);
    setDeleteModal(true);
  };

  const handleDelete = async (maintananceData) => {
    try {
      const token = localStorage.getItem("auth_token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await deleteRequest(`/api/maintenances/${deleteData.id}`, { formValues }, config);
      if (response.success) {

        toast.success("Deleted successful!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        fetchMaintenances();
        setDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting maintenance:", error);
    }
  };

  const columns = useMemo(() => COLUMNS, []);

  const tableInstance = useTable(
    {
      columns,
      data,
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
              text={editMode ? "Edit Maintenance" : "Add Maintenance"}
              className="btn-dark text-sm ml-5"
              onClick={() => {
                setActiveModal(true);
                if (!editMode) {
                  setEditMode(false);
                }
              }}
            />

            <Modal
              activeModal={activeModal}
              title="Add Maintenance"
              label="Add Maintenance"
              labelClass="bg-slate-800 dark:hover:bg-opacity-70 h-min text-sm font-medium text-slate-50 hover:ring-2 hover:ring-opacity-80 ring-slate-900 hover:ring-offset-1 btn-lg dark:hover:ring-0 dark:hover:ring-offset-0 ml-5"
              // uncontrol
              centered
              onClose={() => {
                setActiveModal(false);
                setEditMode(false);
              }}
              footerContent={
                <Button text="Submit" className="btn-dark" onClick={handleSubmit} />
              }
            >
              <Textinput
                label="Web Link"
                id="web_link"
                type="text"
                placeholder="Enter Web Link"
                value={formValues.web_link}
                onChange={handleChange}
                horizontal
              />
              <br />
              <Select
                label="Customer"
                options={customers.map((customer) => ({
                  value: customer.value,
                  label: customer.label,
                }))}
                value={formValues.customer_id} // Bind to formValues
                onChange={handleChange} // Update formValues.customer_id
                placeholder="Select Customer"
                id="customer_id"
                horizontal
              />

              <br />
              <Textinput
                label="Email"
                id="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="Type your email"
                horizontal
              />
              <br />
              <Textinput
                label="currency"
                id="currency"
                type="text"
                value={formValues.currency}
                onChange={handleChange}
                placeholder="Enter currency"
                horizontal
              />
              <br />
              <Textinput
                label="Onboard Date *"
                id="onboard_date"
                type="date"
                placeholder="Select Date"
                value={formValues.onboard_date}
                onChange={handleChange}
                required
                horizontal
              />
              <br />
              <Select
                label="Billing Type"
                options={[
                  {
                    value: "monthly",
                    label: "Monthly",
                  },
                  {
                    value: "quarterly",
                    label: "Quarterly",
                  },
                  {
                    value: "half-yearly",
                    label: "SemiAnnual",
                  },
                  {
                    value: "yearly",
                    label: "Yearly",
                  }
                ]}
                onChange={handleChange}
                placeholder="Select Billing Type"
                horizontal
                id="billing_type"
              />
              <br />
              <Select
                label="Status"
                options={[
                  {
                    value: "active",
                    label: "Active",
                  },
                  {
                    value: "inactive",
                    label: "Inactive",
                  }
                ]}
                onChange={handleChange}
                value={formValues.status}
                placeholder="Select Status"
                horizontal
                id="status"
              />
              <br />
              <InputGroup
                label="description"
                id="description"
                type="text"
                placeholder="Enter Description"
                className="h-[52px]"
                value={formValues.description}
                onChange={handleChange}
                horizontal
              />
            </Modal>


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

        <Modal
          activeModal={deleteModal}
          title="Delete Confirmation"
          onClose={() => setDeleteModal(false)}
          footerContent={
            <Button text="Confirm Delete" className="btn-danger" onClick={handleDelete} />
          }
        >
          <p>Are you sure you want to delete this maintenance entry?</p>
        </Modal>

      </Card>
    </>
  );
};

export default Maintenance;
