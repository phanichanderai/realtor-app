import axios from "axios";

const API = axios.create({
  baseURL: "https://realtor-app-vvos.onrender.com/api/",
  timeout: 5000,
});

export default API;