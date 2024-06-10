import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7219/api",
});

export default api;