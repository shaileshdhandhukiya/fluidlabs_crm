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

const AddCustomer = () => {
    const [formData, setFormData] = useState({
        company: "",
        customer_name: "",
        phone: "",
        email: "",
        currency: "",
        office_address: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
        subscription_package: "",
        billing_type: "",
    });

    const navigate = useNavigate();  // Initialize useNavigate hook

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
    };

    const handleCurrencyChange = (selectedOption) => {
        setFormData({
            ...formData,
            currency: selectedOption.value,
        });
    };

    const handleSubscriptionChange = (selectedOption) => {
        setFormData({
            ...formData,
            subscription_package: selectedOption.value,
        });
    };

    const handleBillingChange = (selectedOption) => {
        setFormData({
            ...formData,
            billing_type: selectedOption.value,
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
                "https://phplaravel-1340915-4916922.cloudwaysapps.com/api/customers",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,  // Add the token to the Authorization header
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                alert("Customer added successfully!");
                navigate("/customers");  // Redirect to All Customers page
            } else {
                alert("Failed to add customer");
            }
        } catch (error) {
            console.error("Error submitting the form:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} method="post">
                <Card title="Add new Customers">
                    <div className="lg:grid-cols-2 grid gap-5 grid-cols-1 ">
                        <div>
                            <Textinput
                                label="Company name"
                                id="company"
                                type="text"
                                placeholder="Company name"
                                value={formData.company}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Textinput
                                label="Full name"
                                id="customer_name"
                                type="text"
                                placeholder="Full name"
                                value={formData.customer_name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <InputGroup
                                label="Phone"
                                id="phone"
                                type="phone"
                                placeholder="Type your phone"
                                prepend={<Icon icon="heroicons-outline:phone" />}
                                merged
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
                                merged
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="currency" className="form-label">
                                Currency
                            </label>
                            <Select
                                options={[
                                    { label: "INR ₹", value: "INR" },
                                    { label: "Dollar $", value: "USD" },
                                    { label: "Pound £", value: "GBP" },
                                ]}
                                styles={styles}
                                className="react-select"
                                classNamePrefix="select"
                                id="currency"
                                onChange={handleCurrencyChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="subscription_package" className="form-label">
                                Subscription Package
                            </label>
                            <Select
                                options={[
                                    { label: "Name Of Package", value: "Premium" },
                                    { label: "Name Of Package", value: "Premium" },
                                    { label: "Name Of Package", value: "Premium" },
                                ]}
                                styles={styles}
                                className="react-select"
                                classNamePrefix="select"
                                id="subscription_package"
                                onChange={handleSubscriptionChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="billing_type" className="form-label">
                                Billing Type
                            </label>
                            <Select
                                options={[
                                    { label: "Monthly", value: "monthly" },
                                    { label: "Quarterly", value: "quarterly" },
                                    { label: "Yearly", value: "yearly" },
                                ]}
                                styles={styles}
                                className="react-select"
                                classNamePrefix="select"
                                id="billing_type"
                                onChange={handleBillingChange}
                            />
                        </div>
                    </div>
                    <div className="lg:grid-cols-1 grid gap-5 grid-cols-1 mt-2.5 ">
                        <div className="fromGroup mb-5">
                            <Textarea
                                label="Address"
                                placeholder="Address"
                                id="office_address"
                                value={formData.office_address}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="lg:grid-cols-2 grid gap-5 grid-cols-1 ">
                        <div>
                            <Textinput
                                label="City"
                                id="city"
                                type="text"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Textinput
                                label="State"
                                id="state"
                                type="text"
                                placeholder="State"
                                value={formData.state}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Textinput
                                label="Zip Code"
                                id="zip_code"
                                type="text"
                                placeholder="Zip Code"
                                value={formData.zip_code}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Textinput
                                label="Country"
                                id="country"
                                type="text"
                                placeholder="Country"
                                value={formData.country}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-2 col-span-1 mt-5 pt-5">
                        <div className="ltr:text-center rtl:text-left">
                            <button type="submit" className="btn btn-dark text-center">
                                Add Customer
                            </button>
                        </div>
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default AddCustomer;
