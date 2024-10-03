import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import Fileinput from "@/components/ui/Fileinput";
import Select from "@/components/ui/Select";
import Flatpickr from "react-flatpickr";

const options = [
    {
        value: "male",
        label: "Male",
    },
    {
        value: "female",
        label: "Female",
    }
];

const memberhsipCategory = [
    {
        value: "Weightloss",
        label: "Weight Loss",
    },
    {
        value: "Weightgain",
        label: "Weight Gain",
    }
];

const memberhsipGroup = [
    {
        value: "morning",
        label: "Morning",
    },
    {
        value: "evening",
        label: "Evening",
    }
];

const membership = [
    {
        value: "male",
        label: "Male",
    },
    {
        value: "female",
        label: "Female",
    }
];

const paymentMode = [
    {
        value: "upi",
        label: "UPI",
    },
    {
        value: "cash",
        label: "Cash",
    },
    {
        value: "bank_transfer",
        label: "Bank Transfer",
    }
];

const AddProject = () => {

    const [picker, setPicker] = useState(new Date());
    const [value, setValue] = useState("");

    const [memberhsipCategoryValue, setMemberhsipCategoryValue] = useState("male");
    const [memberhsipGroupValue, setMemberhsipGroupValue] = useState("male");

    const [PaymentMode, setPaymentMode] = useState("");

    const paymentHandleChange = (e) => {
        setValue(e.target.value);
    };

    const handleChange = (e) => {
        setValue(e.target.value);
        setMemberhsipCategoryValue(e.target.memberhsipCategoryValue);
        setMemberhsipGroupValue(e.target.memberhsipGroupValue);
    };

    const [selectedFile2, setSelectedFile2] = useState(null);

    const handleFileChange2 = (e) => {
        setSelectedFile2(e.target.files[0]);
    };

    return (
        <div>

            <form action="" method="post" >

                <Card title="Add Member">

                    <h4 className="card-title mb-5 pb-5"><b>Personal Details</b></h4>

                    <div class="lg:grid-cols-2 grid gap-5 grid-cols-1  ">
                        <div class="fromGroup mb-5">
                            <label for="h_Fullname" class="block capitalize form-label  flex-0 mr-6 md:w-[100px] w-[60px] break-words">Profile Image</label>
                            <div class="relative flex-1">
                                <Fileinput
                                    label="Profile Image"
                                    name="Image"
                                    selectedFile={selectedFile2}
                                    onChange={handleFileChange2}
                                    preview
                                />
                            </div>
                        </div>
                    </div>

                    <div className="lg:grid-cols-2 grid gap-5 grid-cols-1 ">

                        <Textinput
                            label="Full name"
                            id="h_Fullname"
                            type="text"
                            placeholder="Full name"
                        />

                        <Textinput
                            label="Email"
                            id="h_email"
                            type="email"
                            placeholder="Type your email"
                        />

                        <Textinput
                            label="Phone"
                            id="h_phone"
                            type="phone"
                            placeholder="Type your Phone"
                        />

                        <div>
                            <label htmlFor="birthdate-date" className=" form-label">
                                Date of Birth
                            </label>

                            <Flatpickr
                                className="form-control py-2"
                                value={picker}
                                onChange={(date) => setPicker(date)}
                                id="birthdate-date"
                            />
                        </div>

                        <div>
                            <label htmlFor="Joining-date" className=" form-label">
                                Joining Date
                            </label>

                            <Flatpickr
                                className="form-control py-2"
                                value={picker}
                                onChange={(date) => setPicker(date)}
                                id="Joining-date"
                            />
                        </div>

                        <Select
                            label="Member Category"
                            options={memberhsipCategory}
                            onChange={handleChange}
                            value={memberhsipCategoryValue}
                            placeholder="Select Category "
                        />

                        <Select
                            label="Member Group"
                            options={memberhsipGroup}
                            onChange={handleChange}
                            value={memberhsipGroupValue}
                            placeholder="Select group "
                        />

                        <Select
                            label="Gender"
                            options={options}
                            onChange={handleChange}
                            value={value}
                            placeholder="Select Gender"
                        />

                        <Textinput
                            label="Address"
                            id="Address"
                            type="text"
                            placeholder="Address"
                        />

                        <Textinput
                            label="Pin Code"
                            id="pincode"
                            type="tel"
                            placeholder="Pin Code"
                        />

                        <Textinput
                            label="Country"
                            id="country"
                            type="text"
                            placeholder="Country"
                        />


                    </div>


                    <h4 className="card-title mt-5 mb-5 pt-5 pb-5"><b>Membership Details</b></h4>
                    {/* <Card title="Membership Details" className="mt-5"> */}

                    <div className="lg:grid-cols-2 grid gap-5 grid-cols-1 ">

                        <Select
                            label="Membership"
                            options={membership}
                            onChange={handleChange}
                            value={value}
                            placeholder="Select Membership"
                        />

                        <Textinput
                            label="Price"
                            id="price"
                            type="number"
                            placeholder="Enter Price"
                        />

                        <Textinput
                            label="Paid Amount"
                            id="paidPrice"
                            type="number"
                            placeholder="Enter Paid Amount"
                        />

                        <div>
                            <label htmlFor="starting-date" className=" form-label">
                                Starting Date
                            </label>

                            <Flatpickr
                                className="form-control py-2"
                                value={picker}
                                onChange={(date) => setPicker(date)}
                                id="starting-date"
                            />
                        </div>

                        <Select
                            label="Payment Mode"
                            options={paymentMode}
                            onChange={paymentHandleChange}
                            value={value}
                            placeholder="Select"
                        />

                    </div>


                    <div className="lg:col-span-2 col-span-1 mt-5 pt-5">
                        <div className="ltr:text-center rtl:text-left">
                            <button className="btn btn-dark  text-center">Create Member</button>
                        </div>
                    </div>

                </Card>

            </form>

        </div>
    )
}

export default AddProject;