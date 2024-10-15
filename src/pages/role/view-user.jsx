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
    title: "Subscriptions",
    icon: "heroicons-outline:chat-alt-2",
  },
  {
    title: "Services",
    icon: "heroicons-outline:cog",
  },
  {
    title: "Ticket",
    icon: "heroicons-outline:cog",
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
    date_of_birth: "",
    designation: "",
    email: "",
    roles: "",
    date_of_join:"",
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
          const user = response.data.data;
          setFormData({
            fullname: user.first_name + ' ' + user.last_name,
            profile_photo: user.profile_photo,
            phone: user.phone,
            email: user.email,
            type: user.type,
            date_of_birth: user.date_of_birth,
            designation: user.designation,
            roles: user.roles,
            date_of_join: user.date_of_join,
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

          <div className="profile-info-500 md:flex md:text-start text-center flex-1 max-w-[516px] md:space-y-0 space-y-4">
            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
              {formData.date_of_birth || "Date Of Birth"}
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Date Of Birth
              </div>
            </div>

            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
              {formData.date_of_join || "Date Of Join"}
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Joining Date
              </div>
            </div>

            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
              {formData.type || "Job Type"}
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Job Type
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="lg:col-span-4 col-span-12">
            <Card title="Info">
              <ul className="list space-y-8">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:envelope" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      EMAIL
                    </div>
                    <a
                      href="mailto:someone@example.com"
                      className="text-base text-slate-600 dark:text-slate-50"
                    >
                      {formData.email || "Email"}
                    </a>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:phone-arrow-up-right" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      PHONE
                    </div>
                    <a
                      href="tel:0189749676767"
                      className="text-base text-slate-600 dark:text-slate-50"
                    >
                      {formData.phone || "Phone"}
                    </a>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:map" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                    Designation
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                    {formData.designation || "Designation"}
                    </div>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
          <div className="lg:col-span-8 col-span-12">
            <Card title="Projects">
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
