import React, { useEffect, useState } from "react";
import { getRequest, postRequest } from "../utils/axios";

const SetingsPage = ({ history }) => {
  const [SMTPEmail, setSMTPEmail] = useState();
  const [twilioPhone, setTwilioPhone] = useState();
  const [loading, setLoading] = useState(true);

  const fetchOptions = async () => {
    try {
      const request = await getRequest("/option/all");
      const settings = request.data.settingResponse;
      setSMTPEmail(settings.SMTPEmail);
      setTwilioPhone(settings.twilioPhone);
      setLoading(false);
    } catch (err) {
      history.replace("/404");
    }
  };
  useEffect(() => {
    fetchOptions();
  }, []);

  const _handleSubmit = async () => {
    setLoading(true);
    // Getting the information from the values and send them over a post request
    const options = [
      {
        option: "SMTPEmail",
        value: SMTPEmail,
      },
      {
        option: "twilioPhone",
        value: twilioPhone,
      },
    ];
    try {
      await postRequest("/option/update", options);
      // Slow it down
      setTimeout(() => {
        setLoading(false);
        fetchOptions();
      }, 1000);
    } catch (err) {
      console.log(err);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div>
      <h2>Settings Page (Work in Progress)</h2>

      <div className="uk-child-width-1-3" ukgrid="true">
        <div className="input">
          <label className="uk-form-label" htmlFor="username">
            Phone number
          </label>
          <input
            className="uk-input"
            id="phone"
            type="text"
            value={twilioPhone}
            onChange={e => setTwilioPhone(e.target.value)}
            placeholder="+13339876543"
          />
        </div>
        <div className="input">
          <label className="uk-form-label" htmlFor="username">
            Email
          </label>
          <input
            className="uk-input"
            id="email"
            type="emai"
            value={SMTPEmail}
            onChange={e => setSMTPEmail(e.target.value)}
            placeholder="test@gmail.com"
          />
        </div>
        <button
          className="uk-button uk-button-primary"
          onClick={_handleSubmit}
          disabled={loading}
        >
          {loading ? <div uk-spinner="true"></div> : "Save"}
        </button>
      </div>
    </div>
  );
};

export default SetingsPage;
