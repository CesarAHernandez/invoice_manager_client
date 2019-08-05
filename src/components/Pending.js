import React from "react";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:3333";

const Pending = () => {
  return (
    <div className="uk-container">
      <div>Pending</div>
    </div>
  );
};

export default Pending;
