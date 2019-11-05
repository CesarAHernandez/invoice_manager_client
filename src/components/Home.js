import React, { useState, useContext, useRef } from "react";
import { postRequest } from "../utils/axios";
import UserContext from "./UserContext";

const Home = ({ history }) => {
  const userContext = useContext(UserContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const email = useRef(null);
  const password = useRef(null);
  const phone = useRef(null);

  const _handleFormSubmit = async e => {
    try {
      e.preventDefault();

      setLoading(true);
      const response = await postRequest("/user/login", {
        email: email.current.value,
        password: password.current.value,
      });
      switch (response.status) {
        case 200:
          response.data.user.phone = phone.current.value;
          userContext.handleLogin(response.data.user, history);
          setLoading(false);
          break;
        case 204:
          setError("User does not exist");
          setLoading(false);
          break;
        case 401:
          setError("Invalid password");
          setLoading(false);
          break;
        default:
          setError("Invalid password");
          setLoading(false);
          break;
      }
    } catch (err) {
      console.log("err", err);
    }
    setLoading(false);
  };
  return (
    <div className="uk-container  uk-padding">
      {error && (
        <div className="uk-text-danger uk-flex uk-flex-center">{error}</div>
      )}
      <div className="uk-flex uk-flex-column uk-flex-center uk-padding">
        <div>
          email: admin@gmail.com<br></br>
          password: admin
        </div>
        <div>
          Note* The phone number is not required, but if you want to see text
          message integration please use a phone number.<br></br> Follow the
          pattern:+1[phonenumber]
        </div>
      </div>

      <div className="uk-flex uk-flex-center">
        <form className="uk-form-stacked" onSubmit={_handleFormSubmit}>
          <div className="uk-width-1-1 uk-margin">
            <label className="uk-label">Email</label>
            <input
              className="uk-input"
              placeholder="email"
              type="text"
              ref={email}
              onClick={() => email.current.focus()}
            />
          </div>
          <div className="uk-width-1-1 uk-margin">
            <label className="uk-label">Password</label>
            <input
              className="uk-input"
              placeholder="password"
              type="password"
              ref={password}
              onClick={() => password.current.focus()}
            />
          </div>
          <div className="uk-width-1-1 uk-margin">
            <label className="uk-label">Phone Number</label>
            <input
              className="uk-input"
              placeholder="+15629390904"
              type="text"
              ref={phone}
              onClick={() => phone.current.focus()}
            />
          </div>
          <button
            className="uk-button uk-button-primary"
            type="submit"
            disabled={loading}
          >
            {!loading ? "Submit" : "Loading..."}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
