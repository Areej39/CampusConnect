import axios from "axios";

const API_URL = "http://localhost:3000/api/registrations";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAdminRegistrations = async (params = {}) => {
  const response = await axios.get(`${API_URL}/admin/all`, {
    ...getAuthConfig(),
    params,
  });

  return response.data;
};

export const approveRegistration = async (registrationId) => {
  const response = await axios.put(
    `${API_URL}/admin/${registrationId}/approve`,
    {},
    getAuthConfig()
  );

  return response.data;
};

export const rejectRegistration = async (
  registrationId,
  reason = ""
) => {
  const response = await axios.put(
    `${API_URL}/admin/${registrationId}/reject`,
    { reason },
    getAuthConfig()
  );

  return response.data;
};