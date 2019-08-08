import React, { useState, useEffect } from "react";
import { StripeProvider, Elements } from "react-stripe-elements";
import { postRequest } from "../utils/axios";
import PaypalButton from "./PaypalButton";
import StripeForm from "./StripeForm";

const UserPayment = ({ invoice, user, goBack }) => {
  // TODO: Make request to server to see if this person needs to pay
  // TODO: Incoporate the download invoice button
  const [total, setTotal] = useState(invoice.total_price);
  const [complete, setComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await postRequest("/admin/invoice/status", {
          inv_no: invoice.inv_no,
        });
        if (response.status === 200) {
          setComplete(response.data.status === "paid");
          return;
        }
      } catch (err) {
        console.log(err);
      }
    };
    getStatus();
  }, []);

  const _handleComplete = async isCompleted => {
    try {
      if (isCompleted) {
        const response = await postRequest("/admin/invoice/update-status", {
          inv_no: invoice.inv_no,
          status: "paid",
        });
        if (response.status === 200) {
          setComplete(isCompleted);
        }
      }
    } catch (err) {
      console.log(err);
    }

    // Make request to server to note that this payment is complete
  };
  const _handleLoading = isLoading => {
    setIsLoading(isLoading);
  };
  return (
    <div className="uk-container uk-padding-large">
      <div className="uk-card uk-card-default uk-card-body uk-width-1-1">
        <button className="uk-button uk-button-default" onClick={goBack}>
          Go Back
        </button>
        <h1 className="uk-heading-small uk-text-center">Pay Here</h1>
        <div className="uk-child-width-1-2" uk-grid="true">
          <div>
            <div>Invoice# {invoice.inv_no}</div>
            <div>Total: ${total}</div>
            <button className="uk-button uk-button-primary">
              Download Invoice
            </button>
          </div>
          <div className="payment">
            {isLoading && (
              <div className="uk-overlay-default uk-position-cover">
                <div className="uk-position-center">
                  <div uk-spinner="ratio: 3" />
                </div>
              </div>
            )}
            {complete ? (
              <div className="uk-text-center uk-text-success">
                Payment complete
              </div>
            ) : (
              <div>
                <div className="uk-card-title uk-text-center">Payment</div>
                <div className="uk-text-center">
                  <div>Continue with Paypal</div>
                  <PaypalButton
                    total={total}
                    description={"Some thing"}
                    complete={_handleComplete}
                    loading={_handleLoading}
                  />
                </div>
                <hr className="uk-divider-icon" />
                <div>Credit Card</div>
                <StripeProvider apiKey="pk_test_FakM84nEUfKPZFFI8dAEDfyf00WqcOJr8E">
                  <Elements>
                    <StripeForm
                      total={total}
                      description={"something"}
                      complete={_handleComplete}
                      loading={_handleLoading}
                    />
                  </Elements>
                </StripeProvider>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPayment;
