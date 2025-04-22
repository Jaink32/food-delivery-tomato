import axios from "axios";

// Request interceptor
axios.interceptors.request.use(
  (req) => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.token) {
          // Set token without quotes
          req.headers.access_token = userData.token.replace(/^["']|["']$/g, "");
          console.log("Token added to request:", req.headers.access_token);
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    } else {
      console.log("No user found in localStorage");
    }
    return req;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Response error:", error.response?.data || error.message);
    console.error("Status code:", error.response?.status);
    console.error("Headers:", error.response?.headers);
    return Promise.reject(error);
  }
);
