import axios from "axios";

axios.defaults.baseURL =
  process.env.NODE_ENV !== "production" ? "https://food-delivery-tomato-763y.onrender.com/" : "/";
