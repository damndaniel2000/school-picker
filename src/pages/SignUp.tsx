import { Button, TextField } from "@radix-ui/themes";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const onLogin = () => {
    navigate("/home");
  };
  return (
    <div className="w-[400px] flex items-center relative justify-center flex-col h-screen mx-auto p-6 text-center">
      <h2 className="text-2xl font-semibold mb-6">Create An Account</h2>
      <div className="space-y-8 w-full">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <TextField.Root
              size="3"
              placeholder="First Name"
            />
            <TextField.Root
              size="3"
              placeholder="Last Name"
            />
          </div>
          <TextField.Root
            size="3"
            placeholder="Username"
          />
          <TextField.Root
            type="password"
            size="3"
            placeholder="Password"
          />
          <TextField.Root
            type="password"
            size="3"
            placeholder="Repeat Password"
          />
        </div>
        <Button
          className="w-full"
          variant="solid"
          onClick={() => onLogin()}
        >
          Create
        </Button>
      </div>
      <div className="absolute bottom-6 text-sm ">
        Existing User?{" "}
        <Link
          className="text-blue-500 underline"
          to="/login"
        >
          Sign In !{" "}
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
