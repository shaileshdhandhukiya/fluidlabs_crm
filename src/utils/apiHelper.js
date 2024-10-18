import axios from "axios";


// console.log(localStorage.getItem("auth_token"));

// Create an axios instance
const api = axios.create({
    baseURL: "https://phplaravel-1340915-4916922.cloudwaysapps.com/",
});

console.log("Base URL ->>",import.meta.env.VITE_API_BASE_URL);

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        // console.log("Token being sent:", token); // Log token
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        // console.log("Request config:", config); // Log config
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized! Logging out...");
            localStorage.removeItem("auth_token"); 
        }
        return Promise.reject(error);
    }
);

// API Helper functions
export const getRequest = async (url, params = {}) => {
    const response = await api.get(url, { params });
    return response.data;
};

export const postRequest = async (url, data) => {
    const response = await api.post(url, data);
    return response.data;
};

export const putRequest = async (url, data) => {
    const response = await api.put(url, data);
    return response.data;
};

export const deleteRequest = async (url) => {
    const response = await api.delete(url);
    return response.data;
};
