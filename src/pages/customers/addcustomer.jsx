import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import Fileinput from "@/components/ui/Fileinput";
import Select, { components } from "react-select";
import Textarea from "@/components/ui/Textarea";
import InputGroup from "@/components/ui/InputGroup";
import Icon from "@/components/ui/Icon";

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

const AddProject = () => {
    const [formData, setFormData] = useState({
        companyName: "",
        fullName: "",
        phone: "",
        email: "",
        currency: "",
        description: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("https://phplaravel-1340915-4916922.cloudwaysapps.com/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                alert("Customer added successfully!");
                // Reset form fields or perform any necessary actions
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
                                id="companyName"
                                type="text"
                                placeholder="Company name"
                                value={formData.companyName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Textinput
                                label="Full name"
                                id="fullName"
                                type="text"
                                placeholder="Full name"
                                value={formData.fullName}
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
                    </div>
                    <div className="lg:grid-cols-1 grid gap-5 grid-cols-1 mt-2.5 ">
                        <div className="fromGroup mb-5">
                            <Textarea
                                label="Description"
                                placeholder="Address"
                                id="description"
                                value={formData.description}
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
                                id="zipCode"
                                type="text"
                                placeholder="Zip Code"
                                value={formData.zipCode}
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

export default AddProject;
