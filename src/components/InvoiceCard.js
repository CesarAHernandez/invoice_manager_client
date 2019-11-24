import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import PdfWindow from "./PdfWindow";

const InvoiceCard = ({
  info,
  sendSMS,
  sendEmail,
  isLoading,
  viewByAdmin,
  deleteInvoice,
}) => {
  const [viewPdf, setViewPdf] = useState(false);

  const _handleWindowUnload = () => {
    setViewPdf(false);
  };
  useEffect(() => {
    console.log(info);
  }, []);
  return (
    <div>
      <div
        className="uk-card uk-card-default uk-card-body uk-card-hover"
        style={{
          borderWidth: viewByAdmin ? 1 : 0,
          borderColor: "red",
          borderStyle: "solid",
        }}
        uk-grid="true"
      >
        <div className="uk-width-1-2">
          <div className="uk-title">
            <a href={`/admin/user/${info.user.user_no}`}>
              Number: {info.inv_no}
            </a>
          </div>
          <div className="uk-title">Status: {info.status}</div>
          <div className="uk-title">
            Due Date: {new Date(info.due_date).toLocaleDateString()}
          </div>
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
          <button
            className="uk-button uk-button-default"
            onClick={() => sendEmail(info)}
            disabled={isLoading}
          >
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
            onClick={() => deleteInvoice(info.id)}
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
