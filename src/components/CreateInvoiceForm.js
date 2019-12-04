import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useReducer,
} from "react";
import UserContext from "./UserContext";
import numeral from "numeral";
import Select from "react-select";
import CurrencyInput from "react-currency-input";

import ServiceField from "./ServiceField";
import { postRequest, getRequest } from "../utils/axios";

// TODO: Replace payment methed with amount due and amount piad
const CreateInvoiceForm = ({ handleLoading, handleCompleted }) => {
  const userContext = useContext(UserContext);
  const [pricePaid, setPricePaid] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [recepients, setRecepients] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isDiscounted, setIsDiscounted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const daysToPay = useRef(null);

  useEffect(() => {
    calculateTotal();
  }, [discountAmount, pricePaid]);

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

  const [services, dispatch] = useReducer(
    (services, { type, indx, serviceInfo }) => {
      switch (type) {
        case "add":
          return [...services, { service: "", price: "", qty: 1 }];
        case "remove":
          if (services.length === 1) {
            return [{ service: "", price: "", qty: 1 }];
          } else {
            return services.filter((_, index) => index !== indx);
          }
        case "update":
          // Replace a services with a new one with the updated values
          services.splice(indx, 1, { ...serviceInfo, qty: 1 });
          return services;
        default:
          console.log("default");
          return services;
      }
    },
    [{ service: "", price: "", qty: 1 }]
  );
  useEffect(() => {
    console.log("Services updated", services);
  }, [services]);
  //When we are deleteing we have to re-render the list
  useEffect(() => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
    }, 100);
    calculateTotal();
  }, [services]);
  const calculateTotal = () => {
    try {
      let totalAmount = services.reduce((acc, curr) => {
        return numeral(acc)
          .add(curr.price.replace(/,/g, ""))
          .format("0.00");
      }, 0);
      const originalAmount = totalAmount;

      if (!isDiscounted) {
        // totalAmount = numeral(totalAmount)
        //   .subtract(pricePaid)
        //   .format("0.00");
        // This will show the amount due
        setTotalPrice(
          numeral(totalAmount)
            .subtract(pricePaid)
            .format("0.00")
        );
        return [originalAmount, totalAmount];
      }
      const discount = `${100 - discountAmount}%`;
      totalAmount = numeral(discount)
        .multiply(totalAmount)
        .format("0.00");
      // This will show the amount due
      setTotalPrice(
        numeral(totalAmount)
          .subtract(pricePaid)
          .format("0.00")
      );
      return [originalAmount, totalAmount];
    } catch (err) {
      console.log(err);
      return [0, 0];
    }
  };
  const _handleSubmit = async e => {
    try {
      handleLoading(true);
      e.preventDefault();
      const [subTotal, totalPrice] = calculateTotal();

      const updatedServices = [];
      services.forEach(service => {
        service.totalPrice = numeral(service.price)
          .multiply(service.qty)
          .format("0.00");
        updatedServices.push(service);
      });
      console.log(updatedServices);

      const object = {
        user_id: selectedUser.value,
        services: updatedServices,
        isDiscounted,
        ammount_paid: pricePaid || numeral(0).format(0.0),
        ammount_due: numeral(totalPrice)
          .subtract(pricePaid || 0)
          .format("0.00"),
        discount_amount: discountAmount,
        original_price: subTotal,
        days_to_pay: daysToPay.current.value,
        total_price: totalPrice,
        preparer: userContext.user.id,
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
          <div>
            <button type="button" onClick={() => console.log(services)}>
              Check Services
            </button>

            {isUpdating ? (
              <div
                style={{
                  height: `${(services.length > 0 ? services.length : 1) *
                    58}px`,
                }}
              >
                <div uk-spinner="ratio: 2" />
              </div>
            ) : (
              services.map((service, index) => (
                <ServiceField
                  key={index}
                  index={index}
                  updateTotal={calculateTotal}
                  serviceInfo={service}
                  updateServiceInfo={(index, serviceInfo) => {
                    dispatch({ type: "update", indx: index, serviceInfo });
                    calculateTotal();
                  }}
                  removeService={index => {
                    dispatch({ type: "remove", indx: index });
                  }}
                />
              ))
            )}
          </div>
          <div className="add_service uk-width-1-1">
            <span
              className="uk-align-right fa fa-plus-square fa-lg"
              style={{ color: "green", cursor: "pointer" }}
              onClick={() => dispatch({ type: "add" })}
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
          <CurrencyInput
            className="uk-input"
            id="discount_amount"
            type="text"
            precision={0}
            decimalSeparator=""
            thousandSeparator=""
            suffix="%"
            value={discountAmount}
            onChangeEvent={(e, value, floatValue) =>
              setDiscountAmount(floatValue)
            }
            placeholder="10,20,30..."
            disabled={!isDiscounted}
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
            defaultValue={1}
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
