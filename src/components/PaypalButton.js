import React from "react";

import PaypalExpressBtn from "react-paypal-express-checkout";

const PaypalButton = ({ total, description, loading, complete }) => {
  // Get the env from a config file
  const client = {
    sandbox: "",
    production: "",
  };
  const env = "sandbox";
  const currency = "USD";
  const _onSuccess = payment => {
    // 1, 2, and ... Poof! You made it, everything's fine and dandy!
    console.log("Payment successful!", payment);
    // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
    loading(false);
    complete(true);
  };

  const _onCancel = data => {
    // The user pressed "cancel" or closed the PayPal popup
    console.log("Payment cancelled!", data);
    // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
    loading(false);
  };

  const _onError = err => {
    // The main Paypal script could not be loaded or something blocked the script from loading
    console.log("Error!", err);
    // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
    // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
    loading(false);
  };
  return (
    <PaypalExpressBtn
      env={env}
      client={client}
      currency={currency}
      total={total}
      onError={_onError}
      onSuccess={_onSuccess}
      onCancel={_onCancel}
    />
  );
};

export default PaypalButton;
