import { postRequest, getRequest } from "./axios";

export const sendSMS = (number, body) =>
  postRequest("/sms/send", {
    number,
    body,
  });

export const sendEmail = (to, subject, template, templateObject) =>
  getRequest("/user/send-email", { to, subject, template, templateObject });
