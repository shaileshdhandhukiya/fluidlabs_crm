import axios from "axios";

let domainURL = import.meta.env.VITE_API_BASE_URL || "https://phplaravel-1340915-4916922.cloudwaysapps.com";
// console.log(localStorage.getItem("auth_token"));

// Create an axios instance
const api = axios.create({
    baseURL: "https://phplaravel-1340915-4916922.cloudwaysapps.com/",
});

console.log("Base URL ->>", import.meta.env.VITE_API_BASE_URL);

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

export const getImageUrl = (imagePath) => {
    return `${import.meta.env.VITE_API_BASE_URL}/storage/uploads/${imagePath}`;
};

const profileImageCache = {};

// Function to get the user's profile image by user ID
// export const fetchProfileImage = async (userId) => {
//   const token = localStorage.getItem("auth_token");
//   try {

//     const response = await axios.get(
//       `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const img = response.data.data.profile_photo;
//     return `${import.meta.env.VITE_API_BASE_URL}/storage/uploads/${img}`;

//   } catch (error) {
//     console.error("Error fetching profile image:", error);
//     return null;
//   }
// };


// Function to fetch all users and store them in localStorage
const fetchAllUsersAndStore = async () => {
    const token = localStorage.getItem("auth_token");

    try {
        const response = await axios.get(
            `${domainURL}/api/users`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const usersData = response.data.data;

        // Store the users data in localStorage
        localStorage.setItem("users_data", JSON.stringify(usersData));

        return usersData;

    } catch (error) {
        console.error("Error fetching users data:", error);
        return null; // Return null or handle error as needed
    }
};

// Function to fetch profile images for multiple user IDs
export const fetchProfileImages = async (userIds) => {
    // Check if users data is already in localStorage
    let usersData = JSON.parse(localStorage.getItem("users_data"));
    
    // If users data is not found in localStorage, fetch it and store it
    if (!usersData) {
        usersData = await fetchAllUsersAndStore();
    }
   
    // Iterate over the userIds array and get profile image URLs
    const profileImages = userIds.map((userId) => {

        const user = usersData ? usersData.find(u => u.id === userId) : null;

        if (user && user.profile_photo) {
            return `${domainURL}/storage/uploads/${user.profile_photo}`;
        } else {
            console.error("User not found or no profile photo:", userId);
            return null; 
        }
    });

    return profileImages;
};