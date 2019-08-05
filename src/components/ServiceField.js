import React, { useEffect, useState } from "react";

const ServiceField = ({
  index,
  serviceInfo,
  removeService,
  updateServiceInfo,
}) => {
  const [price, setPrice] = useState(serviceInfo.price);
  const [service, setService] = useState(serviceInfo.service);

  useEffect(() => {
    updateServiceInfo(service, price, index);
  }, [price, service]);

  return (
    <div className="uk-flex uk-flex-between uk-padding-small uk-padding-remove-top uk-padding-remove-horizontal">
      <div
        style={{ paddingRight: 5 }}
        className="remove_icon uk-flex uk-flex-column uk-flex-center"
      >
        <span
          style={{ color: "red", cursor: "pointer" }}
          uk-icon="icon:minus-circle; ratio: 1.4"
          onClick={() => removeService(index)}
        />
      </div>
      <div className="service_description uk-width-1-1 uk-padding-small uk-padding-remove-vertical uk-padding-remove-left">
        <input
          className="uk-input"
          type="text"
          placeholder="Tax return"
          value={service}
          onChange={e => setService(e.target.value)}
        />
      </div>
      <div className="price uk-width-1-3">
        <div className="uk-inline">
          <span className="uk-form-icon">$</span>
          <input
            className="uk-input"
            id="price"
            type="text"
            placeholder="10.00"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceField;
