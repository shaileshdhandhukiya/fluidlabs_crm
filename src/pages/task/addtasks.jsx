import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate hook
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import Select from "react-select";
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

const openModal = () => {
    setShowModal(!showModal);
};
const AddTask = () => {
    const [formData, setFormData] = useState({
        project_name: "",
        start_date: "",
        deadline: "",
        description: "",
        status: "",
        customer: "",  // Store the selected customer (only the customer ID)
        members: [],   // Store the selected members (array of member IDs)
    });

    const [profilePhoto, setProfilePhoto] = useState(null);
    const [members, setMembers] = useState([]);
    const [picker, setPicker] = useState(new Date());
    const [description, setDescription] = useState("");

    const navigate = useNavigate();  // Initialize useNavigate hook

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
            console.log("Profile photo selected:", file);
        } else {
            console.error("No file selected");
        }
    };
    const handleBillingChange = (selectedOption) => {
        setFormData({
            ...formData,
            billing_duration: selectedOption.value,
        });
    };
    const handleStatusChange = (selectedOption) => {
        setFormData({
            ...formData,
            status: selectedOption.value,
        });
    };
    const handleCurrencyChange = (selectedOption) => {
        setFormData({
            ...formData,
            currency: selectedOption.value,
        });
    };
    const handleQuillChange = (content) => {
        setDescription(content); // Update state with Quill content
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Get the authentication token from localStorage
        const token = localStorage.getItem("auth_token");

        if (!token) {
            alert("No authentication token found. Please log in.");
            return;
        }

        try {
            const response = await axios.post(
                "https://phplaravel-1340915-4916922.cloudwaysapps.com/api/tasks",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,  // Add the token to the Authorization header
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                alert("Task added successfully!");
                navigate("/tasks"); 
            } else {
                alert("Failed to add Task");
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
            >
                <form onSubmit={handleSubmit}>
                    <div className="lg:grid-cols-1 grid gap-5 grid-cols-1">

                        <div>
                            <Textinput
                                label="Task Name"
                                id="name"
                                type="text"
                                placeholder="Hosting"
                                value={formData.subject}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="billing_duration" className="form-label">Select Project</label>
                            <Select
                                options={[
                                    { label: "Monthly", value: "monthly" },
                                    { label: "Quarterly", value: "quarterly" },
                                    { label: "Yearly", value: "yearly" },
                                ]}
                                styles={styles}
                                className="react-select"
                                classNamePrefix="select"
                                id="billing_duration"
                                onChange={handleBillingChange}
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
                            <label htmlFor="deadline" className="form-label">End Date</label>
                            <Flatpickr
                                className="form-control py-2"
                                value={picker}
                                onChange={(date) => handleDateChange('deadline', date)}
                                id="deadline"
                            />
                        </div>
                        <div>
                            <label htmlFor="members" className="form-label">Task Assigne</label>
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
                        <div>
                            <label htmlFor="status" className="form-label">Status</label>
                            <Select
                                options={[
                                    { label: "Low", value: "low" },
                                    { label: "Medium", value: "medium" },
                                    { label: "High", value: "high" },
                                    { label: "Urgent", value: "urgent" },
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
                            <label htmlFor="status" className="form-label">Priority </label>
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
                            <label htmlFor="profile_photo" className="form-label">Profile Photo</label>
                            <Fileinput
                                name="profile_photo"
                                id="profile_photo"
                                type="file"
                                value={profilePhoto}
                                onChange={handleFileChange}
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
