import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3333/admin/invoice/create")
      .then(response => {
        setMsg(response.data.filePath);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);
  return <div className="App">{msg}</div>;
}

export default App;
