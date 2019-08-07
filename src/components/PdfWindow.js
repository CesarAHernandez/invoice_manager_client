import React from "react";
import NewWindow from "react-new-window";

const PdfWindow = ({ path, onUnload }) => (
  <NewWindow
    url="http://www.africau.edu/images/default/sample.pdf"
    // url={path}
    onOpen={() => {
      console.log(path);
    }}
    onBlock={e => {
      console.log(e);
    }}
    onUnload={onUnload}
  >
    {/* file="invoice-manager-react\src\1f8cd3d-bc99e75.pdf" */}
  </NewWindow>
);

export default PdfWindow;
