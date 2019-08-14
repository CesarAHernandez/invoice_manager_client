import React, { useRef, useState, useEffect } from "react";
import { putRequest } from "../utils/axios";
import PhoneInput from "react-phone-number-input/basic-input";
import CurrencyInput from "react-currency-input";

const EditUser = ({ userInfo, removeModal, showToast }) => {
  const [phone, setPhone] = useState(userInfo.phone || 0);
  const [loading, setLoading] = useState(false);
  const [zip, setZip] = useState(parseInt(userInfo.zip) || 0);

  const admin_level = useRef(null);
  const username = useRef(null);
  const email = useRef(null);
  const street_address = useRef(null);
  const city = useRef(null);
  const state = useRef(null);

  useEffect(() => {
    return () => {
      removeModal();
    };
  }, []);
  const _handleSubmit = async e => {
    try {
      setLoading(true);
      e.preventDefault();

      const userObject = {
        id: userInfo.id,
        username: username.current.value,
        phone,

        email: email.current.value,
        street_address: street_address.current.value,
        city: city.current.value,
        state: state.current.value,
        zip,
        admin_level: admin_level.current.value,
      };
      const response = await putRequest("/user/edit", userObject);
      if (response.status === 200) {
        showToast("User successfully Edited", "success");
      } else {
        showToast("User not edited", "warning");
      }
    } catch (err) {
      showToast("User not edited", "warning");
    }
    setTimeout(() => {
      setLoading(false);
      document.getElementById("modal-close-btn").click();
    }, 500);
  };
  return (
    <div className="uk-modal-dialog uk-modal-body uk-padding-small">
      <button
        className="uk-button uk-modal-close uk-position-top-right"
        id="modal-close-btn"
        type="button"
        onClick={removeModal}
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
                defaultValue={userInfo.username}
                ref={username}
                onClick={() => username.current.focus()}
                placeholder="First and Last Name"
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
                defaultValue={userInfo.email}
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
                defaultValue={userInfo.street_address}
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
                defaultValue={userInfo.state}
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
                defaultValue={userInfo.city}
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
            <div className="input">
              <label className="uk-form-label" htmlFor="admin-level">
                Admin Level
              </label>
              <input
                className="uk-input"
                id="admin-level"
                min={0}
                max={3}
                defaultValue={userInfo.admin_level}
                ref={admin_level}
                onClick={() => admin_level.current.focus()}
                type="number"
              />
            </div>
          </div>
          <button className="uk-button uk-button-secondary" type="submit">
            Submit
          </button>
        </div>
      </form>
      <div>
        {loading && (
          <div className="uk-overlay-default uk-position-cover">
            <div className="uk-position-center">
              <div uk-spinner="ratio: 3" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditUser;
