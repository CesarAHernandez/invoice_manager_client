import React from "react";
import Index from "./components/Index";
import Paid from "./components/Paid";
import Pending from "./components/Pending";
import OverDue from "./components/OverDue";
import UserProfile from "./components/UserProfile";
import IndexMain from "./components/IndexMain";

export const routes = [
  {
    path: "/",
    exact: true,
    render: () => <Index />,
  },
  {
    path: "/paid",
    render: () => <Paid />,
  },
  {
    path: "/pending",
    render: () => <Pending />,
  },
  {
    path: "/overdue",
    render: () => <OverDue />,
  },
  {
    path: "/admin/user/:id",
    render: props => <UserProfile {...props} />,
  },
];
