import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AppProviders from "./app/providers/AppProviders";
import store from "./store/store";
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProviders>
      <Provider store={store}>
      <App />
    </Provider>
    </AppProviders>
  </React.StrictMode>
);