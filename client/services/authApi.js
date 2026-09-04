import axios from 'axios'

const API_URL = "https://privilege-light-horse.abasthan.app/api/auth"

export const signupUser = async (userData) => {
    const response = await axios.post(
        `${API_URL}/signup`,
        userData
    );
    return response.data;
}

export const loginUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}/login`,
    userData
  );

  return response.data;
};

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/me`,
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
  );

  return response.data;
};