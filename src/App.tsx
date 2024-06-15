import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Theme } from "@radix-ui/themes";
import SignUp from "./pages/SignUp";
import { useEffect } from "react";
import Axios from "axios";

export default function App() {
  useEffect(() => {
    Axios.get("https://db-webtech-project.onrender.com/kg-facilities/")
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <Router>
      <Theme>
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
      </Theme>
    </Router>
  );
}
