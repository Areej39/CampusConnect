import axios from "axios";

const API_URL = "https://privilege-light-horse.abasthan.app/api/registrations";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const registerForEvent = async (eventId) => {
  const response = await axios.post(
    `${API_URL}/${eventId}`,
    {},
    getAuthConfig()
  );

  return response.data;
};

export const getMyRegistrations = async () => {
  const response = await axios.get(
    `${API_URL}/my`,
    getAuthConfig()
  );

  return response.data;
};

export const cancelRegistration = async (registrationId) => {
  const response = await axios.put(
    `${API_URL}/${registrationId}/cancel`,
    {},
    getAuthConfig()
  );

  return response.data;
};

export const submitPayment = async (
  registrationId,
  paymentReference
) => {
  const response = await axios.put(
    `${API_URL}/${registrationId}/payment`,
    {
      paymentReference,
    },
    getAuthConfig()
  );

  return response.data;
};