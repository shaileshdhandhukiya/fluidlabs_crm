import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/themes/light.css";
import "../src/assets/scss/app.scss";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./store";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import GoogleOAuthProvider

const clientId = "334573321049-q867oo624h4djsu8uv037k4rrkh9s8sp.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </>
);
