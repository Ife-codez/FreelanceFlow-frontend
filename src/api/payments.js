import api from "./axios";

export const getPayments = async () => {
  const response = await api.get("/payments");
  return response.data.payments;
};

export const getPayment = async (id) => {
  const response = await api.get(`/payments/${id}`);
  return response.data.payment;
};

export const createPayment = async (paymentData) => {
  const response = await api.post("/payments", paymentData);
  return response.data.payment;
};

export const deletePayment = async (id) => {
  const response = await api.delete(`/payments/${id}`);
  return response.data;
};