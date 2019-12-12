import React, { useState } from "react";
import PdfWindow from "./PdfWindow";

const InvoiceCard = ({
  info,
  sendSMS,
  sendEmail,
  viewerInfo,
  isLoading,
  viewByAdmin,
  deleteInvoice,
}) => {
  const [viewPdf, setViewPdf] = useState(false);
  /**
   * Calculates the number of days since the given date
   * 8.64e7 is the number of miliseconds in a single day
   *
   * @param {dateString} date The date that you want to get the number of days since
   */
  const calculateLastSinceCommunication = date => {
    const today = new Date();
    const dateSince = new Date(date);

    return Math.floor((today - dateSince) / 8.64e7);
  };

  const _handleWindowUnload = () => {
    setViewPdf(false);
  };
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
            {viewerInfo.user.admin_level > 1 ? (
              <a href={`/admin/user/${info.user.user_no}`}>
                Number: {info.inv_no}
              </a>
            ) : (
              <div>Number: {info.inv_no}</div>
            )}
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
            Send Text{" "}
            {info.last_text_sent ? (
              <span className="uk-text-primary">
                {calculateLastSinceCommunication(info.last_text_sent) === 0
                  ? "Today"
                  : `${calculateLastSinceCommunication(
                      info.last_text_sent
                    )} Days`}
              </span>
            ) : (
              <span className="uk-text-muted uk-text-bold">Never</span>
            )}
          </button>

          <button
            className="uk-button uk-button-default"
            onClick={() => sendEmail(info)}
            disabled={isLoading}
          >
            Send Email{" "}
            {info.last_email_sent ? (
              <span className="uk-text-primary">
                {calculateLastSinceCommunication(info.last_email_sent) === 0
                  ? "Today"
                  : `${calculateLastSinceCommunication(
                      info.last_email_sent
                    )} Days`}
              </span>
            ) : (
              <span className="uk-text-muted uk-text-bold">Never</span>
            )}
          </button>
          <button
            className="uk-button uk-button-default"
            onClick={() => setViewPdf(true)}
            disabled={isLoading}
          >
            View Invoice
          </button>
          {viewerInfo.user.admin_level > 1 && (
            <button
              className="uk-button uk-button-danger"
              onClick={() => deleteInvoice(info.id)}
              disabled={isLoading}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {viewPdf && (
        <PdfWindow path={info.download_path} onUnload={_handleWindowUnload} />
      )}
    </div>
  );
};

export default InvoiceCard;
