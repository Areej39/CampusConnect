import { getCurrentUser } from "./authApi";
import { getMyRegistrations } from "./registrationApi";

export const getStudentDashboard = async () => {
  const [userData, registrationData] = await Promise.all([
    getCurrentUser(),
    getMyRegistrations(),
  ]);

  return {
    user: userData.user,
    registrations: registrationData.registrations,
  };
};