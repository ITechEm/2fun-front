'use client';

import Layout from "./layout2";
import Center from "@/components/Center";
import { signIn, useSession } from "next-auth/react";
import Button from "@/components/Button";
import styled, { keyframes } from "styled-components";
import Input from "@/components/Input";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

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

const StyledInput = styled(Input)`
  border-radius: 12px;
  padding: 12px;
  font-size: 16px;
  
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PasswordInput = styled(StyledInput)`
  padding-right: 40px;
`;

const ShowPasswordButton = styled.button`
  position: absolute;
  top: 45%;
  right: 20px;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 16px;
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

export default function LoginPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/'); // Redirect if already logged in
    }
  }, [session, router]);

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Toate câmpurile sunt obligatorii.');
      return;
    }

    if (!validateEmail(email)) {
      setFormError('Adresa de email nu este validă.');
      return;
    }

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (!res.error) {
      router.push('/');
    } else {
      setFormError(res.error);
    }
  }

  // Auto-hide popup after 3 seconds
  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => setFormError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [formError]);

  return (
    <>
      <Layout>
      <Center>
        <ColsWrapper>
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
  <Title>Login</Title>

  <StyledInput
    type="email"
    placeholder="Email"
    value={email}
    onChange={ev => setEmail(ev.target.value)}
    required
  />

  <InputWrapper>
    <PasswordInput
      type={showPassword ? 'text' : 'password'}
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      minLength={6}
      maxLength={12}
    />
    <ShowPasswordButton
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
    >
      {showPassword ? 'Hide' : 'Show'}
    </ShowPasswordButton>
  </InputWrapper>

  <StyledButton type="submit" block>Login</StyledButton>
   <SmallText>
    <LinkButton onClick={() => router.push('/forgot-password')}>
      Forgot Password?
    </LinkButton>
  </SmallText>
  <SmallText>
    Don&apos;t have an account?{" "}
    <LinkButton onClick={() => router.push('/register')}>
      Register here
    </LinkButton>
  </SmallText>
 
</form>
        </ColsWrapper>
      </Center>
</Layout>
      {formError && <ErrorPopup>{formError}</ErrorPopup>}
    </>
  );
}