import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Select, { components } from "react-select";
import Flatpickr from "react-flatpickr";
import ReactQuill from "react-quill";
import axios from "axios";
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import 'flatpickr/dist/themes/material_green.css'; // Import Flatpickr style

const OptionComponent = ({ data, ...props }) => {
  return (
    <components.Option {...props}>
      <span className="flex items-center space-x-4">
        <div className="flex-none">
          <div className="h-7 w-7 rounded-full">
            <img
              src={data.image}
              alt=""
              className="w-full h-full rounded-full"
            />
          </div>
        </div>
        <span className="flex-1">{data.label}</span>
      </span>
    </components.Option>
  );
};

const styles = {
  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, opacity: "0.5" } : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, color: "#626262", paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  },
  option: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
};

// This function ensures date is formatted as "YYYY-MM-DD"
const formatLocalDate = (date) => {
  const tzOffset = date.getTimezoneOffset() * 60000; // Get timezone offset in milliseconds
  const localDate = new Date(date.getTime() - tzOffset); // Adjust for local time
  return localDate.toISOString().split('T')[0]; // Return in YYYY-MM-DD format
};

const EditProject = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    project_name: "",
    start_date: "",
    deadline: "",
    description: "",
    status: "",
    customers: "", // Store as object with label and value
    members: [], // Store as array of objects with label and value
  });

  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [members, setMembers] = useState([]);
  const [description, setDescription] = useState("");
  const [startDatePicker, setStartDatePicker] = useState(new Date());
  const [deadlinePicker, setDeadlinePicker] = useState(new Date());

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(
          "https://phplaravel-1340915-4916922.cloudwaysapps.com/api/customers",
          config
        );

        const fetchedData = response.data.data;
        const customerOptions = fetchedData.map((item) => ({
          label: item.customer_name,
          value: item.id,  // Store the customer ID
        }));
        setCustomers(customerOptions);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(
          "https://phplaravel-1340915-4916922.cloudwaysapps.com/api/users",
          config
        );

        const fetchedData = response.data.data;
        const memberOptions = fetchedData.map((item) => ({
          label: `${item.first_name} ${item.last_name}`, // Combine first and last name
          value: item.id,  // Store the user ID
        }));
        setMembers(memberOptions);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchCustomers();
    fetchMembers();
  }, []);

  useEffect(() => {
    const fetchProjectData = async () => {
      const authToken = localStorage.getItem('auth_token');
      try {
        const projectResponse = await axios.get(`https://phplaravel-1340915-4916922.cloudwaysapps.com/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (projectResponse.data.success) {
          const project = projectResponse.data.data;

          // Ensure dates are properly formatted as valid Date strings
          const formattedStartDate = project.start_date ? new Date(project.start_date) : new Date();
          const formattedDeadline = project.deadline ? new Date(project.deadline) : new Date();

          // Find the customer and members from the existing fetched data
          const selectedCustomer = customers.find(c => c.value === project.customer_id);
          const selectedMembers = project.members.map(memberId => members.find(m => m.value === memberId));

          setFormData({
            project_name: project.project_name || "",
            start_date: formatLocalDate(formattedStartDate),  // Set as formatted string
            deadline: formatLocalDate(formattedDeadline),    // Set as formatted string
            description: project.description || "",
            status: project.status || "",
            customer: selectedCustomer || null,
            members: selectedMembers || [],
          });

          setStartDatePicker(formattedStartDate);  // Set the start date picker correctly
          setDeadlinePicker(formattedDeadline);    // Set the deadline date picker correctly
          setDescription(project.description || "");
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    if (customers.length && members.length) {
      fetchProjectData();
    }
  }, [id, customers, members]);  // Trigger this useEffect only after customers and members have been fetched

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleQuillChange = (content) => {
    setDescription(content);
    setFormData((prevData) => ({
      ...prevData,
      description: content,
    }));
  };

  const handleDateChange = (field, date) => {
    const formattedDate = formatLocalDate(date[0]); // Format the date as "YYYY-MM-DD"
    setFormData((prevData) => ({
      ...prevData,
      [field]: formattedDate,
    }));
  };

  const handleSelectChange = (field, selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: selectedOption,  // Store entire object (label and value)
    }));
  };

  const handleStatusChange = (field, selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: selectedOption.value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem('auth_token');

    try {
      const response = await axios.put(
        `https://phplaravel-1340915-4916922.cloudwaysapps.com/api/projects/${id}`,
        {
          ...formData,
          customer_id: formData.customer?.value,  // Only send the customer ID to the API
          members: formData.members.map(m => m.value),  // Send an array of member IDs
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success) {
        alert("Project updated successfully!");
        navigate('/projects');
      } else {
        console.error("Failed to update Project:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating Project:", error);
    }
  };

  const modules = {
    toolbar: [
      [{ 'font': [] }, { 'size': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  const formats = [
    'font', 'size', 'bold', 'italic', 'underline', 'strike', 'color', 'background',
    'script', 'header', 'blockquote', 'code-block', 'list', 'bullet', 'align', 'link', 'image', 'video'
  ];

  return (
    <div>
      <form method="post" onSubmit={handleFormSubmit}>
        <Card title="Edit Project">
          <div className="lg:grid-cols-1 grid gap-5 grid-cols-1">
            <div className="fromGroup mb-5">
              <label htmlFor="project_name" className="block capitalize form-label">Project Name</label>
              <input
                id="project_name"
                type="text"
                placeholder="Project Name"
                value={formData.project_name}
                onChange={handleInputChange}
                className="form-control py-2"
              />
            </div>
          </div>

          <div className="lg:grid-cols-2 grid gap-5 grid-cols-1">
            <div>
              <label htmlFor="start_date" className="form-label">Start Date</label>
              <Flatpickr
                className="form-control py-2"
                value={startDatePicker}
                onChange={(date) => {
                  handleDateChange('start_date', date);
                  setStartDatePicker(date); // Update the local state for the picker
                }}
                id="start_date"
              />
            </div>
            <div>
              <label htmlFor="deadline" className="form-label">End Date</label>
              <Flatpickr
                className="form-control py-2"
                value={deadlinePicker}
                onChange={(date) => {
                  handleDateChange('deadline', date);
                  setDeadlinePicker(date); // Update the local state for the picker
                }}
                id="deadline"
              />
            </div>

            <div>
              <label htmlFor="customer" className="form-label">Customer</label>
              <Select
                options={customers}
                value={formData.customer}  // Set the selected customer object
                styles={styles}
                className="react-select"
                classNamePrefix="select"
                placeholder="Select Customer"
                id="customer"
                onChange={(selectedOption) => handleSelectChange("customer", selectedOption)}
              />
            </div>

            <div>
              <label htmlFor="status" className="form-label">Status</label>
              <Select
                options={[
                  { label: "in progress", value: "in progress" },
                  { label: "not started", value: "not started" },
                  { label: "on hold", value: "on hold" },
                  { label: "cancelled", value: "cancelled" },
                  { label: "delivered", value: "delivered" },
                ]}
                value={{ label: formData.status, value: formData.status }}
                styles={styles}
                className="react-select"
                classNamePrefix="select"
                placeholder="Select Status"
                id="status"
                onChange={(selectedOption) => handleStatusChange("status", selectedOption)}
              />
            </div>

            <div>
              <label htmlFor="members" className="form-label">Members</label>
              <Select
                options={members}
                value={formData.members}  // Set the selected members objects
                styles={styles}
                className="react-select"
                classNamePrefix="select"
                isMulti
                components={{ Option: OptionComponent }}
                placeholder="Select Members"
                id="members"
                onChange={(selectedOption) => handleSelectChange("members", selectedOption)}
              />
            </div>
          </div>

          <div className="lg:grid-cols-1 grid gap-5 grid-cols-1 mt-2.5">
            <div className="fromGroup mb-5">
              <label className="form-label" htmlFor="description">Project Description</label>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={handleQuillChange}
                placeholder="Write project description"
                modules={modules}
                formats={formats}
              />
            </div>
          </div>

          <div className="lg:col-span-2 col-span-1 mt-5 pt-5">
            <div className="ltr:text-center rtl:text-left">
              <button className="btn btn-dark text-center">Update Project</button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default EditProject;
