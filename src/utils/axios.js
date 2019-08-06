import axios from "axios";
axios.defaults.baseURL = "http://localhost:3333";

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
