import React from "react";

const UserProfile = ({ match }) => {
  return <div>You are number id: {match.params.id}</div>;
};

export default UserProfile;
