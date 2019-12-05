import React, { useEffect, useState } from "react";
import { getRequest } from "../utils/axios";
import UserCard from "./UserCard";

const IndexMain = ({ searchedUsers, history }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allUsers = await getRequest("/users/all");

        const filteredUsers = allUsers.data.users.filter(
          user => user.admin_level === 0
        );
        setUsers(filteredUsers);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setUsers(searchedUsers);
  }, [searchedUsers]);
  return (
    <div className="uk-panel-scrollable uk-margin" style={{ height: 700 }}>
      <div
          className="
          uk-child-width-1-4@l
          uk-child-width-1-3@m
          uk-child-width-1-2@s
          uk-grid-small
          uk-grid-match
          uk-margin"
        uk-grid="true"
      >
        {users.map((user, index) => {
          return <UserCard key={index} userInfo={user} history={history} />;
        })}
      </div>
    </div>
  );
};

export default IndexMain;
