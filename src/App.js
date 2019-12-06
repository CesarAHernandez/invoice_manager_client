import React, { useState } from "react";
import { jwtConfig } from "./config/jwt";
import { sign, verify } from "jsonwebtoken";
import { UserProvider } from "./components/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { routes } from "./Routes";
import { createBrowserHistory } from "history";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const history = createBrowserHistory();

function App() {
  let savedInfo;
  try {
    savedInfo = verify(localStorage.getItem("user_state"), jwtConfig.secret);
  } catch (err) {
    console.log(err);
    savedInfo = { user: {}, loggedIn: false };
  }

  const [user, setUser] = useState(savedInfo || { user: {}, loggedIn: false });
  const userContext = {
    ...user,
    handleLogin: (user, history) => {
      console.log(user);
      setUser({ user, loggedIn: true });
      localStorage.setItem(
        "user_state",
        sign({ user, loggedIn: true }, jwtConfig.secret)
      );
      history.push("/admin");
    },
    handleLogout: history => {
      setUser({ user: {}, loggedIn: false });
      localStorage.setItem(
        "user_state",
        sign({ user: {}, loggedIn: false }, jwtConfig.secret)
      );
      history.push("/");
    },
  };
  return (
    <Router history={history}>
      <UserProvider value={userContext}>
        <div>
          <Switch>
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
          </Switch>
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;
