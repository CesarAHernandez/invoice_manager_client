import React, { useEffect, useState } from "react";
import InvoiceCard from "./InvoiceCard";
import { getRequest } from "../utils/axios";
import { sendSMS, sendEmail } from "../utils/communication";
import * as UIkit from "../uikit.min.js";

const UserProfile = ({ match, history }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const request = await getRequest(`user/${match.params.id}/invoice`);
        setUserInfo(request.data.user);
        setInvoices(request.data.invoices);
      } catch (err) {
        history.push("/404");
      }
    };
    fetchUserInfo();
  }, []);
  const _sendEmail = async invoice => {
    try {
      if (!userInfo.email || userInfo.email.length === 0) {
        throw new Error("This user doesn't have an email");
      }
      await sendEmail(
        userInfo.email || "",
        "You invoice is ready to be viewed",
        "basic",
        {
          name: userInfo.username,
          body: `You can now view your invoice at http://localhost/user/invoice/view.
          Invoice Number: #${invoice.inv_no}
          Total Amount: $${invoice.total_price}

          Code: ${userInfo.user_no}-${invoice.inv_no}

          This is an automated email. Please do not reply to this email.
        `,
        }
      );

      //eslint-disable-next-line no-undef
      UIkit.notification({ message: "Email Sent", status: "success" });
    } catch (error) {
      try {
        //eslint-disable-next-line no-undef
        UIkit.notification({ message: error.message, status: "warning" });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const _sendSMS = async invoice => {
    try {
      console.log(invoice);
      setLoading(true);
      const body = `
      Hello ${userInfo.username},
      Your invoice is ready to be viewed
      Invoice Number: #${invoice.inv_no}
      Total Amount: $${invoice.total_price}

      Code: ${userInfo.user_no}-${invoice.inv_no}

      Link: http://localhost/user/invoice/view

      Please do not reply to this number.`;

      await sendSMS(userInfo.phone, body);
      //eslint-disable-next-line no-undef
      UIkit.notification({ message: "Text message sent", status: "success" });
    } catch (err) {
      try {
        //eslint-disable-next-line no-undef
        UIkit.notification({ message: err.message, status: "warning" });
      } catch (err) {
        console.log(err);
      }
    }

    setLoading(false);
  };
  if (userInfo) {
    return (
      <div>
        <div
          className="uk-card uk-card-default uk-card-body uk-child-width-1-4"
          uk-grid="true"
        >
          <div className="uk-card-title">Number</div>
          <div className="uk-card-title">Name</div>
          <div className="uk-card-title">Phone</div>
          <div className="uk-card-title">Address</div>
          <div className="uk-text-top">{userInfo.user_no}</div>
          <div className="uk-text-top">{userInfo.username}</div>
          <div className="uk-text-top">{userInfo.phone}</div>
          <div className="uk-text-top">
            {userInfo.street_address} <br /> {userInfo.city}, {userInfo.state}{" "}
            {userInfo.zip}
          </div>
        </div>
        <div
          className="uk-margin uk-child-width-1-2@m uk-child-width-1-1@s uk-child-width-1-3@xl"
          uk-grid="true"
        >
          {invoices.map((invoice, index) => {
            return (
              <InvoiceCard
                key={index}
                sendSMS={_sendSMS}
                sendEmail={_sendEmail}
                info={invoice}
                isLoading={loading}
              />
            );
          })}
        </div>
      </div>
    );
  }
  return <div>Loading ....</div>;
};

export default UserProfile;
