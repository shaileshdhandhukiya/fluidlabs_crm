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

  const navigate = useNavigate();

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      const authToken = localStorage.getItem('auth_token'); 
      try {
        const response = await axios.get(`https://phplaravel-1340915-4916922.cloudwaysapps.com/api/customers/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        
        if (response.data.success) {
          const customer = response.data.data;
          setFormData({
            company: customer.company || "",
            customer_name: customer.customer_name || "",
            phone: customer.phone || "",
            email: customer.email || "",
            currency: customer.currency || "",
            office_address: customer.office_address || "",
            city: customer.city || "",
            state: customer.state || "",
            zip_code: customer.zip_code || "",
            country: customer.country || "",
            subscription_package: customer.subscription_package || "",
            billing_type: customer.billing_type || "",
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
        `https://phplaravel-1340915-4916922.cloudwaysapps.com/api/customers/${id}`, 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      if (response.data.success) {
        alert("Profile updated successfully!"); // Or navigate to another page
        navigate('/customers'); // Redirect to customer list
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
                  {formData.customer_name || "Customer Name"}
                </div>
                <div className="text-sm font-light text-slate-600 dark:text-slate-400">
                  {formData.company || "Company Name"}
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
                          className={`inline-flex items-start text-sm font-medium mb-7 capitalize bg-white dark:bg-slate-800 ring-0 focus:ring-0 focus:outline-none px-2 transition duration-150 relative ${
                            selected
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
                              value={{ label: formData.currency, value: formData.currency }} 
                              onChange={handleCurrencyChange}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="subscription_package"
                              className="form-label"
                            >
                              Subscription Package
                            </label>
                            <Select
                              options={[
                                { label: "Name Of Package", value: "Premium" },
                                { label: "Name Of Package", value: "Standard" },
                                { label: "Name Of Package", value: "Basic" },
                              ]}
                              styles={styles}
                              className="react-select"
                              classNamePrefix="select"
                              id="subscription_package"
                              value={{
                                label: formData.subscription_package,
                                value: formData.subscription_package,
                              }} 
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
                              value={{
                                label: formData.billing_type,
                                value: formData.billing_type,
                              }}
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
