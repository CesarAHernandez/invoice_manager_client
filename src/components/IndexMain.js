import React, { useEffect, useState } from "react";
import { getRequest } from "../utils/axios";
import UserCard from "./UserCard";

const IndexMain = ({ searchedUsers }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const allUsers = await getRequest("/users/all");
      setUsers(allUsers.data.users);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setUsers(searchedUsers);
  }, [searchedUsers]);
  return (
    <div className="uk-panel-scrollable uk-margin" style={{ height: 700 }}>
      <div
        className="uk-child-width-1-4@m uk-child-width-1-2@s uk-grid-small uk-grid-match uk-margin"
        uk-grid="true"
      >
        {users.map((user, index) => {
          return <UserCard key={index} userInfo={user} />;
        })}
      </div>
    </div>
  );
};

export default IndexMain;
