import React from "react";
const UserCard = ({ userInfo, history }) => {
  return (
    <div
      style={{ cursor: "pointer" }}
      onClick={e => history.push(`/admin/user/${userInfo.user_no}`)}
    >
      <div className="uk-card uk-card-default uk-card-body">
        <div className="user uk-flex uk-flex-start uk-flex-middle">
          <span className="fa fa-user uk-padding-small uk-padding-remove-vertical uk-padding-remove-left" />
          <span
            className="uk-card-title"
            style={{ textTransform: "capitalize" }}
          >
            {userInfo.username}
          </span>
        </div>
        <div className="info uk-flex uk-flex-start uk-flex-middle">
          <span className="fa fa-phone-alt uk-padding-small uk-padding-remove-vertical uk-padding-remove-left" />
          <span className="">{userInfo.phone}</span>
        </div>
        <div className="invoiceNumber uk-flex uk-flex-start uk-flex-middle">
          <span className="fa fa-hashtag uk-padding-small uk-padding-remove-vertical uk-padding-remove-left" />
          <span className="uk-card-title">{userInfo.user_no}</span>
        </div>
      </div>
    </div>
  );
};
export default UserCard;
