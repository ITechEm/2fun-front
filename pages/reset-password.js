'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import Layout from './layout2';
import Center from '@/components/Center';
import Input from '@/components/Input';
import Button from '@/components/Button';

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
  text-align: center;
  margin-bottom: 30px;
`;

const StyledInput = styled(Input)`
  border-radius: 12px;
  padding: 12px;
  font-size: 16px;
  width: 100%;
  margin-top: 15px;
`;

const StyledButton = styled(Button)`
  background-color: #1f1f1f;
  color: white;
  border-radius: 999px;
  padding: 10px 30px;
  font-weight: bold;
  font-size: 16px;
  margin-top: 15px;
  text-align: center;
  transition: background 0.2s ease-in-out;

  &:hover {
    background-color: #333;
  }
`;

const Message = styled.p`
  margin-top: 20px;
  text-align: center;
  color: ${(props) => (props.error ? "#e53935" : "#4caf50")};
  font-weight: bold;
`;

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      setError(true);
      return;
    }

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Password reset! Redirecting to login...");
      setTimeout(() => router.push("/account"), 2000);
    } else {
      setMessage(`${data.error || "Reset failed"}`);
      setError(true);
    }
  };

  return (
    <Layout>
      <Center>
        <ColsWrapper>
          <Title>Reset Password</Title>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <StyledInput
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <StyledInput
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <StyledButton type="submit">Reset Password</StyledButton>
          </form>
          {message && <Message error={error}>{message}</Message>}
        </ColsWrapper>
      </Center>
    </Layout>
  );
}
