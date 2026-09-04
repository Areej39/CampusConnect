import axios from 'axios'

const API_URL = "https://privilege-light-horse.abasthan.app/api/events";

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