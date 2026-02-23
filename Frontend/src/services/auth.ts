// src/services/auth.ts
import api from "../lib/axios";

export interface LoginResponse {
  token: string;
  user: {
    _id: string;
    fname: string;
    lname: string;
    email: string;
    provider?: string;
    avatar?: string;
  };
}

export const signup = (data: {
  fname: string;
  lname: string;
  email: string;
  password: string;
}) => {
  return api.post("/auth/signup", data);
};

export const signin = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/signin", data);
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const isAuthenticated = () => {
  return Boolean(localStorage.getItem("token"));
};