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


const Profile = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    billing_duration: "",
    status: "",
    price: "",
    currency: "",
  });

  const navigate = useNavigate();

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      const authToken = localStorage.getItem('auth_token');
      try {
        const response = await axios.get(`https://phplaravel-1340915-4916922.cloudwaysapps.com/api/subscriptions/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.data.success) {
          const subscriptions = response.data.data;
          setFormData({
            name: subscriptions.name || "",
            description: subscriptions.description || "",
            billing_duration: subscriptions.billing_duration || "",
            status: subscriptions.status || "",
            currency: subscriptions.currency || "",
            price: subscriptions.price || "",
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


  // Function to handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    const authToken = localStorage.getItem('auth_token');

    try {
      const response = await axios.put(
        `https://phplaravel-1340915-4916922.cloudwaysapps.com/api/subscriptions/${id}`,
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
  const Textarea = ({ label, id, type = "text", placeholder, value, onChange }) => {
    return (
      <div className="form-group">
        <label htmlFor={id} className="block capitalize form-label">{label}</label>
        <Textinput
              id={id}
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={handleInputChange}
            />
      </div>
    );
  };
  return (
    <div>
      <form method="post" onSubmit={handleFormSubmit}>
        <div className="lg:grid-cols-2 grid gap-5 grid-cols-1 ">
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
  );
};

export default Profile;
