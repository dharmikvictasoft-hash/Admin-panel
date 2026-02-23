// services/userApi.js
import axios from "axios";

export const storeUserData = (data: any) => {
  return axios.get("http://localhost:5001/api/users/store", data);
};
