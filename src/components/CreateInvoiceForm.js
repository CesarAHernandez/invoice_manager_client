import React, { useState, useRef, useEffect } from "react";
import numeral from "numeral";
import Select from "react-select";
import CurrencyInput from "react-currency-input";

import ServiceField from "./ServiceField";
import { postRequest, getRequest } from "../utils/axios";
// TODO: Replace payment methed with amount due and amount piad
const CreateInvoiceForm = ({ handleLoading, handleCompleted }) => {
  const [services, setServices] = useState([
    { service: "", price: "", qty: 1 },
  ]);
  const [pricePaid, setPricePaid] = useState(null);
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
    setTotalPrice(calculateTotal()[1]);
  }, [services]);

  useEffect(() => {
    handleLoading(true);
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
      handleLoading(false);
      setRecepients(formatedUsers);
    };
    getAllRecepients();
  }, []);
  const calculateTotal = () => {
    let totalAmount = services.reduce((acc, curr) => {
      return numeral(acc)
        .add(curr.price.replace(/,/g, ""))
        .format("0.00");
    }, 0);
    const originalAmount = totalAmount;

    if (!isDiscounted) {
      return [originalAmount, totalAmount];
    }
    const discount = `${100 - discountAmount.current.value}%`;
    totalAmount = numeral(discount)
      .multiply(totalAmount)
      .format("0.00");
    return [originalAmount, totalAmount];
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
      qty: 1,
    };
    const _services = services;
    _services[index] = updatedServiceInfo;
    setServices(_services);
  };
  const _handleSubmit = async e => {
    try {
      handleLoading(true);
      e.preventDefault();
      const [subTotal, totalPrice] = calculateTotal();
      const object = {
        user_id: selectedUser.value,
        services,
        isDiscounted,
        ammount_paid: pricePaid || numeral(0).format(0.0),
        ammount_due: numeral(totalPrice)
          .subtract(pricePaid || 0)
          .format("0.00"),
        discount_amount: discountAmount.current.value,
        original_price: subTotal,
        // paymentMethod: paymentMethod.current.method,
        // methodNumber: paymentMethod.current.number,
        days_to_pay: daysToPay.current.value,
        total_price: totalPrice,
      };

      console.log(object);
      const result = await postRequest("/admin/invoice/create", object);
      handleLoading(false);
      handleCompleted(null);
    } catch (err) {
      console.log(err);
      handleCompleted(false);
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
                setServices([...services, { service: "", price: "", qty: 1 }]);
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
      <div className="uk-form-controls uk-child-width-1-2" uk-grid="true">
        <div className="price-paid">
          <label className="uk-form-label" htmlFor="price-paid">
            Price Paid
          </label>
          <div className="uk-inline">
            <span className="uk-form-icon">$</span>
            <CurrencyInput
              className="uk-input"
              id="price-paid"
              placeholder="100.00"
              value={pricePaid}
              onChangeEvent={e => setPricePaid(e.target.value)}
            />
          </div>
        </div>
        <div className="days-to-pay">
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
        disabled={services.length <= 0 || selectedUser === null}
      >
        Submit
      </button>
    </form>
  );
};

export default CreateInvoiceForm;
