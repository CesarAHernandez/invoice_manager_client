import React from "react";

const CreateUser = ({ removeModal, showToast }) => {
  const _handleSubmit = e => {
    e.preventDefault();
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
