import React, { useState } from "react";
import CreateInvoice from "./CreateInvoice";

const Index = () => {
  const [renderChild, setRenderChild] = useState(false);
  const _handleRemove = () => {
    setRenderChild(false);
  };
  const _handleToast = (msg, type) => {
    //eslint-disable-next-line no-undef
    UIkit.notification({ message: msg, status: type });
  };
  return (
    <div>
      <div className="uk-flex uk-flex-between">
        <form className="uk-search uk-search-default">
          <input
            className="uk-search-input "
            type="search"
            placeholder="Search..."
          />
        </form>
        <button
          className="uk-button uk-button-primary"
          uk-toggle="target: #create_invoice_modal"
          onClick={() => setRenderChild(true)}
        >
          Create
        </button>
      </div>
      <div id="create_invoice_modal" uk-modal="true">
        {renderChild && (
          <CreateInvoice removeModal={_handleRemove} showToast={_handleToast} />
        )}
      </div>
    </div>
  );
};

export default Index;
