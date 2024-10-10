import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import Select from "react-select";
import InputGroup from "@/components/ui/InputGroup";
import Icon from "@/components/ui/Icon";
import axios from "axios";
import Flatpickr from "react-flatpickr";
import { format } from 'date-fns';
import Fileinput from "@/components/ui/Fileinput";


const styles = {
    multiValue: (base, state) => (state.data.isFixed ? { ...base, opacity: "0.5" } : base),
    multiValueLabel: (base, state) => (state.data.isFixed ? { ...base, color: "#626262", paddingRight: 6 } : base),
    multiValueRemove: (base, state) => (state.data.isFixed ? { ...base, display: "none" } : base),
    option: (provided) => ({ ...provided, fontSize: "14px" }),
};

const AddUser = () => {
    const [formData, setFormData] = useState({
        profile_photo: "",
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
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem("auth_token");

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('https://phplaravel-1340915-4916922.cloudwaysapps.com/api/users-create', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const rolesData = response.data.data;
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
    }, [token]);

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
            [field]: format(date[0], 'yyyy-MM-dd'), // Set the selected date
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        if (!token) {
            alert("No authentication token found. Please log in.");
            return;
        }

        try {
            const response = await axios.post(
                "https://phplaravel-1340915-4916922.cloudwaysapps.com/api/users",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                alert("User added successfully!");
                navigate("/users");
            } else {
                alert("Failed to add user");
            }
        } catch (error) {
            console.error("Error submitting the form:", error);
            alert("An error occurred. Please try again.");
        }
    };
    const [selectedFile, setSelectedFile] = useState(null);
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };
    
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Card title="Add New Employee">
                    <div className="lg:grid-cols-2 grid gap-5 grid-cols-1">
                        <div>
                            <label htmlFor="profile_photo" className="form-label">Profile Photo</label>
                            <Fileinput
                                name="profile_photo"
                                id="profile_photo"
                                selectedFile={selectedFile}
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
                            <Textinput
                                label="Password"
                                id="password"
                                type="password"
                                placeholder="ABC@123"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-2 col-span-1 mt-5 pt-5">
                        <div className="ltr:text-center rtl:text-left">
                            <Button type="submit" className="btn btn-dark text-center">
                                Add Employee
                            </Button>
                        </div>
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default AddUser;
