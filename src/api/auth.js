import api from "./axios";

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data.data.user;  // cookie is set automatically by the server
};

export const signupUser = async (name, email, password) => {
  const response = await api.post("/auth/register", { name, email, password });
  return response.data.data.user;
};

export const logoutUser = async () => {
  await api.post("/auth/logout"); // backend clears the cookie
};