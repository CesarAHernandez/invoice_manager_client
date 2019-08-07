import React from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import { routes } from "./Routes";
import { createBrowserHistory } from "history";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "./uikit.min.css";
const history = createBrowserHistory();

function App() {
  return (
    <Router history={history}>
      <div>
        {routes.map((route, index) =>
          route.protected ? (
            <ProtectedRoute
              key={index}
              loggedIn={true}
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
    </Router>
  );
}

export default App;
