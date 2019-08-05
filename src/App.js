import React from "react";
import SideBarMenu from "./components/SideBarMenu";
import { routes } from "./Routes";
import { BrowserRouter as Router, Route } from "react-router-dom";

const mainContainer = {
  display: "grid",
  gridTemplateColumns: "minmax(200px,20%) 1fr",
  height: "100vh",
  paddingLeft: 30,
};
function App() {
  return (
    <Router>
      <div style={mainContainer}>
        <div style={{ alignSelf: "center" }}>
          <SideBarMenu />
        </div>
        <div className="uk-padding " style={{ alignSelf: "stretch" }}>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          ))}
        </div>
      </div>
    </Router>
  );
}

export default App;
