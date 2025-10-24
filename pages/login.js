'use client';

import Layout from "./layout2";
import Center from "@/components/Center";
import { signIn, useSession } from "next-auth/react";
import Button from "@/components/Button";
import styled, { keyframes, css } from "styled-components";
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
  padding-right: 40px;
`;

const ShowPasswordButton = styled.button`
  position: absolute;
  top: 40%;
  right: 16px;
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

const fadeOut = keyframes`
  from { opacity: 1; top: 30px; }
  to { opacity: 0; top: 10px; }
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
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ErrorPopup = styled(Popup)`
  background-color: #e53935;
  color: white;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

export default function LoginPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [errorFields, setErrorFields] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (session) router.push('/');
  }, [session, router]);

  const validateEmail = (email) => email.includes('@');

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError('');
    let newErrors = {};
    if (!email.trim()) newErrors.email = true;
    if (!password) newErrors.password = true;

    if (Object.keys(newErrors).length > 0) {
      setErrorFields(newErrors);
      setFormError('Please fill in all fields');
      setTimeout(() => setErrorFields({}), 500);
      return;
    }

    if (!validateEmail(email)) {
      setErrorFields({ email: true });
      setFormError('Please include an "@" in the email');
      setTimeout(() => setErrorFields({}), 500);
      return;
    }

    if (password.length < 6 || password.length > 12) {
      setErrorFields({ password: true });
      setFormError('Password must be between 6 and 12 characters');
      setTimeout(() => setErrorFields({}), 500);
      return;
    }

    setErrorFields({});
    const res = await signIn('credentials', { email, password, redirect: false });

    if (!res.error) router.push('/');
    else {
      let shakeFields = {};
      if (res.error.toLowerCase().includes('email')) shakeFields.email = true;
      if (res.error.toLowerCase().includes('password')) shakeFields.password = true;
      setErrorFields(shakeFields);
      setFormError(res.error);
      setTimeout(() => setErrorFields({}), 500);
    }
  };

  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => setFormError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [formError]);

  const clearFieldError = (field) => {
    setErrorFields((prev) => ({ ...prev, [field]: false }));
  };

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
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError('email');
                }}
                error={errorFields.email}
              />
              <InputWrapper>
                <PasswordInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError('password');
                  }}
                  error={errorFields.password}
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