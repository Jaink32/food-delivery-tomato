import axios from "axios";

export const createOrder = async (order) => {
  try {
    const { data } = await axios.post("/api/orders/create", order);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getNewOrderForCurrentUser = async () => {
  try {
    const { data } = await axios.get("/api/orders/newOrderForCurrentUser");
    return data;
  } catch (error) {
    throw error;
  }
};

export const pay = async (paymentId) => {
  try {
    const { data } = await axios.put("/api/orders/pay", { paymentId });
    return data;
  } catch (error) {
    throw error;
  }
};

export const trackOrderById = async (orderId) => {
  try {
    const { data } = await axios.get("/api/orders/track/" + orderId);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAll = async (state) => {
  try {
    const { data } = await axios.get(`/api/orders/${state ?? ""}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAllStatus = async () => {
  try {
    const { data } = await axios.get("/api/orders/allstatus");
    return data;
  } catch (error) {
    throw error;
  }
};
