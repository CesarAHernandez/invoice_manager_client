import React from "react";
import { Route, Redirect } from "react-router-dom";
import SideBarMenu from "./SideBarMenu";

const mainContainer = {
  display: "grid",
  gridTemplateColumns: "minmax(200px,20%) 1fr",
  height: "100vh",
  paddingLeft: 30,
};
const ProtectedRoute = ({ component: Comp, loggedIn, path, ...rest }) => {
  return (
    <Route
      path={path}
      {...rest}
      render={props => {
        return loggedIn ? (
          <div style={mainContainer}>
            <div style={{ alignSelf: "center" }}>
              <SideBarMenu />
            </div>
            <div className="uk-padding " style={{ alignSelf: "stretch" }}>
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
