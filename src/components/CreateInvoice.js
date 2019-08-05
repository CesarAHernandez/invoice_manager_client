import React from "react";
import CreateInvoiceForm from "./CreateInvoiceForm";

const CreateInvoice = ({ removeModal }) => {
  return (
    <div className="uk-modal-dialog uk-modal-body uk-padding-small">
      <button
        className="uk-button uk-modal-close uk-position-top-right"
        type="button"
        onClick={removeModal}
        uk-close="true"
      />
      <h2 className="uk-modal-title">Create a new Invoice</h2>
      <CreateInvoiceForm />
    </div>
  );
};

export default CreateInvoice;
