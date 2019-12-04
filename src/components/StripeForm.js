import React from "react";
import { postRequest } from "../utils/axios";
import { CardElement, injectStripe } from "react-stripe-elements";

const StripeForm = ({
  stripe,
  total,
  description,
  userInfo,
  loading,
  complete,
}) => {
  const onSubmit = async e => {
    loading(true);

    const { token } = await stripe.createToken({
      name: "#148398 Cesar Hernandez",
    });
    const response = await postRequest("/payment/paypal/charge", {
      token: token.id,
      total: parseInt(total * 100),
      description,
    });
    if (response.status === 200) {
      complete(true);
    }
    loading(false);
  };
  return (
    <div className="checkout">
      <CardElement />
      <button className="uk-button uk-button-primary" onClick={onSubmit}>
        Send
      </button>
    </div>
  );
};

export default injectStripe(StripeForm);
