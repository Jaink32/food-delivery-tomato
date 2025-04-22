import React from "react";
import { convertToINR } from "../../utils/currencyConverter";

export default function Price({ price, locale, currency }) {
  const formatPrice = () => {
    const finalPrice = currency === "INR" ? convertToINR(price) : price;
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(finalPrice);
  };

  return <span>{formatPrice()}</span>;
}

Price.defaultProps = {
  locale: "en-IN",
  currency: "INR",
};
