import React, { useRef, useState } from "react";
import PhoneInput from "react-phone-number-input/basic-input";
import CurrencyInput from "react-currency-input";
import { postRequest } from "../utils/axios";

const CreateUser = ({ removeModal, showToast }) => {
  const [phone, setPhone] = useState(null);
  const username = useRef(null);
  const email = useRef(null);
  const street_address = useRef(null);
  const city = useRef(null);
  const state = useRef(null);
  const [zip, setZip] = useState(0);

  const _handleSubmit = async e => {
    try {
      e.preventDefault();
      await postRequest("/user/create", {
        username: username.current.value,
        email: email.current.value,
        phone,
        street_address: street_address.current.value,
        city: city.current.value,
        state: state.current.value,
        zip,
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
                Name (First Last)
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
              <PhoneInput
                className="uk-input"
                country="US"
                value={phone || ""}
                onChange={value => setPhone(value)}
              />
            </div>
            <div className="input">
              <label className="uk-form-label" htmlFor="street_address">
                Street Address
              </label>
              <input
                className="uk-input"
                id="street_address"
                type="text"
                placeholder="Street Addres"
                ref={street_address}
                onClick={() => street_address.current.focus()}
              />
            </div>
            <div className="input">
              <label className="uk-form-label" htmlFor="state">
                State
              </label>
              <input
                className="uk-input"
                id="state"
                type="text"
                placeholder="State"
                ref={state}
                onClick={() => state.current.focus()}
              />
            </div>
            <div className="input">
              <label className="uk-form-label" htmlFor="city">
                City
              </label>
              <input
                className="uk-input"
                id="city"
                type="text"
                placeholder="city"
                ref={city}
                onClick={() => city.current.focus()}
              />
            </div>
            <div className="input">
              <label className="uk-form-label" htmlFor="zip">
                Zipcode
              </label>
              <CurrencyInput
                className="uk-input"
                id="zip"
                type="text"
                precision={0}
                decimalSeparator=""
                thousandSeparator=""
                suffix=""
                value={zip}
                onChangeEvent={(e, value, floatValue) => setZip(floatValue)}
                placeholder="90242"
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
