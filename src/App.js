import React, { useState } from "react";
import { UserProvider } from "./components/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { routes } from "./Routes";
import { createBrowserHistory } from "history";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "./uikit.min.css";
const history = createBrowserHistory();

function App() {
  const [user, setUser] = useState({ user: {}, loggedIn: false });
  const userContext = {
    ...user,
    handleLogin: (user, history) => {
      setUser({ user, loggedIn: true });
      history.push("/admin");
    },
    handleLogout: history => {
      setUser({ user: {}, loggedIn: false });
      history.push("/");
    },
  };
  return (
    <Router history={history}>
      <UserProvider value={userContext}>
        <div>
          {routes.map((route, index) =>
            route.protected ? (
              <ProtectedRoute
                key={index}
                loggedIn={user.loggedIn}
                path={route.path}
                exact={route.exact}
                component={route.render}
              />
            ) : (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                render={route.render}
              />
            )
          )}
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;
