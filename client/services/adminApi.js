import axios from "axios";

const API_URL = "https://privilege-light-horse.abasthan.app/api/admin";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAdminDashboard = async () => {
  const response = await axios.get(
    `${API_URL}/dashboard`,
    getAuthConfig()
  );

  return response.data;
};