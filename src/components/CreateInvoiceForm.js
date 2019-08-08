import React, { useState, useRef, useEffect } from "react";
import numeral from "numeral";
import Select from "react-select";

import ServiceField from "./ServiceField";
import { postRequest, getRequest } from "../utils/axios";

const CreateInvoiceForm = ({ handleLoading, handleCompleted }) => {
  const [services, setServices] = useState([{ service: "", price: "" }]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [recepients, setRecepients] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const paymentMethod = useRef({ method: "Cash", number: null });
  const [originalAmount, setOriginalAmount] = useState(0);
  const [isDiscounted, setIsDiscounted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const discountAmount = useRef(null);
  const daysToPay = useRef(null);

  useEffect(() => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
    }, 1);
    setTotalPrice(calculateTotal());
  }, [services]);

  useEffect(() => {
    const getAllRecepients = async () => {
      const result = await getRequest("/users/all");
      result.data.users.sort((a, b) =>
        a.username > b.username
          ? 1
          : a.username === b.username
          ? a.username.length > b.username.length
            ? 1
            : -1
          : -1
      );
      const formatedUsers = [];
      result.data.users.forEach(user => {
        formatedUsers.push({
          value: user.id,
          label: `#${user.user_no}) ${user.username}`,
        });
      });
      setRecepients(formatedUsers);
    };
    getAllRecepients();
  }, []);
  const calculateTotal = () => {
    let totalAmount = services.reduce((acc, curr) => {
      console.log(curr);
      return numeral(acc)
        .add(curr.price.replace(/,/g, ""))
        .format("0.00");
    }, 0);
    setOriginalAmount(totalAmount);

    if (!isDiscounted) {
      return totalAmount;
    }
    const discount = `${100 - discountAmount.current.value}%`;
    return numeral(discount)
      .multiply(totalAmount)
      .format("0.00");
  };
  const _removeService = indxRemove => {
    const filteredServices = services.filter((service, index) => {
      if (index !== indxRemove) {
        return service;
      }
    });

    setServices(filteredServices);
  };
  const _updateServiceInfo = (service, price, index) => {
    const updatedServiceInfo = {
      service,
      price,
    };
    const _services = services;
    _services[index] = updatedServiceInfo;
    setServices(_services);
  };
  const _handleSubmit = async e => {
    try {
      handleLoading(true);
      e.preventDefault();
      const object = {
        user_id: selectedUser.value,
        services,
        isDiscounted,
        discount_amount: discountAmount.current.value,
        original_price: originalAmount,
        paymentMethod: paymentMethod.current.method,
        methodNumber: paymentMethod.current.number,
        days_to_pay: daysToPay.current.value,
        total_price: calculateTotal(),
      };

      console.log(selectedUser);
      const result = await postRequest("/admin/invoice/create", object);
      handleLoading(false);
      handleCompleted(null);
    } catch (err) {
      console.log(err);
      handleCompleted(err);
    }
  };
  const renderServices = () =>
    services.map((service, index) => (
      <ServiceField
        key={index}
        index={index}
        serviceInfo={service}
        updateServiceInfo={_updateServiceInfo}
        removeService={_removeService}
      />
    ));
  return (
    <form className="uk-form-stacked" onSubmit={_handleSubmit}>
      <div className="">
        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="form-stacked-select">
            Recepient
          </label>
          <div className="uk-form-controls">
            <Select
              value={selectedUser}
              onChange={user => setSelectedUser(user)}
              options={recepients}
            />
            {/* <select
              className="uk-select"
              onChange={e => (user.current = e.target.value)}
              id="form-stacked-select"
            >
              <option value="-1">Choose a person</option>
              {recepients.map((recepient, index) => {
                return (
                  <option key={index} value={recepient.id}>{`#${
                    recepient.user_no
                  } ${recepient.username}`}</option>
                );
              })}
            </select> */}
          </div>
        </div>
        <div className="service">
          <div className="headers uk-flex uk-flex-between">
            <span className="uk-width-1-1 uk-padding-small uk-padding-remove-vertical uk-padding-remove-left">
              Service
            </span>
            <span className="uk-width-1-3">Price</span>
          </div>
          <div>{isUpdating ? "Loading" : renderServices()}</div>
          <div className="add_service uk-width-1-1">
            <span
              onClick={() => {
                setServices([...services, { service: "", price: "" }]);
              }}
              className="uk-align-right"
              style={{ color: "green", cursor: "pointer" }}
              uk-icon="icon:plus-circle; ratio: 1.2"
            />
          </div>
        </div>
      </div>

      <div className="uk-child-width-expand" uk-grid="true">
        <div>
          <label>
            <input
              className="uk-checkbox"
              type="checkbox"
              name="isDiscounted"
              onChange={e => setIsDiscounted(e.target.checked)}
            />
            Discount
          </label>
        </div>

        <div>
          <label className="uk-form-label" htmlFor="discount_amount">
            Discount Amount
          </label>
          <input
            className="uk-input"
            id="discount_amount"
            type="number"
            pattern="[0-9]{1-3}"
            placeholder="10,20,30..."
            min="0"
            max="100"
            disabled={!isDiscounted}
            onClick={() => discountAmount.current.focus()}
            ref={discountAmount}
          />
        </div>
      </div>
      <div className="uk-form-controls uk-padding-small uk-padding-remove-horizontal">
        <select
          className="uk-select"
          onChange={e => (paymentMethod.current.method = e.target.value)}
          id="paymentMethod"
        >
          <option value={0}>Choose Payment Method</option>
          <option>Cash</option>
          <option>PayPal</option>
          <option>Credit Card</option>
          <option>Check</option>
        </select>

        <div className="uk-padding-small uk-padding-remove-horizontal">
          <label className="uk-form-label" htmlFor="days_to_pay">
            # of Days to Pay
          </label>
          <input
            className="uk-input"
            id="days_to_pay"
            type="number"
            pattern="[0-9]{1-3}"
            placeholder="1,2,3"
            min="0"
            max="365"
            onClick={() => daysToPay.current.focus()}
            ref={daysToPay}
          />
        </div>
      </div>

      <div className="total">
        <div>
          <span>Total: </span>${totalPrice}
        </div>
      </div>
      <button
        className="uk-button uk-button-secondary"
        type="submit"
        disabled={services.length <= 0}
      >
        Submit
      </button>
    </form>
  );
};

export default CreateInvoiceForm;
