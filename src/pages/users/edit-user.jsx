import React, { Fragment, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import { Tab } from "@headlessui/react";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import Select from "react-select";
import Textarea from "@/components/ui/Textarea";
import InputGroup from "@/components/ui/InputGroup";
import ProfileImage from "@/assets/images/users/user-1.jpg";

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

const buttons = [
  {
    title: "Profile",
    icon: "heroicons-outline:user",
  },
  {
    title: "Projects",
    icon: "heroicons-outline:user",
  },
  {
    title: "Tasks",
    icon: "heroicons-outline:chat-alt-2",
  },
];

const Profile = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    profile_photo: "",
    type: "",
    phone: "",
    email: "",
    password: "",
    designation: "",
  });

  const navigate = useNavigate();

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      const authToken = localStorage.getItem('auth_token');
      try {
        const response = await axios.get(`https://phplaravel-1340915-4916922.cloudwaysapps.com/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.data.success) {
          const users = response.data.data;
          setFormData({
            fullname: users.first_name + ' ' + users.last_name,
            first_name: users.first_name || "",
            last_name: users.last_name || "",
            profile_photo: users.profile_photo || "",
            email: users.email || "",
            type: users.type || "",
            phone: users.phone || "",
            designation: users.designation || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [id]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
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

  // Function to handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    const authToken = localStorage.getItem('auth_token');

    try {
      const response = await axios.put(
        `https://phplaravel-1340915-4916922.cloudwaysapps.com/api/users/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success) {
        alert("Profile updated successfully!"); // Or navigate to another page
        navigate('/users'); // Redirect to customer list
      } else {
        console.error("Failed to update profile:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  const Textinput = ({ label, id, type = "text", placeholder, value, onChange }) => {
    return (
      <div className="form-group">
        <label htmlFor={id} className="block capitalize form-label">{label}</label>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value} // The value should be passed down here
          onChange={handleInputChange} // Handle the onChange event
          className="form-control py-2"
        />
      </div>
    );
  };
  const InputGroup = ({ label, id, type = "text", placeholder, value, onChange }) => {
    return (
      <div className="form-group">
        <label htmlFor={id} className="block capitalize form-label">{label}</label>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          prepend={<Icon icon="heroicons-outline:phone" />}
          value={value} // The value should be passed down here
          onChange={handleInputChange} // Handle the onChange event
          className="form-control py-2"
        />
      </div>
    );
  };
  return (
    <div>
      <div className="space-y-5 profile-page">
        <div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
          <div className="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div>
          <div className="profile-box flex-none md:text-start text-center">
            <div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
              <div className="flex-none">
                <div className="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative">
                  <img
                    src={ProfileImage}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                  <Link
                    to="#"
                    className="absolute right-2 h-8 w-8 bg-slate-50 text-slate-600 rounded-full shadow-sm flex flex-col items-center justify-center md:top-[140px] top-[100px]"
                  >
                    <Icon icon="heroicons:pencil-square" />
                  </Link>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                  {formData.fullname || "User Name"}
                </div>
                <div className="text-sm font-light text-slate-600 dark:text-slate-400">
                  {formData.designation || "Designation"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form section */}
        <div className="grid grid-cols-12 gap-6">
          <div className="lg:col-span-12 col-span-12">
            <Card>
              <Tab.Group>
                <Tab.List className="lg:space-x-8 md:space-x-4 space-x-0 rtl:space-x-reverse">
                  {buttons.map((item, i) => (
                    <Tab as={Fragment} key={i}>
                      {({ selected }) => (
                        <button
                          className={`inline-flex items-start text-sm font-medium mb-7 capitalize bg-white dark:bg-slate-800 ring-0 focus:ring-0 focus:outline-none px-2 transition duration-150 relative ${selected
                            ? "text-primary-500 before:w-full"
                            : "text-slate-500 before:w-0 dark:text-slate-300"
                            }`}
                        >
                          <span className="text-base relative top-[1px] ltr:mr-1 rtl:ml-1">
                            <Icon icon={item.icon} />
                          </span>
                          {item.title}
                        </button>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    <div className="text-slate-600 dark:text-slate-400 text-sm font-normal">
                      <form method="post" onSubmit={handleFormSubmit}>
                        <div className="lg:grid-cols-2 grid gap-5 grid-cols-1 ">
                          <div>
                            <Textinput
                              label="First Name"
                              id="first_name"
                              type="text"
                              placeholder="First Name"
                              value={formData.first_name}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div>
                            <Textinput
                              label="Last name"
                              id="last_name"
                              type="text"
                              placeholder="Last name"
                              value={formData.last_name}
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
                              value={{ label: formData.type, value: formData.type }}
                              onChange={handleTypeChange}
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
                        </div>
                        <div className="lg:col-span-2 col-span-1 mt-5 pt-5">
                          <div className="ltr:text-center rtl:text-left">
                            <button
                              type="submit"
                              className="btn btn-dark text-center"
                            >
                              Save & Update
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </Tab.Panel>
                  {/* Other tabs */}
                </Tab.Panels>
              </Tab.Group>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
