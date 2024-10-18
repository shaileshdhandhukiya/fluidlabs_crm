import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import Select, { components } from "react-select";
import Flatpickr from "react-flatpickr";
import ReactQuill from "react-quill";
import axios from "axios";
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation

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
    option: (provided, state) => ({
        ...provided,
        fontSize: "14px",
    }),
};
const getImageUrl = (imagePath) => {
    return `https://phplaravel-1340915-4916922.cloudwaysapps.com/storage/uploads/${imagePath}`;
};
const OptionComponent = ({ data, ...props }) => {
    return (
        <components.Option {...props}>
            <span className="flex items-center space-x-4">
                <div className="flex-none">
                    <div className="h-7 w-7 rounded-full">
                        <img
                            src={getImageUrl(data.profile_photo)}
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

const AddProject = () => {
    const navigate = useNavigate();  // Initialize the navigate function

    const [formData, setFormData] = useState({
        project_name: "",
        start_date: "",
        deadline: "",
        description: "",
        status: "",
        customer: "",  // Store the selected customer (only the customer ID)
        members: [],   // Store the selected members (array of member IDs)
    });

    const [customers, setCustomers] = useState([]);
    const [members, setMembers] = useState([]);
    const [picker, setPicker] = useState(new Date());
    const [description, setDescription] = useState("");

    useEffect(() => {
        // Fetch customers from API
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

                // Accessing the "data" array within the response
                const fetchedData = response.data.data;
                const customerOptions = fetchedData.map((item) => ({
                    label: item.customer_name,
                    value: item.id,  // Only store the customer ID
                }));
                setCustomers(customerOptions);
            } catch (error) {
                console.error("Error fetching customers:", error);
            }
        };

        fetchCustomers();
    }, []);

    useEffect(() => {
        // Fetch users from API
        const fetchUsers = async () => {
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
                const usersOptions = fetchedData.map((item) => ({
                    label: `${item.first_name} ${item.last_name}`, // Combine first and last name
                    value: item.id,  // Only store the user ID
                    profile_photo: item.profile_photo,
                }));
                setMembers(usersOptions);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleQuillChange = (content) => {
        setDescription(content); // Update state with Quill content
    };

    const handleDateChange = (field, date) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: date[0].toISOString().split('T')[0], // Convert date to yyyy-MM-dd format
        }));
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSelectChange = (field, selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: selectedOption,
        }));
    };

    const handleStatusChange = (field, selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: selectedOption.value, // Extract the value for status
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("auth_token");

        if (!token) {
            alert("No authentication token found. Please log in.");
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            const response = await axios.post(
                "https://phplaravel-1340915-4916922.cloudwaysapps.com/api/projects",
                {
                    project_name: formData.project_name,
                    start_date: formData.start_date,
                    deadline: formData.deadline,
                    description: description,  // Include description separately
                    status: formData.status,
                    customer_id: formData.customer.value,  // Extract customer ID directly
                    members: formData.members.map((user) => user.value),  // Use members directly as array of IDs
                },
                config
            );

            if (response.status === 200 || response.status === 201) {
                alert("Project added successfully!");
                navigate("/projects");  // Navigate after success
            } else {
                alert("Failed to add project");
            }
        } catch (error) {
            console.error("Error submitting the form:", error);
            alert("An error occurred. Please try again.");
        }
    };
    const modules = {
        toolbar: [
            [{ 'font': [] }, { 'size': [] }], // Font and Size
            ['bold', 'italic', 'underline', 'strike'], // Bold, Italic, Underline, Strikethrough
            [{ 'color': [] }, { 'background': [] }], // Font color and background color
            [{ 'script': 'sub' }, { 'script': 'super' }], // Subscript / Superscript
            [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block'], // Headers, Blockquote, Code Block
            [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Ordered and Bullet Lists
            [{ 'align': [] }], // Text alignment (left, center, right, justify)
            ['link', 'image', 'video'], // Links, Images, Videos
            ['clean'] // Remove all formatting
        ]
    };

    const formats = [
        'font', 'size', 'bold', 'italic', 'underline', 'strike', 'color', 'background',
        'script', 'header', 'blockquote', 'code-block', 'list', 'bullet', 'align', 'link', 'image', 'video'
    ];
    return (
        <div>
            <form method="post" onSubmit={handleSubmit}>
                <Card title="Add new project">
                    <div className="lg:grid-cols-1 grid gap-5 grid-cols-1">
                        <div className="fromGroup mb-5">
                            <Textinput
                                label="Project name"
                                id="project_name"
                                type="text"
                                placeholder="Project name"
                                value={formData.project_name}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="lg:grid-cols-2 grid gap-5 grid-cols-1">
                        <div>
                            <label htmlFor="start_date" className="form-label">Start Date</label>
                            <Flatpickr
                                className="form-control py-2"
                                value={picker}
                                onChange={(date) => handleDateChange('start_date', date)}
                                id="start_date"
                            />
                        </div>
                        <div>
                            <label htmlFor="deadline" className="form-label">End Date</label>
                            <Flatpickr
                                className="form-control py-2"
                                value={picker}
                                onChange={(date) => handleDateChange('deadline', date)}
                                id="deadline"
                            />
                        </div>

                        <div>
                            <label htmlFor="customer" className="form-label">Customer</label>
                            <Select
                                options={customers}
                                value={formData.customer}
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
                                value={formData.members}
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
                                modules={modules}  // Add custom toolbar modules here
                                formats={formats}  // Define the formats you want to support
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-2 col-span-1 mt-5 pt-5">
                        <div className="ltr:text-center rtl:text-left">
                            <button className="btn btn-dark text-center">Add Project</button>
                        </div>
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default AddProject;
