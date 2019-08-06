import React, { useState, useEffect } from "react";
import { debounce } from "../utils/helper";
import { getRequest } from "../utils/axios";
import IndexMain from "./IndexMain";
import CreateInvoice from "./CreateInvoice";

const Index = () => {
  const [renderChild, setRenderChild] = useState(false);
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
  const _handleRemove = () => {
    setRenderChild(false);
  };
  const _handleToast = (msg, type) => {
    //eslint-disable-next-line no-undef
    UIkit.notification({ message: msg, status: type });
  };
  return (
    <div>
      <div className="uk-flex uk-flex-between">
        <form className="uk-search uk-search-default">
          <input
            className="uk-search-input "
            type="search"
            onChange={e => _handleSearch(e.target.value)}
            placeholder="Search..."
          />
        </form>
        <button
          className="uk-button uk-button-primary"
          uk-toggle="target: #create_invoice_modal"
          onClick={() => setRenderChild(true)}
        >
          Create
        </button>
      </div>
      <IndexMain searchedUsers={users} />

      <div id="create_invoice_modal" uk-modal="true">
        {renderChild && (
          <CreateInvoice removeModal={_handleRemove} showToast={_handleToast} />
        )}
      </div>
    </div>
  );
};

export default Index;
