import React from "react";

import { Link } from "react-router-dom";

const SideBarMenu = () => {
  return (
    <div className="uk-child-width-expand@s" uk-grid="true">
      <div>
        <div className="uk-card uk-card-default uk-card-body">
          <div className="uk-flex uk-flex-column">
            <Link to="/">
              <div className="uk-card uk-card-default uk-card-body">Home</div>
            </Link>
            <Link to="/paid">
              <div className="uk-card uk-card-default uk-card-body">Paid</div>
            </Link>
            <Link to="/pending">
              <div className="uk-card uk-card-default uk-card-body">
                Pending
              </div>
            </Link>
            <Link to="/overdue">
              <div className="uk-card uk-card-default uk-card-body">
                OverDue
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBarMenu;
