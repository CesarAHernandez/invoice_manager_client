import axios from "axios";
import { siteOptions } from "../config/siteOptions";
axios.defaults.baseURL = siteOptions.url;
// axios.defaults.baseURL = "https://invoicemanager-rem.herokuapp.com/";

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

export const deleteRequest = route =>
  axios
    .delete(route)
    .then(result => result)
    .catch(e => e);
export const putRequest = (route, data) =>
  axios
    .put(route, data)
    .then(result => result)
    .catch(e => e);
