import axios from "axios";
import { verify } from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";
import { siteOptions } from "../config/siteOptions";
axios.defaults.baseURL = siteOptions.url + siteOptions.api_prefix;

axios.interceptors.request.use(function(config) {
  try {
    const user = verify(localStorage.getItem("user_state"), jwtConfig.secret);
    console.log(
      "axios user",
      `${user.user.token.type} ${user.user.token.token}`
    );
    config.headers.Authorization = `${user.user.token.type} ${user.user.token.token}`;
    return config;
  } catch (err) {
    return config;
  }
});
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
