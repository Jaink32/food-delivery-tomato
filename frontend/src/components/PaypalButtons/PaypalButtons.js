import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import React, { useEffect } from "react";
import { useLoading } from "../../hooks/useLoading";
import { pay } from "../../services/orderService";
import { useCart } from "../../hooks/useCart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { USD_TO_INR_RATE } from "../../utils/currencyConverter";

export default function PaypalButtons({ order }) {
  return (
    <PayPalScriptProvider
      options={{
        clientId:
          "AZoMs5c6mDw27ZvZeMwpQt257N_fxAHlRzFaWLLAYx3PQILX6go_q2IWo9w2O5dL9gWvGk6KB-uplC0w",
      }}
    >
      <Buttons order={order} />
    </PayPalScriptProvider>
  );
}

function Buttons({ order }) {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [{ isPending }] = usePayPalScriptReducer();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    isPending ? showLoading() : hideLoading();
  });

  const createOrder = (data, actions) => {
    // Convert INR back to USD for PayPal
    const usdAmount = (order.totalPrice / USD_TO_INR_RATE).toFixed(2);

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: usdAmount,
          },
        },
      ],
    });
  };

  const onApprove = async (data, actions) => {
    try {
      const payment = await actions.order.capture();
      const orderId = await pay(payment.id);
      clearCart();
      toast.success("Payment Saved Successfully", "Success");
      navigate("/track/" + orderId);
    } catch (error) {
      toast.error("Payment Save Failed", "Error");
    }
  };

  const onError = (err) => {
    toast.error("Payment Failed", "Error");
  };

  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onError}
    />
  );
}
