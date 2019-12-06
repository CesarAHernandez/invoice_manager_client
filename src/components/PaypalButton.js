import React from "react";

import { PayPalButton } from "react-paypal-button-v2";
import { postRequest } from "../utils/axios";
import { siteOptions } from "../config/siteOptions";

const PaypalButton = ({ total, description, loading, complete, invoiceId }) => {
  // Get the env from a config file
  const client = {
    clientId:
      siteOptions.paypal_env === "sandbox"
        ? siteOptions.paypal_sandbox_client_id
        : siteOptions.paypal_production_client_id,
  };

  const currency = "USD";
  const _onSuccess = async (details, data) => {
    // 1, 2, and ... Poof! You made it, everything's fine and dandy!

    try {
      console.log("Payment successful!", details, data);
      /**
       * Data:
       * {
       *  orderID: '',
       *  payerID: ''
       * }
       * Details:
       * {
       * }
       *
       */

      await postRequest("/payment/charge", {
        invoiceId,
        paypalDetails: details,
        paypalData: data,
      });

      // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
      loading(false);
      complete(true);
    } catch (err) {
      console.log("err", err);
      loading(false);
    }
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
    <PayPalButton
      amount={total}
      currency={currency}
      shippingPreference="NO_SHIPPING"
      onSuccess={(details, data) => _onSuccess(details, data)}
      onCancel={data => _onCancel(data)}
      catchError={err => _onError(err)}
      options={client}
    />
  );
};

export default PaypalButton;
