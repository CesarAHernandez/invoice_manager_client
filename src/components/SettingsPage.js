import React, { useEffect, useState } from "react";
import { getRequest } from "../utils/axios";

const SetingsPage = () => {
  const [SMTPEmail, setSMTPEmail] = useState();
  const [twilioPhone, setTwilioPhone] = useState();
  useEffect(() => {
    const fetchOptions = async () => {
      const request = await getRequest("/option/all");
      const settings = request.data.settingResponse;
      setSMTPEmail(settings.SMTPEmail);
      setTwilioPhone(settings.twilioPhone);
    };
    fetchOptions();
  }, []);

  return (
    <div>
      <h2>Settings Page</h2>

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
      </div>
    </div>
  );
};

export default SetingsPage;
