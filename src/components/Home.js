import React from "react";

const Home = () => {
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
          <div>
            <div className="uk-card-title uk-text-center">Payment</div>
            <div>Continue with Paypal</div>
            <hr class="uk-divider-icon" />
            <div>Credit Card</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
