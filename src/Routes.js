import React from "react";
import Index from "./components/Index";
import Paid from "./components/Paid";
import Pending from "./components/Pending";
import OverDue from "./components/OverDue";

export const routes = [
  {
    path: "/",
    exact: true,
    component: () => <Index />,
  },
  {
    path: "/paid",
    component: () => <Paid />,
  },
  {
    path: "/pending",
    component: () => <Pending />,
  },
  {
    path: "/overdue",
    component: () => <OverDue />,
  },
];
