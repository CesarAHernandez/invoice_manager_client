import React, { useContext } from "react";
import UserContext from "./UserContext";
import { Link } from "react-router-dom";

const SideBarMenu = () => {
  const userContext = useContext(UserContext);

  return (
    <div
      className="
      uk-padding-small@m
      uk-grid-collapse
      uk-flex-center
      uk-child-width-1-1@m
      uk-child-width-1-4"
      uk-grid="true"
    >
      <Link to="/admin">
        <div className="uk-card uk-card-default uk-card-small uk-card-body uk-text-center uk-width-medium uk-margin-auto">
          Home
        </div>
      </Link>
      <Link to="/admin/paid">
        <div className="uk-card uk-card-default uk-card-small  uk-card-body uk-text-center uk-width-medium uk-margin-auto">
          Paid
        </div>
      </Link>
      <Link to="/admin/pending">
        <div className="uk-card uk-card-default uk-card-small  uk-card-body uk-text-center uk-width-medium uk-margin-auto">
          Pending
        </div>
      </Link>
      <Link to="/admin/overdue">
        <div className="uk-card uk-card-default uk-card-small  uk-card-body uk-text-center uk-width-medium uk-margin-auto">
          OverDue
        </div>
      </Link>
      {userContext.user.admin_level > 1 && (
        <Link to="/admin/admins">
          <div className="uk-card uk-card-default uk-card-small  uk-card-body uk-text-center uk-width-medium uk-margin-auto">
            Admins
          </div>
        </Link>
      )}
    </div>
  );
};

export default SideBarMenu;
