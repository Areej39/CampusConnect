import axios from "axios";

const API_URL = "https://privilege-light-horse.abasthan.app/api/events";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createEvent = async (eventData) => {
  const response = await axios.post(
    API_URL,
    eventData,
    getAuthConfig()
  );

  return response.data;
};

export const updateEvent = async (eventId, eventData) => {
  const response = await axios.put(
    `${API_URL}/${eventId}`,
    eventData,
    getAuthConfig()
  );

  return response.data;
};

export const deleteEvent = async (eventId) => {
  const response = await axios.delete(
    `${API_URL}/${eventId}`,
    getAuthConfig()
  );

  return response.data;
};

export const publishEvent = async (eventId) => {
  const response = await axios.patch(
    `${API_URL}/${eventId}/publish`,
    {},
    getAuthConfig()
  );

  return response.data;
};

export const cancelEvent = async (eventId) => {
  const response = await axios.patch(
    `${API_URL}/${eventId}/cancel`,
    {},
    getAuthConfig()
  );

  return response.data;
};