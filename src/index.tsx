import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import persistStore from "redux-persist/es/persistStore";
import { store } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
let persistor = persistStore(store);
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
