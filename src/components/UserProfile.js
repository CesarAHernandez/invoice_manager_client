import React, { useEffect, useState } from "react";
import InvoiceCard from "./InvoiceCard";
import { getRequest, postRequest } from "../utils/axios";
import "../uikit.min.js";
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

  const _sendSMS = async invoice => {
    try {
      setLoading(true);
      await postRequest("/sms/send", {
        number: userInfo.phone,
        body: `
      Hello ${userInfo.username},
      Your invoice is ready to be viewed
      Invoice Number: #${invoice.inv_no}
      Total Amount: $${invoice.total_price}

      Code: ${userInfo.user_no}-${invoice.inv_no}

      Link: http://localhost/user/invoice/view

      Please do not reply to this number.
      `,
      });

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
          className="uk-card uk-card-default uk-card-body uk-child-width-1-3"
          uk-grid="true"
        >
          <div className="uk-card-title">Number</div>
          <div className="uk-card-title">Name</div>
          <div className="uk-card-title">Phone</div>
          <div className="uk-text-top">{userInfo.user_no}</div>
          <div className="uk-text-top">{userInfo.username}</div>
          <div className="uk-text-top">{userInfo.phone}</div>
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
