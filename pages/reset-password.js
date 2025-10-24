'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled, { keyframes, css } from "styled-components";
import Layout from "./layout2";
import Center from "@/components/Center";
import Input from "@/components/Input";
import Button from "@/components/Button";

const ColsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 50px auto;
  background: white;
  padding: 40px 30px;
  border-radius: 16px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 32px;
  font-family: 'Georgia', serif;
  text-align: center;
  margin-bottom: 30px;
  color: #1f1f1f;
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
  width: 100%;
  margin-top: 15px;
  border: 2px solid #ccc;
  transition: border 0.2s, background 0.2s;

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

const ToggleButton = styled.button`
  position: absolute;
  top: 55%;
  right: 20px;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    color: #333;
  }
`;

const StyledButton = styled(Button)`
  display: inline-block;
  background-color: #1f1f1f;
  color: white;
  border-radius: 999px;
  padding: 12px;
  font-weight: bold;
  font-size: 16px;
  margin-top: 20px;
  width: 70%;
  text-align: center;

  &:hover {
    background-color: #413e3eff;
  }
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
  color: white;
  background-color: ${(props) => (props.error ? "#e53935" : "#e53935")};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorFields, setErrorFields] = useState({});
  const [formError, setFormError] = useState("");

  const clearFieldError = (field) =>
    setErrorFields((prev) => ({ ...prev, [field]: false }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    let newErrors = {};
    if (!password.trim()) newErrors.password = true;
    if (!confirm.trim()) newErrors.confirm = true;

    if (Object.keys(newErrors).length > 0) {
      setErrorFields(newErrors);
      setFormError("Please fill in all fields");
      setTimeout(() => setErrorFields({}), 500);
      return;
    }

    if (password.length < 6 || password.length > 12) {
      setErrorFields({ password: true });
      setFormError("Password must be between 6 and 12 characters");
      setTimeout(() => setErrorFields({}), 500);
      return;
    }

    if (password !== confirm) {
      setErrorFields({ password: true, confirm: true });
      setFormError("Passwords do not match");
      setTimeout(() => setErrorFields({}), 3000);
      return;
    }

    setErrorFields({});

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setFormError("Successfully password reset! Redirecting...");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setErrorFields({ password: true, confirm: true });
      setFormError(data.error || "Reset failed");
      setTimeout(() => setErrorFields({}), 3000);
    }
  };

  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => setFormError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [formError]);

  return (
    <Layout>
      <Center>
        <ColsWrapper>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Title>Reset Password</Title>

            <InputWrapper>
              <StyledInput
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError("password");
                }}
                error={errorFields.password}
              />
              <ToggleButton
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </ToggleButton>
            </InputWrapper>

            <InputWrapper>
              <StyledInput
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  clearFieldError("confirm");
                }}
                error={errorFields.confirm}
              />
              <ToggleButton
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
              >
                {showConfirm ? "Hide" : "Show"}
              </ToggleButton>
            </InputWrapper>

            <StyledButton type="submit">Reset Password</StyledButton>
          </form>
        </ColsWrapper>
      </Center>

      {formError && (
        <Popup error={formError.toLowerCase().includes("fail") || formError.toLowerCase().includes("match")}>
          {formError}
        </Popup>
      )}
    </Layout>
  );
}