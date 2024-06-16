import { Button, TextField } from "@radix-ui/themes";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../utils/api";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onLogin = async () => {
    try {
      const loginData = await login({ username: userName, password });
      const token = loginData.data.access_token;
      localStorage.setItem("token", token);
      navigate("/home");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="w-[400px] flex items-center relative justify-center flex-col h-screen mx-auto p-6 text-center">
      <h2 className="text-2xl font-semibold mb-6">Login</h2>
      <div className="space-y-8 w-full">
        <div className="space-y-4">
          <TextField.Root
            value={userName}
            size="3"
            placeholder="Username"
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
          <TextField.Root
            value={password}
            type="password"
            size="3"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <Button
          className="w-full"
          variant="solid"
          onClick={() => onLogin()}
        >
          Login
        </Button>
      </div>
      <Link
        className="absolute bottom-6 text-blue-500 text-sm underline"
        to="/signup"
      >
        Create An Account ?{" "}
      </Link>
    </div>
  );
};

export default Login;
