import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import * as Form from "@radix-ui/react-form";
import { signup } from "../utils/api";
import { toast } from "react-toastify";
import PlaceAutocompleteClassic from "../components/Autocomplete";

interface Errors {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  address: string;
  repeatPassword: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Errors>({
    firstName: "",
    lastName: "",
    username: "",
    address: "",
    password: "",
    repeatPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [fullAddress, setAddress] = useState("");

  const validateEmail = (email: string): boolean => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password: string): boolean => {
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
    const address = fullAddress;
    const password = formData.get("password") as string;
    const houseNumber = formData.get("house_number") as string;
    const postalCode = formData.get("postalCode") as string;
    const repeatPassword = formData.get("repeatPassword") as string;

    let valid = true;
    const errors: Errors = {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      address: "",
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

    if (address.length < 1) {
      errors.address = "Address has to be valid";
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
      setLoading(true);
      try {
        const data = {
          username,
          email: username,
          full_name: `${firstName} ${lastName}`,
          address,
          password,
          house_number: houseNumber,
          plz: postalCode,
          ort: "",
        };

        const payload = await signup(data);

        // Save the token in localStorage
        localStorage.setItem("token", payload.data.access_token);

        // Navigate to home page
        navigate("/home");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e.response.data.detail) toast.error(e?.response?.data?.detail);
        else toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
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
        className="space-y-3 w-full"
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
          <Form.Field name="address">
            <Form.Control asChild>
              <PlaceAutocompleteClassic
                value=""
                onPlaceSelect={(e) => {
                  setAddress(e?.name || "");
                }}
              />
            </Form.Control>
            <ErrorText error={errors.address} />
          </Form.Field>
          <div className="flex space-x-3 pb-4">
            <Form.Field name="house_number">
              <Form.Control asChild>
                <TextField.Root
                  size="3"
                  placeholder="House Number"
                  name="house_number"
                ></TextField.Root>
              </Form.Control>
            </Form.Field>
            <Form.Field name="postalCode">
              <Form.Control asChild>
                <TextField.Root
                  size="3"
                  placeholder="Postal Code"
                  name="postalCode"
                ></TextField.Root>
              </Form.Control>
            </Form.Field>
          </div>
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
          loading={loading}
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
