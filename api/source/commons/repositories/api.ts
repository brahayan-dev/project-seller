import axios from "axios";

const melonn = axios.create({
  // timeout: 0,
  baseURL: "https://yhua9e1l30.execute-api.us-east-1.amazonaws.com/sandbox",
  headers: {
    "content-type": "application/json",
    // TODO: It should be attached in dotenv file
    "x-api-key": "oNhW2TBOlI1t4kWb3PEad1K1S1KxKuuI3GX6rGvT",
  },
});

export const getShippingMethods = async () => {
  try {
    const { data } = await melonn.get("shipping-methods");

    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error });
  }
};

export const getShippingMethodDetail = async (id: number) => {
  try {
    const { data } = await melonn.get(`shipping-methods/${id}`);

    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error });
  }
};

export const getOffDays = async () => {
  try {
    const { data } = await melonn.get("off-days");

    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error });
  }
};
