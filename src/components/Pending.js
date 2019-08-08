import React, { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { getRequest } from "../utils/axios";

const Pending = ({ history }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const allUsers = await getRequest("/users/status/pending");
      console.log(allUsers);
      setUsers(allUsers.data.users);
    };
    fetchData();
  }, []);
  return (
    <div className="uk-panel-scrollable uk-margin" style={{ height: 700 }}>
      <div
        className="uk-child-width-1-4@m uk-child-width-1-2@s uk-grid-small uk-grid-match uk-margin"
        uk-grid="true"
      >
        {users.map((user, index) => {
          return <UserCard key={index} userInfo={user} history={history} />;
        })}
      </div>
    </div>
  );
};

export default Pending;
