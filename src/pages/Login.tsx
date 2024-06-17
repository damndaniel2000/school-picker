import { Button, TextField } from "@radix-ui/themes";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../utils/api";
import { useState } from "react";
import * as Form from "@radix-ui/react-form";

const Login = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const onLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const loginData = await login({ username: userName, password });
      const token = loginData.data.access_token;
      localStorage.setItem("token", token);
      navigate("/home");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[400px] flex items-center relative justify-center flex-col h-screen mx-auto p-6 text-center">
      <h2 className="text-2xl font-semibold mb-6">Login</h2>
      <Form.Root
        onSubmit={onLogin}
        className="space-y-8 w-full"
      >
        <Form.Field name="username">
          <TextField.Root
            size="3"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Username"
          ></TextField.Root>
        </Form.Field>
        <Form.Field name="password">
          <TextField.Root
            size="3"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          ></TextField.Root>
        </Form.Field>
        <Button
          type="submit"
          className="w-full"
          variant="solid"
          loading={loading}
        >
          Login
        </Button>
      </Form.Root>
      <Link
        className="absolute bottom-6 text-blue-500 text-sm underline"
        to="/signup"
      >
        Create An Account ?
      </Link>
    </div>
  );
};

export default Login;
