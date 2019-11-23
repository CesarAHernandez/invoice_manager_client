import React, { useState, useEffect } from "react";
import CreateInvoiceForm from "./CreateInvoiceForm";

const CreateInvoice = ({ removeModal, showToast }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => removeModal("user");
  });

  const _handleLoading = state => {
    setLoading(state);
  };
  const _handleCompleted = err => {
    if (err) {
      setError(err);
      return;
    }

    try {
      setTimeout(() => {
        document.getElementById("modal-close-btn").click();
      }, 100);
      showToast("Successfully created a new Invoice", "success");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="uk-modal-dialog uk-modal-body uk-padding-small">
      {error && <div className="error">{error.msg}</div>}
      <div className="">
        <button
          className="uk-button uk-modal-close uk-position-top-right"
          id="modal-close-btn"
          type="button"
          onClick={() => removeModal("invoice")}
          uk-close="true"
        />
        <h2 className="uk-modal-title">Create a new Invoice</h2>
        <CreateInvoiceForm
          handleCompleted={_handleCompleted}
          handleLoading={_handleLoading}
        />
      </div>
      <div>
        {loading && (
          <div className="uk-overlay-default uk-position-cover">
            <div className="uk-position-center">
              <div uk-spinner="ratio: 3" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateInvoice;
