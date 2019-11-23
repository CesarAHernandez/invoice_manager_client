import React, { useEffect, useState, useContext } from "react";
import UserContext from "./UserContext";
import InvoiceCard from "./InvoiceCard";
import EditUser from "./EditUser";
import { getRequest, postRequest, deleteRequest } from "../utils/axios";
import { sendSMS, sendEmail } from "../utils/communication";
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
        // TODO: If the user is an admin then show them what invoice that person has done
        let invoices = [];
        if (userContext.user.admin_level > 1) {
          const response = await postRequest(
            "/admin/invoice/preparer/invoices",
            {
              id: request.data.user.id,
            }
          );
          invoices = response.data.invoices;
        }
        console.log(request);
        setUserInfo(request.data.user[0]);
        setInvoices([
          ...(request.data.user[0].invoices || []),
          ...(invoices || []),
        ]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserInfo();
  }, [updated]);

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
      // UIkit.notification({ message: "Email Sent", status: "success" });
    } catch (error) {
      try {
        //eslint-disable-next-line no-undef
        // UIkit.notification({ message: error.message, status: "warning" });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const _sendSMS = async invoice => {
    try {
      setLoading(true);
      const body = `
      Hello ${userInfo.username},
      Your invoice is ready to be viewed
      Invoice Number: #${invoice.inv_no}
      Total Amount: $${invoice.total_price}

      Code: ${userInfo.user_no}-${invoice.inv_no}

      Link: http://localhost/user/invoice/view

      Please do not reply to this number.`;

      console.log(userContext.user.phone);
      //TODO: Phone needs to be changed to userInfo.phone for production
      await sendSMS(userContext.user.phone, body);
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
  const _handleRemove = () => {
    setShowEditUser(false);
    setUpdated(updated + 1);
  };
  const _handleDeleteInvoice = async id => {
    //eslint-disable-next-line no-restricted-globals
    if (confirm("Are you sure you want to delete")) {
      console.log(id);
      console.log("We want to delete this invoice");
      try {
        await deleteRequest(`admin/invoice/${id}/delete`);
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
        {userContext.user.admin_level > 1 ? (
          <div
            className="uk-card uk-card-default uk-card-body uk-child-width-1-5"
            uk-grid="true"
          >
            <div className="uk-card-title">Number</div>
            <div className="uk-card-title">Name</div>
            <div className="uk-card-title">Phone</div>
            <div className="uk-card-title">Address</div>
            <div className="uk-card-title">Admin Level</div>
            <div className="uk-text-top">{userInfo.user_no}</div>
            <div className="uk-text-top">{userInfo.username}</div>
            <div className="uk-text-top">{userInfo.phone}</div>
            <div className="uk-text-top">
              {userInfo.street_address} <br /> {userInfo.city}, {userInfo.state}{" "}
              {userInfo.zip}
            </div>
            <div>
              <div className="uk-text-top">{userInfo.admin_level}</div>
              <button
                className="uk-text-top uk-button uk-button-default"
                uk-toggle="target: #show_edit_user"
                onClick={() => setShowEditUser(true)}
              >
                Edit
              </button>
            </div>
          </div>
        ) : (
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
        )}
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
                viewByAdmin={
                  parseInt(invoice.preparer) === parseInt(userInfo.id)
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
              removeModal={_handleRemove}
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
