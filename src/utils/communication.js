import { postRequest } from "./axios";

export const sendSMS = (number, body) =>
  postRequest("/sms/send", {
    number,
    body,
  });
