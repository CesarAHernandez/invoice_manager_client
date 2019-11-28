import React, { useRef, useState, useContext, useEffect } from "react";
import UserContext from "./UserContext";
import PhoneInput from "react-phone-number-input/basic-input";
import CurrencyInput from "react-currency-input";
import { postRequest } from "../utils/axios";

const CreateUser = ({ removeModal, showToast }) => {
  const userContext = useContext(UserContext);
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const username = useRef(null);
  const email = useRef(null);
  const street_address = useRef(null);
  const city = useRef(null);
  const state = useRef(null);
  const [zip, setZip] = useState(0);
  const adminLevel = useRef(null);
  const password = useRef(null);

  useEffect(() => {
    return () => removeModal("user");
  }, []);

  const _handleSubmit = async e => {
    setLoading(true);
    try {
      e.preventDefault();
      console.log(isAdmin);
      const response = await postRequest("/user/create", {
        username: username.current.value,
        email: email.current.value,
        phone,
        street_address: street_address.current.value,
        city: city.current.value,
        state: state.current.value,
        zip,
        admin_level: isAdmin ? adminLevel.current.value : 0,
        password: password.current.value,
      });

      if (response.status === 200) {
        showToast("User Was Added", "success");
      } else {
        showToast("Somethnig went wrong Adding User", "Warning");
      }
    } catch (err) {
      console.log(err);
      showToast(err, "warning");
    }
    setTimeout(() => {
      setLoading(false);
      document.getElementById("modal-close-btn").click();
    }, 300);
  };
  return (
    <div className="uk-modal-dialog uk-modal-body uk-padding-small">
      <button
        className="uk-button uk-modal-close uk-position-top-right"
        id="modal-close-btn"
        type="button"
        onClick={() => removeModal("user")}
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

            {userContext.user.admin_level > 1 && (
              <div className="input">
                <button
                  className="uk-button uk-button-default"
                  uk-toggle="target: #admin-inputs"
                  type="button"
                >
                  For Adimn?
                </button>
                <div id="admin-inputs" hidden={true}>
                  <label className="uk-form-label" htmlFor="admin">
                    Is Admin
                  </label>
                  <input
                    className="uk-checkbox"
                    checked={isAdmin}
                    onChange={e => setIsAdmin(e.target.checked)}
                    id="admin"
                    type="checkbox"
                  />
                  <label className="uk-form-label" htmlFor="admin-level">
                    Admin Level
                  </label>
                  <input
                    className="uk-input"
                    id="admin-level"
                    min={1}
                    max={3}
                    ref={adminLevel}
                    onClick={() => adminLevel.current.focus()}
                    type="number"
                  />
                  <label className="uk-form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="uk-input"
                    id="password"
                    ref={password}
                    onClick={() => password.current.focus()}
                    type="password"
                  />
                </div>
              </div>
            )}
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

export default CreateUser;
