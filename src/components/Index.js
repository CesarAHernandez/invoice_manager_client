import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "./UserContext";
import { debounce } from "../utils/helper";
import { getRequest } from "../utils/axios";
import IndexMain from "./IndexMain";
import CreateInvoice from "./CreateInvoice";
import CreateUser from "./CreateUser";
import * as UIkit from "../resources/js/uikit.min.js";

const Index = ({ history }) => {
  const userContext = useContext(UserContext);
  const [renderInvoice, setRenderInvoice] = useState(false);
  const [createUser, setCreateUser] = useState(false);
  const [users, setUsers] = useState([]);

  const _handleSearch = debounce(async term => {
    console.log(term.length);
    if (term.length === 0) {
      term = null;
    }
    const results = await getRequest(`/users/search/${term}`);
    console.log(results);
    setUsers(results.data.users);
  }, 300);
  const _handleRemove = which => {
    console.log("Hello", which);
    if (which === "invoice") {
      setRenderInvoice(false);
    } else {
      setCreateUser(false);
    }
  };
  const _handleToast = (msg, type) => {
    //eslint-disable-next-line no-undef
    UIkit.notification({ message: msg, status: type });
  };
  return (
    <div>
      <div className="uk-child-width-1-1" uk-grid="true">
        <div className="uk-flex uk-flex-between">
          <div className=" uk-button-group">
            <button
              className="uk-button uk-text-small@s uk-button-primary"
              uk-toggle="target: #create_user_modal"
              onClick={() => setCreateUser(true)}
            >
              Create User
            </button>
            <button
              className="uk-button uk-text-small@s uk-button-primary"
              uk-toggle="target: #create_invoice_modal"
              onClick={() => setRenderInvoice(true)}
            >
              Create Invoice
            </button>
          </div>
          <div className="uk-button-group">
            <button
              className="uk-button uk-button-danger uk-text-small@s"
              onClick={() => {
                return (
                  //eslint-disable-next-line no-restricted-globals
                  confirm("Are you sure") && userContext.handleLogout(history)
                );
              }}
            >
              Log Out {userContext.user.username}
            </button>
            {userContext.user.admin_level > 1 && (
              <Link to="/admin/settings">
                <i className="fa fa-cog"></i>
                Settings
              </Link>
            )}
          </div>
        </div>
        <form className="uk-search uk-search-default">
          <input
            className="uk-search-input "
            type="search"
            onChange={e => _handleSearch(e.target.value)}
            placeholder="Search..."
          />
        </form>
      </div>
      <IndexMain searchedUsers={users} history={history} />

      <div id="create_invoice_modal" uk-modal="true">
        {renderInvoice && (
          <CreateInvoice removeModal={_handleRemove} showToast={_handleToast} />
        )}
      </div>
      <div id="create_user_modal" uk-modal="true">
        {createUser && (
          <CreateUser removeModal={_handleRemove} showToast={_handleToast} />
        )}
      </div>
    </div>
  );
};

export default Index;
