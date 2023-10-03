import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { I18nextProvider } from "react-i18next"
import i18next from "./translations";

import store, { persistor } from "state/store";

import "styles/index.scss";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const i18n = i18next

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <I18nextProvider i18n={i18n}>
            <App />
          </I18nextProvider>
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);