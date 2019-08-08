import React, { useState, useRef } from "react";
import { getRequest } from "../utils/axios";
import UserPayment from "./UserPayment";

const UserInvoice = () => {
  const code = useRef(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [invoice, setInvoice] = useState(null);

  const _handleGoBack = () => {
    setUser(null);
    setInvoice(null);
    setError(null);
  };

  const _handleSubmit = async e => {
    e.preventDefault();
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
      const response = await getRequest(`/user/${user_no}/invoice`);
      if (response.status !== 200) {
        console.log("error", response);
        setError(
          "Please check if the code is correct, if this persist try again later or call your agent"
        );
        return;
      }
      setUser(response.data.user);
      response.data.invoices.forEach(invoice => {
        if (invoice.inv_no === inv_no) {
          setInvoice(invoice);
        }
      });
      if (!invoice) {
        setError(
          "Please check if the code is correct, if this persist try again later or call your agent"
        );
        return;
      }
      console.log(response.data);
    } catch (err) {
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
      <form className="uk-form-stacked uk-text-center" onSubmit={_handleSubmit}>
        {error && <div>{error}</div>}
        <label className="uk-form-label" htmlFor="code_input">
          Code
        </label>
        <input
          id="code_input"
          className="uk-input uk-width-1-4"
          type="text"
          onClick={() => code.current.focus()}
          ref={code}
          placeholder="1f008b1-9ac57cb"
          name="isDiscounted"
        />
        <button className="uk-button uk-button-primary" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserInvoice;
