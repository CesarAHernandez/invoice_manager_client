import axios from "axios";
axios.defaults.baseURL = "https://invoicemanager-rem.herokuapp.com/";

export const getRequest = route =>
  axios
    .get(route)
    .then(result => result)
    .catch(e => e);

export const postRequest = (route, data) =>
  axios
    .post(route, data)
    .then(result => result)
    .catch(e => e);

export const putRequest = (route, data) =>
  axios
    .put(route, data)
    .then(result => result)
    .catch(e => e);
