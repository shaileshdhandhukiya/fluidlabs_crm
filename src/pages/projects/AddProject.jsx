import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import Fileinput from "@/components/ui/Fileinput";
import Select, { components } from "react-select";
import Flatpickr from "react-flatpickr";
import avatar1 from "@/assets/images/avatar/av-1.svg";
import avatar2 from "@/assets/images/avatar/av-2.svg";
import avatar3 from "@/assets/images/avatar/av-3.svg";
import Textarea from "@/components/ui/Textarea";



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

const OptionComponent = ({ data, ...props }) => {
    //const Icon = data.icon;

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

                <Card title="Add new project">
                    <div class="lg:grid-cols-1 grid gap-5 grid-cols-1  ">
                        <div class="fromGroup mb-5">
                            <Textinput
                                label="Project name"
                                id="h_proname"
                                type="text"
                                placeholder="Project name"
                            />
                        </div>
                    </div>

                    <div className="lg:grid-cols-2 grid gap-5 grid-cols-1 ">

                        <div>
                            <label htmlFor="birthdate-date" className=" form-label">
                                Start Date
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
                                End Date
                            </label>

                            <Flatpickr
                                className="form-control py-2"
                                value={picker}
                                onChange={(date) => setPicker(date)}
                                id="Joining-date"
                            />
                        </div>

                        <div>
                            <label htmlFor="customer" className=" form-label">
                                Customer
                            </label>
                            <Select
                                options={[
                                    { label: "Customer 1", value: "basic" },
                                    { label: "Customer 2", value: "premium" },
                                    { label: "Customer 3", value: "vip" },
                                    { label: "Customer 4", value: "gold" }
                                ]}
                                styles={styles}
                                className="react-select"
                                classNamePrefix="select"
                                placeholder="Select Customer"
                                id="customer"
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className=" form-label">
                                Status
                            </label>
                            <Select
                                options={[
                                    { label: "Not Started", value: "basic" },
                                    { label: "In Progress", value: "premium" },
                                    { label: "On hold", value: "vip" },
                                    { label: "Cancelled", value: "gold" },
                                    { label: "Finished", value: "gold2" }
                                ]}
                                styles={styles}
                                className="react-select"
                                classNamePrefix="select"
                                placeholder="Select Status"
                                id="status"
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className=" form-label">
                                Members
                            </label>
                            <Select
                                options={[
                                    { label: "Hitesh Y", value: "basic", image: avatar1 },
                                    { label: "Shailesh D", value: "premium", image: avatar2 },
                                    { label: "John Doe", value: "vip", image: avatar3 }
                                ]}
                                styles={styles}
                                className="react-select"
                                classNamePrefix="select"
                                isMulti
                                components={{
                                    Option: OptionComponent,
                                }}
                                id="status"
                            />
                        </div>
                        <div></div>
                        <div>
                            <label htmlFor="status" className=" form-label">
                                Tags
                            </label>
                            <Select
                                styles={styles}
                                options={[
                                    { label: "Team", value: "basic" },
                                    { label: "Angular", value: "premium" },
                                    { label: "React", value: "vip" }
                                ]}
                                className="react-select"
                                classNamePrefix="select"
                                isMulti
                                id="icon_s"
                            />
                        </div>
                    </div>
                    <div class="lg:grid-cols-1 grid gap-5 grid-cols-1 mt-2.5 ">
                        <div class="fromGroup mb-5">
                            <Textarea label="Description" placeholder="Description" />
                        </div>
                    </div>

                    <div className="lg:col-span-2 col-span-1 mt-5 pt-5">
                        <div className="ltr:text-center rtl:text-left">
                            <button className="btn btn-dark  text-center">Add Project</button>
                        </div>
                    </div>

                </Card>

            </form>

        </div>
    )
}

export default AddProject;