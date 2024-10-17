import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import Select from "react-select";
import InputGroup from "@/components/ui/InputGroup";
import Icon from "@/components/ui/Icon";
import Flatpickr from "react-flatpickr";
import { format } from 'date-fns';
import Fileinput from "@/components/ui/Fileinput";
import axios from "axios";
import { toast } from "react-toastify";
import { getRequest, postRequest, putRequest } from "../../utils/apiHelper"; // Import putRequest

const styles = {
    multiValue: (base, state) => (state.data.isFixed ? { ...base, opacity: "0.5" } : base),
    multiValueLabel: (base, state) => (state.data.isFixed ? { ...base, color: "#626262", paddingRight: 6 } : base),
    multiValueRemove: (base, state) => (state.data.isFixed ? { ...base, display: "none" } : base),
    option: (provided) => ({ ...provided, fontSize: "14px" }),
};

const AddUser = ({ user }) => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        date_of_birth: "",
        date_of_join: "",
        type: "",
        designation: "",
        roles: "",
        password: "",
    });

    const [profilePhoto, setProfilePhoto] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem("auth_token");

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await getRequest('/api/users-create');
                const rolesData = response.data;
                const roleOptions = Object.keys(rolesData).map(key => ({
                    label: rolesData[key],
                    value: key,
                }));
                setRoles(roleOptions);
            } catch (error) {
                console.error("Error fetching roles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();

        // If user prop is provided, set the form data for editing
        if (user) {
            setFormData({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                phone: user.phone || "",
                email: user.email || "",
                date_of_birth: user.date_of_birth || "",
                date_of_join: user.date_of_join || "",
                type: user.type || "",
                designation: user.designation || "",
                roles: user.roles || "",
                password: "", // Keep password empty for editing
            });
            setProfilePhoto(user.profile_photo || null); // Set the profile photo if it exists
        }
    }, [user, token]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleDateChange = (field, date) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: format(date[0], 'yyyy-MM-dd'),
        }));
    };

    const handleRoleChange = (selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            roles: selectedOption.value,
        }));
    };

    const handleTypeChange = (selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            type: selectedOption.value,
        }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            alert("No authentication token found. Please log in.");
            return;
        }

        const formDataToSubmit = new FormData();

        // Append other form data
        formDataToSubmit.append("first_name", formData.first_name);
        formDataToSubmit.append("last_name", formData.last_name);
        formDataToSubmit.append("phone", formData.phone);
        formDataToSubmit.append("email", formData.email);
        formDataToSubmit.append("date_of_birth", formData.date_of_birth);
        formDataToSubmit.append("date_of_join", formData.date_of_join);
        formDataToSubmit.append("type", formData.type);
        formDataToSubmit.append("designation", formData.designation);
        formDataToSubmit.append("roles", formData.roles);
        formDataToSubmit.append("password", formData.password);
        // Password is kept empty on edit, but you may choose to allow changing it

        // Append the profile photo if available and is a File object
        if (profilePhoto instanceof File) {
            console.log("file append");            
            formDataToSubmit.append("profile_photo", profilePhoto);
        } else {
            console.error("Profile photo is not a valid File object");
        }

        // Debugging log to see the FormData content
        for (let pair of formDataToSubmit.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        try {
            let response;
            // Check if it's an edit or an add
            if (user && user.id) {
                // Edit user
                response = await putRequest(`/api/users/${user.id}`, formDataToSubmit, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                });
            } else {
                // Add user
                response = await postRequest("/api/users", formDataToSubmit, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                });
            }

            if (response.status === 200 || response.status === 201) {
                toast.success(user ? "User updated successfully!" : "User added successfully!", {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                navigate("/users");
            } else {
                toast.warning("Failed to submit user data", {
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
            if (error.response) {
                console.error("Server responded with an error:", error.response);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Error submitting the form:", error.message);
            }
            alert("An error occurred. Please check the console for details.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <Card title={user ? "Edit User" : "Add New Employee"}>
                    <div className="lg:grid-cols-2 grid gap-5 grid-cols-1">
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
                        <div>
                            <Textinput
                                label="First Name"
                                id="first_name"
                                type="text"
                                placeholder="John"
                                value={formData.first_name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Textinput
                                label="Last Name"
                                id="last_name"
                                type="text"
                                placeholder="Doe"
                                value={formData.last_name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <InputGroup
                                label="Phone"
                                id="phone"
                                type="text"
                                placeholder="Type your phone"
                                prepend={<Icon icon="heroicons-outline:phone" />}
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <InputGroup
                                label="Email"
                                id="email"
                                type="email"
                                placeholder="Type your email"
                                prepend={<Icon icon="heroicons-outline:mail" />}
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="date_of_birth" className="form-label">Date of Birth</label>
                            <Flatpickr
                                className="form-control py-2"
                                value={formData.date_of_birth}
                                onChange={(date) => handleDateChange('date_of_birth', date)}
                                id="date_of_birth"
                            />
                        </div>
                        <div>
                            <label htmlFor="date_of_join" className="form-label">Date of Joining</label>
                            <Flatpickr
                                className="form-control py-2"
                                value={formData.date_of_join}
                                onChange={(date) => handleDateChange('date_of_join', date)}
                                id="date_of_join"
                            />
                        </div>
                        <div>
                            <label htmlFor="type" className="form-label">Type</label>
                            <Select
                                options={[
                                    { label: "Full Time", value: "Full-Time" },
                                    { label: "Part Time", value: "Part-Time" },
                                    { label: "Freelancers", value: "Freelancers" },
                                    { label: "Contractual", value: "Contractual" },
                                ]}
                                styles={styles}
                                className="react-select"
                                classNamePrefix="select"
                                id="type"
                                onChange={handleTypeChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="roles" className="form-label">Role</label>
                            <Select
                                options={roles}
                                styles={styles}
                                className="react-select"
                                classNamePrefix="select"
                                id="roles"
                                onChange={handleRoleChange}
                                isLoading={loading}
                                placeholder="Select a role"
                            />
                        </div>
                        <div>
                            <Textinput
                                label="Designation"
                                id="designation"
                                type="text"
                                placeholder="Manager"
                                value={formData.designation}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <InputGroup
                                label="Password"
                                id="password"
                                type="password"
                                placeholder="Type your password"
                                prepend={<Icon icon="heroicons-outline:lock-closed" />}
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="ltr:text-right rtl:text-left">
                        <Button text={user ? "Update User" : "Add User"} type="submit" className="btn-dark mt-6" />
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default AddUser;
