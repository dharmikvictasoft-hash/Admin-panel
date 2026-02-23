import axios from "axios";

export const getTotalCalories = () => {
  return axios.get("http://localhost:5001/api/admin/total-calories");
};

export const getTotalUsers = () => {
  return axios.get("http://localhost:5001/api/admin/total-users");
};


export const getTotalSteps = () =>
  axios.get("http://localhost:5001/api/admin/total-steps");