import React, { useState } from "react";
import PaypalButton from "./PaypalButton";
import { StripeProvider, Elements } from "react-stripe-elements";
import StripeForm from "./StripeForm";

const Home = () => {
  // TODO: Make request to server to see if this person needs to pay
  const [complete, setComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const _handleComplete = isCompleted => {
    setComplete(isCompleted);
  };
  const _handleLoading = isLoading => {
    setIsLoading(isLoading);
  };
  return (
    <div className="uk-container uk-padding-large">
      <div className="uk-card uk-card-default uk-card-body uk-width-1-1">
        <h1 className="uk-heading-small uk-text-center">Pay Here</h1>
        <div className="uk-child-width-1-2" uk-grid="true">
          <div>
            <div>Invoice# 75du0e1</div>
            <div>Total: $100.00</div>
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
                    total={100.0}
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
                      total={100.0}
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

export default Home;
