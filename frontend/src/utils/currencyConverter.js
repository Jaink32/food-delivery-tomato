export const USD_TO_INR_RATE = 83.4;

export const convertToINR = (usdPrice) => {
  return Math.round(usdPrice * USD_TO_INR_RATE);
};

export const formatInrPrice = (price) => {
  return `₹${price.toLocaleString("en-IN")}`;
};
