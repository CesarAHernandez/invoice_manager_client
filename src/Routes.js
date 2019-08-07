import React from "react";
import Index from "./components/Index";
import Paid from "./components/Paid";
import Pending from "./components/Pending";
import OverDue from "./components/OverDue";
import UserProfile from "./components/UserProfile";
import IndexMain from "./components/IndexMain";

export const routes = [
  {
    path: "/admin",
    exact: true,
    render: props => <Index {...props} />,
  },
  {
    path: "/admin/paid",
    render: props => <Paid {...props} />,
  },
  {
    path: "/admin/pending",
    render: props => <Pending {...props} />,
  },
  {
    path: "/admin/overdue",
    render: props => <OverDue {...props} />,
  },
  {
    path: "/admin/user/:id",
    render: props => <UserProfile {...props} />,
  },
];
