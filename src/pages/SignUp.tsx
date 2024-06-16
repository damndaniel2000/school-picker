import { useState } from "react";
import { Button, TextField } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import * as Form from "@radix-ui/react-form";
import { signup } from "../utils/api";

const SignUp = () => {
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    repeatPassword: "",
  });

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let error = "";

    switch (name) {
      case "firstName":
        if (!value) error = "First name is required";
        break;
      case "lastName":
        if (!value) error = "Last name is required";
        break;
      case "username":
        if (!value || !validateEmail(value)) error = "Valid email is required";
        break;
      case "password":
        if (!value || !validatePassword(value))
          error = "Password must be at least 6 characters";
        break;
      case "repeatPassword": {
        const password = (event.currentTarget.form as HTMLFormElement).password
          .value;
        if (value !== password) error = "Passwords do not match";
        break;
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const repeatPassword = formData.get("repeatPassword") as string;

    let valid = true;
    const errors = {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      repeatPassword: "",
    };

    if (!firstName) {
      errors.firstName = "First name is required";
      valid = false;
    }

    if (!lastName) {
      errors.lastName = "Last name is required";
      valid = false;
    }

    if (!username || !validateEmail(username)) {
      errors.username = "Valid email is required";
      valid = false;
    }

    if (!password || !validatePassword(password)) {
      errors.password = "Password must be at least 6 characters";
      valid = false;
    }

    if (password !== repeatPassword) {
      errors.repeatPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(errors);

    if (valid) {
      const data = {
        username,
        email: username,
        full_name: `${firstName} ${lastName}`,
        password,
      };

      const payload = await signup(data);

      console.log(payload);

      // navigate("/home");
    }
  };

  const ErrorText = ({ error }: { error: string }) => (
    <div className="h-5">
      {error && (
        <div className="text-red-500 text-[12px] text-left ml-1 mt-1">
          {error}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-[400px] flex items-center relative justify-center flex-col h-screen mx-auto p-6 text-center">
      <h2 className="text-2xl font-semibold mb-6">Create An Account</h2>
      <Form.Root
        className="space-y-8 w-full"
        onSubmit={onSubmit}
      >
        <div className="space-y-3">
          <div className="flex space-x-4">
            <Form.Field name="firstName">
              <Form.Control asChild>
                <TextField.Root
                  size="3"
                  placeholder="First Name"
                  name="firstName"
                  onBlur={handleBlur}
                ></TextField.Root>
              </Form.Control>
              <ErrorText error={errors.firstName} />
            </Form.Field>
            <Form.Field name="lastName">
              <Form.Control asChild>
                <TextField.Root
                  size="3"
                  placeholder="Last Name"
                  name="lastName"
                  onBlur={handleBlur}
                ></TextField.Root>
              </Form.Control>
              <ErrorText error={errors.lastName} />
            </Form.Field>
          </div>
          <Form.Field name="username">
            <Form.Control asChild>
              <TextField.Root
                size="3"
                placeholder="Username (Email)"
                name="username"
                onBlur={handleBlur}
                type="email"
              ></TextField.Root>
            </Form.Control>
            <ErrorText error={errors.username} />
          </Form.Field>
          <Form.Field name="password">
            <Form.Control asChild>
              <TextField.Root
                size="3"
                placeholder="Password"
                type="password"
                name="password"
                onBlur={handleBlur}
              ></TextField.Root>
            </Form.Control>
            <ErrorText error={errors.password} />
          </Form.Field>
          <Form.Field name="repeatPassword">
            <Form.Control asChild>
              <TextField.Root
                size="3"
                placeholder="Repeat Password"
                type="password"
                name="repeatPassword"
                onBlur={handleBlur}
              ></TextField.Root>
            </Form.Control>
            <ErrorText error={errors.repeatPassword} />
          </Form.Field>
        </div>
        <Button
          className="w-full"
          variant="solid"
          type="submit"
        >
          Create
        </Button>
      </Form.Root>
      <div className="absolute bottom-6 text-sm ">
        Existing User?{" "}
        <Link
          className="text-blue-500 underline"
          to="/login"
        >
          Sign In!{" "}
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
