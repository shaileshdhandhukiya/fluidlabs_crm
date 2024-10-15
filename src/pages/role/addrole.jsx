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

const AddRole = () => {
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
                <Card title="Add New Role">
                    <div className="lg:grid-cols-2 grid gap-5 grid-cols-1">

                        <div>
                            <Textinput
                                label="Role Name"
                                id="role_name"
                                type="text"
                                placeholder="Role Name"
                                value={formData.role_name}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-2 col-span-1 mt-5 pt-5">
                        <div className="ltr:text-center rtl:text-left">
                            <Button type="submit" className="btn btn-dark text-center">
                                Add Role
                            </Button>
                        </div>
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default AddRole;
