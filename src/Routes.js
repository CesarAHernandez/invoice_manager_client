import React from "react";
import Index from "./components/Index";
import Paid from "./components/Paid";
import Pending from "./components/Pending";
import OverDue from "./components/OverDue";
import Home from "./components/Home";
import Admins from "./components/Admins";
import UserProfile from "./components/UserProfile";
import UserInvoice from "./components/UserInvoice";

export const routes = [
  {
    path: "/",
    exact: true,
    render: props => <Home {...props} />,
  },
  {
    path: "/user/invoice/view",
    render: props => <UserInvoice {...props} />,
  },
  {
    path: "/admin",
    exact: true,
    protected: true,
    render: props => <Index {...props} />,
  },
  {
    path: "/admin/paid",
    protected: true,
    render: props => <Paid {...props} />,
  },
  {
    path: "/admin/pending",
    protected: true,
    render: props => <Pending {...props} />,
  },
  {
    path: "/admin/overdue",
    protected: true,
    render: props => <OverDue {...props} />,
  },
  {
    path: "/admin/admins",
    protected: true,
    render: props => <Admins {...props} />,
  },
  {
    path: "/admin/user/:id",
    protected: true,
    render: props => <UserProfile {...props} />,
  },
];
