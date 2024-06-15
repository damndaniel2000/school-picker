import { Button, TextField } from "@radix-ui/themes";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const onLogin = () => {
    navigate("/home");
  };
  return (
    <div className="w-[400px] flex items-center relative justify-center flex-col h-screen mx-auto p-6 text-center">
      <h2 className="text-2xl font-semibold mb-6">Login</h2>
      <div className="space-y-8 w-full">
        <div className="space-y-4">
          <TextField.Root
            size="3"
            placeholder="Username"
          />
          <TextField.Root
            type="password"
            size="3"
            placeholder="Password"
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
