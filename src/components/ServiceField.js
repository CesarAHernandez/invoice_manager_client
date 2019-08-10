import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import CurrencyInput from "react-currency-input";
// TODO: Figure this out
// require("../uikit-icons.min.js");
// require("../uikit.min.js");

const ServiceField = ({
  index,
  serviceInfo,
  removeService,
  updateTotal,
  updateServiceInfo,
}) => {
  const [price, setPrice] = useState(serviceInfo.price);
  const [service, setService] = useState(serviceInfo.service);

  useEffect(() => {
    updateServiceInfo(service, price, index);
    console.log(updateTotal());
  }, [price, service]);

  const handleChange = (newValue, actionMeta) => {
    console.group("Value Changed");
    console.log(newValue);
    setService(newValue.label);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };
  const handleInputChange = (newValue, actionMeta) => {
    console.group("input Changed");
    console.log(newValue);
    if (newValue.length > 0) {
      setService(newValue);
    }
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };
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
        <CreatableSelect
          isClearable={true}
          defaultInputValue={serviceInfo.service}
          options={[{ label: "Test", value: "test1" }]}
          onInputChange={(newValue, actionMeta) =>
            newValue && newValue.length > 0 && setService(newValue)
          }
          onChange={(newValue, actionMeta) =>
            newValue && setService(newValue.label)
          }
          // onChange={handleChange}
          // onInputChange={handleInputChange}
        />
      </div>
      <div className="price uk-width-1-3">
        <div className="uk-inline">
          <span className="uk-form-icon">$</span>
          <CurrencyInput
            className="uk-input"
            id="price"
            placeholder="100.00"
            value={price}
            onChangeEvent={e => setPrice(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceField;
