import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Theme } from "@radix-ui/themes";
import SignUp from "./pages/SignUp";
import { APIProvider } from "@vis.gl/react-google-maps";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <Router>
      <Theme>
        <APIProvider apiKey={"AIzaSyAOdWmJyDnSCCJ5Nwg9Pmgb4KDLzgvISjw"}>
          <Routes>
            <Route
              path="/home"
              element={<Dashboard />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/signup"
              element={<SignUp />}
            />
            <Route
              path="*"
              element={
                <Navigate
                  to="/login"
                  replace
                />
              }
            />
          </Routes>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            theme="colored"
          />
        </APIProvider>
      </Theme>
    </Router>
  );
}
