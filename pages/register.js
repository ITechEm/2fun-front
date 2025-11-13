'use client';

import Layout from "./layout2";
import Center from "@/components/Center";
import Button from "@/components/Button";
import styled, { keyframes, css } from "styled-components";
import Input from "@/components/Input";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const ColsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 50px auto;
  background: white;
  padding: 40px 30px;
  border-radius: 16px;
`;

const Title = styled.h2`
  font-size: 32px;
  color: #1f1f1f;
  text-align: center;
  margin-bottom: 30px;
  font-family: 'Georgia', serif;
`;

const shake = keyframes`
  0% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
  100% { transform: translateX(0); }
`;

const StyledInput = styled(Input)`
  border-radius: 12px;
  padding: 12px;
  font-size: 16px;
  margin-bottom: 15px;
  border: 2px solid #ccc;
  transition: border 0.2s ease-in-out, background 0.2s ease-in-out;

  ${(props) =>
    props.error &&
    css`
      border-color: #e53935;
      background-color: #ffe6e6;
      animation: ${shake} 0.3s;
    `}
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PasswordInput = styled(StyledInput)`
  padding-right: 45px;
`;

const EyeButton = styled.button`
  position: absolute;
  top: 40%;
  right: 15px;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #777;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  &:hover svg {
    stroke: #333;
  }
`;

const StyledButton = styled(Button)`
  background-color: #1f1f1f;
  color: white;
  border-radius: 999px;
  padding: 12px;
  font-weight: bold;
  font-size: 16px;
  margin-top: 15px;
  &:hover {
    background-color: #585555ff;
  }
`;

const SmallText = styled.p`
  font-size: 14px;
  margin-top: 16px;
  color: #333;
  text-align: center;
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  color: #0066cc;
  text-decoration: underline;
  cursor: pointer;
`;

const fadeIn = keyframes`
  from { opacity: 0; top: 10px; }
  to { opacity: 1; top: 30px; }
`;

const Popup = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  top: 30px;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-in-out;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
`;

const ErrorPopup = styled(Popup)`
  background-color: #e53935;
  color: white;
`;

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorFields, setErrorFields] = useState({});
  const [formError, setFormError] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!name.trim()) newErrors.name = true;
    if (!email.trim() || !email.includes("@")) newErrors.email = true;
    if (!password || password.length < 6 || password.length > 12)
      newErrors.password = true;
    if (confirmPassword !== password) newErrors.confirmPassword = true;

    if (Object.keys(newErrors).length > 0) {
      setErrorFields(newErrors);

      if (!name.trim() || !email.trim() || !password || !confirmPassword) {
        setFormError("Please fill in all fields");
      } else if (!email.includes("@")) {
        setFormError('Please include an "@" in the email');
      } else if (password.length < 6 || password.length > 12) {
        setFormError("Password must be between 6 and 12 characters");
      } else if (confirmPassword !== password) {
        setFormError("Passwords do not match");
      }

      setTimeout(() => setErrorFields({}), 500);
      return;
    }

    setErrorFields({});
    setFormError("");

    try {
      await axios.post("/api/send-verification-code", { name, email, password });
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setFormError(error.response?.data?.error || "Error sending verification email");
      setErrorFields({ name: true, email: true, password: true, confirmPassword: true });
      setTimeout(() => setErrorFields({}), 500);
    }
  };

  const handleChange = (field, value) => {
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    if (field === "confirmPassword") setConfirmPassword(value);

    if (errorFields[field]) {
      setErrorFields((prev) => ({ ...prev, [field]: false }));
    }
  };

  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => setFormError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [formError]);

  return (
    <>
      <Layout>
        <Center>
          <ColsWrapper>
            <form onSubmit={handleRegister} style={{ width: "100%" }}>
              <Title>Register</Title>

              <StyledInput
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => handleChange("name", e.target.value)}
                error={errorFields.name}
              />

              <StyledInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={errorFields.email}
              />

              {/* Password Field */}
              <InputWrapper>
                <PasswordInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  error={errorFields.password}
                  minLength={6}
                  maxLength={12}
                />
                <EyeButton
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    // Eye-off SVG
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.8"
                      stroke="currentColor"
                      width="22"
                      height="22"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    // Eye SVG
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.8"
                      stroke="currentColor"
                      width="22"
                      height="22"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </EyeButton>
              </InputWrapper>

              {/* Confirm Password Field */}
              <InputWrapper>
                <PasswordInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  error={errorFields.confirmPassword}
                  minLength={6}
                  maxLength={12}
                />
                <EyeButton
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle confirm password visibility"
                >
                  
                </EyeButton>
              </InputWrapper>

              <StyledButton type="submit" block>
                Create Account
              </StyledButton>

              <SmallText>
                Already have an account?{" "}
                <LinkButton onClick={() => router.push("/login")}>Login</LinkButton>
              </SmallText>
            </form>
          </ColsWrapper>
        </Center>
      </Layout>

      {formError && <ErrorPopup>{formError}</ErrorPopup>}
    </>
  );
}