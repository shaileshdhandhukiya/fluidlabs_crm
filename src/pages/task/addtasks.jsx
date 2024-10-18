import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate hook
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import Select, { components } from "react-select";
import Textarea from "@/components/ui/Textarea";
import InputGroup from "@/components/ui/InputGroup";
import Icon from "@/components/ui/Icon";
import axios from "axios";
import Modal from "@/components/ui/Modal";
import Flatpickr from "react-flatpickr";
import Fileinput from "@/components/ui/Fileinput";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

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

const openModal = () => {
    setShowModal(!showModal);
};
const AddTask = () => {
    const [formData, setFormData] = useState({
        subject: "",
        start_date: "",
        due_date: "",
        task_description: "",
        priority: "",
        status: "",
        project_id: "",  // Store the selected customer (only the customer ID)
        assignees: [],
        attach_file:"",   // Store the selected members (array of member IDs)
    });

    const [attach_file, setProfilePhoto] = useState(null);
    const [assignees, setMembers] = useState([]);
    const [picker, setPicker] = useState(new Date());
    const [task_description, setDescription] = useState("");
    const [projects, setProjects] = useState("");
    const navigate = useNavigate();  // Initialize useNavigate hook

    useEffect(() => {
        // Fetch Project from API
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem("auth_token");
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const response = await axios.get(
                    "https://phplaravel-1340915-4916922.cloudwaysapps.com/api/projects",
                    config
                );

                // Accessing the "data" array within the response
                const fetchedData = response.data.data;
                const projectOptions = fetchedData.map((item) => ({
                    label: item.project_name,
                    value: item.id,  // Only store the project ID
                }));
                setProjects(projectOptions);
            } catch (error) {
                console.error("Error fetching Project :", error);
            }
        };

        fetchProjects();
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

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePhoto(file);
            console.log("File  selected:", file);
        } else {
            console.error("No file selected");
        }
    };

    const handleStatusChange = (field, selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: selectedOption.value, // Extract the value for status
        }));
    };

    const handleSelectChange = (field, selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: selectedOption,
        }));
    };
    const handleQuillChange = (content) => {
        setDescription(content); // Update state with Quill content
    };
    const handleDateChange = (field, date) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: date[0].toISOString().split('T')[0], // Convert date to yyyy-MM-dd format
        }));
    };
    const handleProjectChange = (option) => {
        setFormData((prevData) => ({
            ...prevData,
            project_id: option.value, // Only store the project ID, not the label
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
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.post(
                "https://phplaravel-1340915-4916922.cloudwaysapps.com/api/tasks",
                formData,
                config
            );

            if (response.status === 200 || response.status === 201) {
                alert("Task added successfully!");
                navigate("/tasks");
            } else {
                alert("Failed to add task");
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
            <Modal
                title="Add Task"
                label="Add Task"
                labelClass="btn-outline-dark"
                uncontrol
                className="max-w-5xl"
            >
                <form onSubmit={handleSubmit}>
                    <div className="lg:grid-cols-2 grid gap-5 grid-cols-1">

                        <div>
                            <Textinput
                                label="Task Name"
                                id="subject"
                                type="text"
                                placeholder="Project Task"
                                value={formData.subject}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="project" className="form-label">Project</label>
                            <Select
                                options={projects}
                                value={formData.projects}
                                styles={styles}
                                className="react-select"
                                classNamePrefix="select"
                                placeholder="Select Projects"
                                id="projects"
                                onChange={handleProjectChange}
                            />
                            
                        </div>
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
                            <label htmlFor="due_date" className="form-label">End Date</label>
                            <Flatpickr
                                className="form-control py-2"
                                value={picker}
                                onChange={(date) => handleDateChange('due_date', date)}
                                id="due_date"
                            />
                        </div>
                        <div>
                            <label htmlFor="assignees" className="form-label">Task Assigne</label>
                            <Select
                                options={assignees}
                                value={formData.assignees}
                                styles={styles}
                                className="react-select"
                                classNamePrefix="select"
                                isMulti
                                components={{ Option: OptionComponent }}
                                placeholder="Select assignees"
                                id="assignees"
                                onChange={(selectedOption) => handleSelectChange("assignees", selectedOption)}
                            />
                        </div>
                        <div>
                            <label htmlFor="priority" className="form-label">Priority</label>
                            <Select
                                options={[
                                    { label: "Low", value: "low" },
                                    { label: "Medium", value: "medium" },
                                    { label: "High", value: "high" },
                                ]}
                                styles={styles}
                                className="react-select"
                                classNamePrefix="select"
                                placeholder="Select Status"
                                id="priority"
                                onChange={(selectedOption) => handleStatusChange("priority", selectedOption)}
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className="form-label">Status </label>
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
                            <label htmlFor="attach_file" className="form-label">Upload File</label>
                            <Fileinput
                                name="attach_file"
                                id="attach_file"
                                type="file"
                                value={attach_file}
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    <div className="lg:grid-cols-1 grid gap-5 grid-cols-1 mt-2.5">
                        <div className="fromGroup mb-5">
                            <label className="form-label" htmlFor="task_description">Task Description</label>
                            <ReactQuill
                                theme="snow"
                                id="task_description"
                                value={task_description}
                                onChange={handleQuillChange}
                                placeholder="Write project description"
                                modules={modules}  // Add custom toolbar modules here
                                formats={formats}  // Define the formats you want to support
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-1 col-span-1 mt-5 pt-5">
                        <div className="ltr:text-center rtl:text-left">
                            <Button type="submit" className="btn btn-dark text-center">
                                Add Task
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>

        </div>
    );
};

export default AddTask;
