import React from "react";
import { Route, Redirect } from "react-router-dom";
import SideBarMenu from "./SideBarMenu";

const ProtectedRoute = ({ component: Comp, loggedIn, path, ...rest }) => {
  return (
    <Route
      path={path}
      {...rest}
      render={props => {
        return loggedIn ? (
          <div className="uk-padding" uk-grid="true">
            <div
              className="uk-width-1-3@m uk-width-1-4@l uk-width-1-1"
              style={{ alignSelf: "" }}
            >
              <SideBarMenu />
            </div>
            <div
              className="uk-padding@m uk-width-2-3@m uk-width-3-4@l uk-width-1-1"
              style={{ alignSelf: "stretch" }}
            >
              <Comp {...props} />
            </div>
          </div>
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: {
                prevLocation: path,
                error: "You need to login first!",
              },
            }}
          />
        );
      }}
    />
  );
};

export default ProtectedRoute;
