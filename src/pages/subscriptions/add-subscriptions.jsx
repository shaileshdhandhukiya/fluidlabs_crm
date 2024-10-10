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
const openModal = () => {
    setShowModal(!showModal);
};
const AddSubscriptions = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        billing_duration: "",
        status: "",
        price: "",
        currency: "",
    });

    const navigate = useNavigate();  // Initialize useNavigate hook

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
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
                "https://phplaravel-1340915-4916922.cloudwaysapps.com/api/subscriptions",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,  // Add the token to the Authorization header
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                alert("subscriptions added successfully!");
                navigate("/subscriptions"); 
            } else {
                alert("Failed to add subscriptions");
            }
        } catch (error) {
            console.error("Error submitting the form:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div>
            <Modal
                title="Add Subscriptions"
                label="Add Subscriptions"
                labelClass="btn-outline-dark"
                uncontrol
            >
                <form onSubmit={handleSubmit}>
                    <div className="lg:grid-cols-1 grid gap-5 grid-cols-1">

                        <div>
                            <Textinput
                                label="Subscription Name"
                                id="name"
                                type="text"
                                placeholder="Hosting"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="billing_duration" className="form-label">Billing Type</label>
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
                            <label htmlFor="status" className="form-label">Status</label>
                            <Select
                                options={[
                                    { label: "Active", value: "active" },
                                    { label: "Inactive", value: "inactive" },
                                ]}
                                styles={styles}
                                className="react-select"
                                classNamePrefix="select"
                                id="status"
                                onChange={handleStatusChange}
                            />
                        </div>
                        <div>
                            <Textinput
                                label="Price"
                                id="price"
                                type="text"
                                placeholder="1000"
                                value={formData.price}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="currency" className="form-label">Currency</label>
                            <Select
                                options={[
                                    { label: "₹ INR", value: "₹" },
                                    { label: "£ Pound", value: "£" },
                                    { label: "$ USD", value: "$" },
                                ]}
                                styles={styles}
                                className="react-select"
                                classNamePrefix="select"
                                id="currency"
                                onChange={handleCurrencyChange}
                            />
                        </div>
                        <div>
                            <Textarea
                                label="Description"
                                placeholder="Description"
                                id="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-1 col-span-1 mt-5 pt-5">
                        <div className="ltr:text-center rtl:text-left">
                            <Button type="submit" className="btn btn-dark text-center">
                                Add Subscription
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>

        </div>
    );
};

export default AddSubscriptions;
