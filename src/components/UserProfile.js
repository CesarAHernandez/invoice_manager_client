import React, { useEffect, useState, useContext, useCallback } from "react";
import UserContext from "./UserContext";
import InvoiceCard from "./InvoiceCard";
import EditUser from "./EditUser";
import { getRequest, postRequest, deleteRequest } from "../utils/axios";
import { siteOptions } from "../config/siteOptions";
import * as UIkit from "../resources/js/uikit.min.js";

const UserProfile = ({ match, history }) => {
  const userContext = useContext(UserContext);
  const [updated, setUpdated] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);

  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const request = await getRequest(`user/${match.params.id}/invoice`);
        const requestInfo = request.data.user[0];
        let invoices = [];
        if (userContext.user.admin_level > 1 && requestInfo.admin_level > 1) {
          const response = await postRequest(
            "/admin/invoice/preparer/invoices",
            {
              id: requestInfo.id,
            }
          );
          invoices = response.data.invoices;
        }
        setUserInfo(requestInfo);
        setInvoices([...(requestInfo.invoices || []), ...(invoices || [])]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserInfo();
    //TODO: Make a better way to update and fetch the data
  }, [updated]);

  const _handleRemoveModal = useCallback(() => {
    setShowEditUser(false);
    setUpdated(updated + 1);
  });
  const _sendEmail = async invoice => {
    try {
      setLoading(true);
      if (!userInfo.email || userInfo.email.length === 0) {
        throw new Error("This user doesn't have an email");
      }
      await postRequest("/user/send-email", {
        to: userInfo.email || "",
        subject: "You invoice is ready to be viewed",
        template: "basic",
        templateObject: {
          name: userInfo.username,
          body: `You can now view your invoice at ${siteOptions.url}/user/invoice/view.
          Invoice Number: #${invoice.inv_no}
          Total Amount: $${invoice.total_price}

          Code: ${invoice.user.user_no}-${invoice.inv_no}

          This is an automated email. Please do not reply to this email.
        `,
        },
        inv_no: invoice.inv_no,
      });
      //eslint-disable-next-line no-undef
      UIkit.notification({ message: "Email Sent", status: "success" });
      setUpdated(updated + 1);
    } catch (error) {
      try {
        //eslint-disable-next-line no-undef
        UIkit.notification({
          message: "Error: Email not sent",
          status: "warning",
        });
      } catch (err) {
        console.log(err);
      }
    }
    setLoading(false);
  };

  const _sendSMS = async invoice => {
    try {
      setLoading(true);
      const body = `
      Hello ${userInfo.username},
      Your invoice is ready to be viewed
      Invoice Number: #${invoice.inv_no}
      Total Amount: $${invoice.total_price}

      Code: ${invoice.user.user_no}-${invoice.inv_no}

      Link: ${siteOptions.url}/user/invoice/view

      Please do not reply to this number.`;

      await postRequest("/sms/send", {
        number: userInfo.phone,
        body,
        inv_no: invoice.inv_no,
      });
      //eslint-disable-next-line no-undef
      UIkit.notification({ message: "Text message sent", status: "success" });
      setUpdated(updated + 1);
    } catch (err) {
      try {
        //eslint-disable-next-line no-undef
        UIkit.notification({
          message: "Error: Text message did not send",
          status: "warning",
        });
      } catch (err) {
        console.log(err);
      }
    }

    setLoading(false);
  };
  // const _handleRemove = () => {
  //   setShowEditUser(false);
  //   setUpdated(updated + 1);
  // };
  const _handleDeleteInvoice = async id => {
    //eslint-disable-next-line no-restricted-globals
    if (confirm("Are you sure you want to delete")) {
      try {
        // await deleteRequest(`admin/invoice/${id}/delete`);
        await postRequest("admin/invoice/remove", {
          id,
          user_id: userContext.user.id,
        });
        UIkit.notification({
          message: "Invoice successfully deleted",
          status: "success",
        });
        setUpdated(updated + 1);
      } catch (err) {
        console.log(err);
        UIkit.notification({
          message: "Error deleting invoice",
          status: "warning",
        });
      }
    }
  };
  const _handleToast = (msg, type) => {
    UIkit.notification({ message: msg, status: type });
  };
  if (userInfo) {
    return (
      <div>
        <div
          className={`
            uk-card
            uk-card-default
            uk-card-body
            uk-flex-center
            uk-child-width-1-2
            uk-child-width-1-3@m
            uk-child-width-1-${userContext.user.admin_level > 1 ? "6" : "5"}@l
            `}
          uk-grid="true"
        >
          <div className="field uk-text-center">
            <div className="uk-card-title uk-text-primary">Number</div>
            <div className="uk-text-top">{userInfo.user_no}</div>
          </div>
          <div className="field uk-text-center">
            <div className="uk-card-title uk-text-primary">Name</div>
            <div className="uk-text-top">{userInfo.username}</div>
          </div>
          <div className="field uk-text-center">
            <div className="uk-card-title uk-text-primary">Email</div>
            <div className="uk-text-top">
              {userInfo.email.length === 0 ? "No Email" : userInfo.email}
            </div>
          </div>
          <div className="field uk-text-center">
            <div className="uk-card-title uk-text-primary">Phone</div>
            <div className="uk-text-top">{userInfo.phone}</div>
          </div>
          <div className="field uk-text-center">
            <div className="uk-card-title uk-text-primary">Address</div>
            <div className="uk-text-top">
              {userInfo.street_address} <br /> {userInfo.city}, {userInfo.state}{" "}
              {userInfo.zip}
            </div>
          </div>

          {userContext.user.admin_level > 1 && (
            <div className="field uk-text-center">
              <div className="uk-card-title uk-text-primary">Admin Level</div>
              <div className="uk-text-top">{userInfo.admin_level}</div>
              <button
                className="uk-text-top uk-button uk-button-default"
                uk-toggle="target: #show_edit_user"
                onClick={() => setShowEditUser(true)}
              >
                Edit
              </button>
            </div>
          )}
        </div>
        <div
          className="uk-margin uk-child-width-1-2@m uk-child-width-1-1@s"
          uk-grid="true"
        >
          {invoices.map((invoice, index) => {
            return (
              <InvoiceCard
                key={index}
                viewerInfo={userContext}
                sendSMS={_sendSMS}
                sendEmail={_sendEmail}
                viewByAdmin={
                  parseInt(invoice.preparer.id) === parseInt(userInfo.id)
                }
                deleteInvoice={_handleDeleteInvoice}
                info={invoice}
                isLoading={loading}
              />
            );
          })}
        </div>
        <div id="show_edit_user" uk-modal="true">
          {showEditUser && (
            <EditUser
              userInfo={userInfo}
              removeModal={_handleRemoveModal}
              showToast={_handleToast}
            />
          )}
        </div>
      </div>
    );
  }
  return <div>Loading ....</div>;
};

export default UserProfile;
