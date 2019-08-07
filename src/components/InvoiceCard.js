import React, { useState } from "react";
import PdfWindow from "./PdfWindow";

const InvoiceCard = ({ info, sendSMS, isLoading }) => {
  const [viewPdf, setViewPdf] = useState(false);

  const _handleWindowUnload = () => {
    setViewPdf(false);
  };
  return (
    <div>
      <div
        className="uk-card uk-card-default uk-card-body uk-card-hover"
        uk-grid="true"
      >
        <div className="uk-width-1-2">
          <div className="uk-title">Number: {info.inv_no}</div>
          <div className="uk-title">Status: {info.status}</div>
          <div className="uk-title">Method: {"Cash"}</div>
          <div className="uk-title">Amount: ${info.total_price}</div>
        </div>
        <div className="uk-width-1-2 uk-child-width-1-1 uk-height-1-1">
          <button
            className="uk-button uk-button-default"
            onClick={() => sendSMS(info)}
            disabled={isLoading}
          >
            Send Text
          </button>
          <button className="uk-button uk-button-default" disabled={isLoading}>
            Send Email
          </button>
          <button
            className="uk-button uk-button-default"
            onClick={() => setViewPdf(true)}
            disabled={isLoading}
          >
            View Invoice
          </button>
          <button
            className="uk-button uk-button-danger"
            onClick={() => alert("Are you sure you want to delete")}
            disabled={isLoading}
          >
            Delete
          </button>
        </div>
      </div>

      {viewPdf && (
        <PdfWindow path={info.download_path} onUnload={_handleWindowUnload} />
      )}
    </div>
  );
};

export default InvoiceCard;
