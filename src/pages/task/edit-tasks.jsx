import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";  // Import useNavigate hook
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
const formatLocalDate = (date) => {
    const tzOffset = date.getTimezoneOffset() * 60000; // Get timezone offset in milliseconds
    const localDate = new Date(date.getTime() - tzOffset); // Adjust for local time
    return localDate.toISOString().split('T')[0]; // Return in YYYY-MM-DD format
};
const EditTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        subject: "",
        start_date: "",
        due_date: "",
        task_description: "",
        priority: "",
        status: "",
        project_id: "",
        assignees: [],
        attach_file: "",
    });
    const [assignees, setMembers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [task_description, setDescription] = useState("");
    const [picker, setPicker] = useState(new Date());

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const token = localStorage.getItem("auth_token");

                // Fetch projects and users concurrently
                const [projectsResponse, usersResponse] = await Promise.all([
                    axios.get("https://phplaravel-1340915-4916922.cloudwaysapps.com/api/projects", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("https://phplaravel-1340915-4916922.cloudwaysapps.com/api/users", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                // Set projects and members state
                const projectData = projectsResponse.data.data.map((project) => ({
                    label: project.project_name,
                    value: project.id,
                }));
                setProjects(projectData);

                const userData = usersResponse.data.data.map((user) => ({
                    label: `${user.first_name} ${user.last_name}`,
                    value: user.id,
                    profile_photo: user.profile_photo,
                }));
                setMembers(userData);

                // Fetch task data once projects and members are set
                await fetchTaskData(projectData, userData);
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };

        const fetchTaskData = async (projectData, userData) => {
            try {
                const token = localStorage.getItem("auth_token");
                const response = await axios.get(
                    `https://phplaravel-1340915-4916922.cloudwaysapps.com/api/tasks/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const task = response.data.data;

                const mappedAssignees = task.assignees.map((assigneeId) =>
                    userData.find((user) => user.value === assigneeId)
                ).filter(Boolean);

                setFormData({
                    subject: task.subject,
                    start_date: new Date(task.start_date),
                    due_date: new Date(task.due_date),
                    task_description: task.task_description,
                    priority: task.priority,
                    status: task.status,
                    project_id: task.project_id,
                    assignees: task.assignees,
                    attach_file: getImageUrl(task.attach_file),

                });
                setDescription(task.task_description);
            } catch (error) {
                console.error("Error fetching task data:", error);
            }
        };

        fetchInitialData();
    }, [id]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [id]: value }));
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({ ...prevData, attach_file: file }));
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
            [field]: selectedOption ? selectedOption.value : "", // Store only the value
        }));
    };
    const handleMultiSelectChange = (field, selectedOptions) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: selectedOptions.map(option => option.value), // Store only the IDs
        }));
    };
    
    const handleQuillChange = (content) => {
        setDescription(content); // Update state with Quill content
    };
    const handleDateChange = (field, date) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: date[0],
        }));
    };
    const handleProjectChange = (option) => {
        const formattedDate = formatLocalDate(date[0]);
        setFormData((prevData) => ({
            ...prevData,
            project_id: option.value, // Only store the project ID, not the label
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("auth_token");

        try {
            const response = await axios.put(
                `https://phplaravel-1340915-4916922.cloudwaysapps.com/api/tasks/${id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                alert("Task updated successfully!");
                navigate("/tasks");
            } else {
                console.error("Failed to update task:", response.data.message);
            }
        } catch (error) {
            console.error("Error updating task:", error);
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
            <Card title="Edit Task">
                <form onSubmit={handleSubmit}>
                    <div className="lg:grid-cols-2 grid gap-5 grid-cols-1">

                        <div>
                            <label htmlFor="project_name" className="block capitalize form-label">Task Name</label>
                            <input
                                id="subject"
                                type="text"
                                placeholder="Task Name"
                                value={formData.subject}
                                onChange={handleInputChange}
                                className="form-control py-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="project" className="form-label">Project</label>
                            <Select
                                options={projects}
                                value={projects.find(proj => proj.value === formData.project_id) || null} // Find the matching project by ID
                                styles={styles}
                                className="react-select"
                                classNamePrefix="select"
                                placeholder="Select Project"
                                onChange={(option) => handleSelectChange("project_id", option)}
                            />

                        </div>
                        <div>
                            <label htmlFor="start_date" className="form-label">Start Date</label>
                            <Flatpickr
                                className="form-control py-2"
                                value={formData.start_date}
                                onChange={(date) => handleDateChange("start_date", date)}
                                id="start_date"
                            />
                        </div>
                        <div>
                            <label htmlFor="due_date" className="form-label">End Date</label>
                            <Flatpickr
                                className="form-control py-2"
                                value={formData.due_date}
                                onChange={(date) => handleDateChange("due_date", date)}
                                id="due_date"
                            />
                        </div>
                        <div>
                            <label htmlFor="assignees" className="form-label">Task Assigne</label>
                            <Select
                                options={assignees} // Options contain full user objects
                                value={assignees.filter(member => formData.assignees.includes(member.value))} // Match IDs to objects
                                styles={styles}
                                className="react-select"
                                classNamePrefix="select"
                                isMulti
                                components={{ Option: OptionComponent }}
                                placeholder="Select Assignees"
                                onChange={(selectedOptions) => handleMultiSelectChange("assignees", selectedOptions)}
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
                                value={{ label: formData.priority, value: formData.priority }}
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
                            <label htmlFor="attach_file" className="form-label">Upload File</label>
                            <Fileinput
                                name="attach_file"
                                id="attach_file"
                                type="file"
                                value={formData.attach_file}
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
                                Update Task
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>

        </div>
    );
};

export default EditTask;
