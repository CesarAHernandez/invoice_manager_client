import React from "react";
const UserCard = ({ userInfo, history }) => {
  return (
    <div
      style={{ cursor: "pointer" }}
      onClick={e => history.push(`/admin/user/${userInfo.user_no}`)}
    >
      <div className="uk-card uk-card-default uk-card-body">
        <div className="user uk-flex uk-flex-start uk-flex-middle">
          <span
            uk-icon="icon: user"
            className="uk-padding-small uk-padding-remove-vertical uk-padding-remove-left"
          />

          <span
            className="uk-card-title"
            style={{ textTransform: "capitalize" }}
          >
            {userInfo.username}
          </span>
        </div>
        <div className="info uk-flex uk-flex-start uk-flex-middle">
          <span
            uk-icon="icon: receiver"
            className="uk-padding-small uk-padding-remove-vertical uk-padding-remove-left"
          />
          <span className="">{userInfo.phone}</span>
        </div>
        <div className="invoiceNumber uk-flex uk-flex-start uk-flex-middle">
          <span
            uk-icon="icon: hashtag"
            className="uk-padding-small uk-padding-remove-vertical uk-padding-remove-left"
          />
          <span className="uk-card-title">{userInfo.user_no}</span>
        </div>
      </div>
    </div>
  );
};
export default UserCard;
