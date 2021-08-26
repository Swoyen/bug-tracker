import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./api/config";
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";

const msalInstance = new PublicClientApplication(msalConfig);
const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
