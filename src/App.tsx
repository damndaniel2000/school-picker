import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Theme } from "@radix-ui/themes";
import SignUp from "./pages/SignUp";
import { APIProvider } from "@vis.gl/react-google-maps";

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
          </Routes>
        </APIProvider>
      </Theme>
    </Router>
  );
}
