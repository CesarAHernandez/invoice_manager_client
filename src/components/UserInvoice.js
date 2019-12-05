import React, { useState, useRef } from "react";
import { getRequest } from "../utils/axios";
import UserPayment from "./UserPayment";

const UserInvoice = () => {
  const code = useRef(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  const _handleGoBack = () => {
    setUser(null);
    setInvoice(null);
    setError(null);
  };

  const _handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (code.current.value.length === 0) {
        setError("Please Enter your code");
        return;
      }
      const regex = RegExp("[a-zA-Z0-9]{7}-[a-zA-Z0-9]{7}", "g");
      if (!regex.test(code.current.value)) {
        setError(
          "Please make sure that the code is in the format xxxxxxx-xxxxxxx"
        );
        return;
      }
      const [user_no, inv_no] = code.current.value.split("-");
      console.log(user_no, inv_no);
      const response = await getRequest(`/user/${user_no}/invoice`);
      console.log(response);
      if (response.status !== 200) {
        console.log("error", response);
        setError(
          "Please check if the code is correct, if this persist try again later or call your agent"
        );
        return;
      }
      setUser(response.data.user);
      const invoice = response.data.user[0].invoices.filter(
        invoice => invoice.inv_no === inv_no
      );
      console.log("invoice", invoice);
      // response.data.user[0].invoices.forEach(invoice => {
      //   if (invoice.inv_no === inv_no) {
      //     setTimeout(() => {
      //       setLoading(false);
      //       setInvoice(invoice);
      //     }, 1500);
      //   }
      // });
      if (invoice.length === 0) {
        setError(
          "Please check if the code is correct, if this persist try again later or call your agent"
        );
        return;
      }
      setTimeout(() => {
        setInvoice(invoice[0]);
        setLoading(false);
      }, 1500);
      console.log(response.data);
    } catch (err) {
      setLoading(false);
      setError(
        "Please check if the code is correct, if this persist try again later or call your agent"
      );
      console.log(err);
    }
  };
  if (user && invoice) {
    return <UserPayment goBack={_handleGoBack} user={user} invoice={invoice} />;
  }
  return (
    <div className="uk-container">
      <h1 className="uk-heading-medium uk-text-center">
        Enter the code to view your invoice
      </h1>
      <form
        className="uk-form-stacked uk-text-center "
        onSubmit={_handleSubmit}
      >
        {error && <div>{error}</div>}
        <div className="uk-form-controls" uk-grid="true">
          <div
            className="
          input uk-width-1-1
          input uk-width-1-2@s
          input uk-width-1-3@m
          uk-align-center"
          >
            <label className="uk-form-label" htmlFor="code_input">
              Code
            </label>
            <input
              id="code_input"
              className="uk-input"
              type="text"
              onClick={() => code.current.focus()}
              ref={code}
              placeholder="1f008b1-9ac57cb"
              name="isDiscounted"
            />
          </div>
          <div
            className="
          uk-align-center
          uk-width-1-1"
          >
            <button
              className="
              uk-button
              uk-button-primary
              uk-width-1-1
              uk-width-1-2@s
              uk-width-1-3@m
              "
              type="submit"
              disabled={loading}
            >
              {loading ? <div uk-spinner="true"></div> : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserInvoice;
