import React, { useRef } from "react";
import { postRequest } from "../utils/axios";

const CreateUser = ({ removeModal, showToast }) => {
  const username = useRef(null);
  const email = useRef(null);
  const phone = useRef(null);
  const _handleSubmit = async e => {
    try {
      e.preventDefault();
      await postRequest("/user/create", {
        username: username.current.value,
        email: email.current.value,
        phone: phone.current.value,
      });

      document.getElementById("modal-close-btn").click();
    } catch (err) {
      console.log(err);
      showToast(err, "warning");
    }
  };
  return (
    <div className="uk-modal-dialog uk-modal-body uk-padding-small">
      <button
        className="uk-button uk-modal-close uk-position-top-right"
        id="modal-close-btn"
        type="button"
        onClick={() => removeModal("invoice")}
        uk-close="true"
      />
      <form className="uk-form-stacked" onSubmit={_handleSubmit}>
        <div className="">
          <div className="uk-margin uk-child-width-1-2" uk-grid="true">
            <div className="input">
              <label className="uk-form-label" htmlFor="username">
                Name
              </label>
              <input
                className="uk-input"
                id="username"
                type="text"
                ref={username}
                onClick={() => username.current.focus()}
                placeholder="Name"
              />
            </div>
            <div className="input">
              <label className="uk-form-label" htmlFor="email">
                Email
              </label>
              <input
                className="uk-input"
                id="email"
                type="text"
                placeholder="email"
                ref={email}
                onClick={() => email.current.focus()}
              />
            </div>
            <div className="input">
              <label className="uk-form-label" htmlFor="phone">
                Phone
              </label>
              <input
                className="uk-input"
                id="phone"
                type="text"
                placeholder="phone"
                ref={phone}
                onClick={() => phone.current.focus()}
              />
            </div>
          </div>
          <button className="uk-button uk-button-secondary" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
