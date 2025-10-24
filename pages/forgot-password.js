'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled, { keyframes, css } from 'styled-components';
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
  font-size: 28px;
  text-align: center;
  margin-bottom: 30px;
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
  border: 2px solid #ccc;
  margin-bottom: 15px;
  transition: border 0.2s;

  ${(props) =>
    props.hasError &&
    css`
      border-color: #e53935;
      animation: ${shake} 0.3s;
    `}

  &:focus {
    outline: none;
    border-color: ${(props) => (props.hasError ? '#e53935' : '#1f1f1f')};
  }
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
  z-index: 10000;
  animation: ${fadeIn} 0.3s ease-in-out;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
`;

const SuccessPopup = styled(Popup)`
  background-color: #4caf50;
  color: white;
`;

const ErrorPopup = styled(Popup)`
  background-color: #e53935;
  color: white;
`;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setEmailError(false);

    if (!email.trim()) {
      setEmailError(true);
      return setError('Email is required');
    }

    try {
      const res = await fetch('/api/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Try again later.');
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setError('Something went wrong. Try again later.');
    }
  };

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('');
        setError('');
        setEmailError(false);
        if (message) router.push('/account');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error, router]);

  return (
    <Layout>
      <Center>
        <ColsWrapper>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Title>Forgot Password</Title>
            <StyledInput
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              hasError={emailError}
            />
            <StyledButton type="submit">Reset Password</StyledButton>
          </form>
        </ColsWrapper>
      </Center>
      {message && <SuccessPopup>{message}</SuccessPopup>}
      {error && <ErrorPopup>{error}</ErrorPopup>}
    </Layout>
  );
}