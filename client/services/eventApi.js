import axios from 'axios'

const API_URL = "http://localhost:3000/api/events";

export const getEvents = async (params = {}) => {
  const response = await axios.get(API_URL, {
    params
  })
  return response.data;
};

export const getEventById = async (eventId) => {
  const response = await axios.get(`${API_URL}/${eventId}`);
  return response.data;
};