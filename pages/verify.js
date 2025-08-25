import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './layout2';
import Center from '@/components/Center';
import Input from '@/components/Input';
import Button from '@/components/Button';
import styled from 'styled-components';

const VerifyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 50px auto;
  background: white;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
`;

const Title = styled.h2`
  font-size: 32px;
  color: #1f1f1f;
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Georgia', serif;
`;

const StyledInput = styled(Input)`
  border-radius: 12px;
  padding: 12px;
  font-size: 16px;
  width: 100%;
`;

const StyledButton = styled(Button)`
  background-color: #1f1f1f;
  color: white;
  border-radius: 999px;
  padding: 12px;
  font-weight: bold;
  font-size: 16px;
  width: 100%;
  margin-top: 10px;
  text-align: center;
  justify-content: center;

  &:hover {
    background-color: #333;
  }
`;

const InfoText = styled.p`
  font-size: 14px;
  color: #444;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 5px;
`;

const ErrorText = styled.p`
  color: #e53935;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
`;

const SuccessText = styled.p`
  color: #43a047;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
`;

const TimerText = styled.p`
  font-size: 14px;
  color: #888;
  text-align: center;
`;

export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (router.query.email) {
      setEmail(router.query.email);
      localStorage.setItem('pendingEmail', router.query.email);
    } else {
      const savedEmail = localStorage.getItem('pendingEmail');
      if (savedEmail) setEmail(savedEmail);
    }
  }, [router.query.email]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const verifyCode = async (e) => {
    e.preventDefault();

    if (!email || !code) {
      setError('Code is missing');
      return;
    }

    try {
      await axios.post('/api/verify-code', { email, code }, {
        headers: { 'Content-Type': 'application/json' },
      });
      setSuccess('Account verified. Redirecting...');
      localStorage.removeItem("pendingEmail");
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid code');
    }
  };

  const resendCode = async () => {
    setResending(true);
    setError('');
    try {
      await axios.post('/api/send-verification-code', { email });
      setSecondsLeft(120);
    } catch (err) {
      setError('Failed to resend code');
    }
    setResending(false);
  };

  const handleButtonClick = (e) => {
    if (secondsLeft === 0) {
      resendCode();
    } else {
      verifyCode(e);
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <Layout>
      <Center>
        <VerifyWrapper>
          <form onSubmit={handleButtonClick} style={{ width: '100%' }}>
            <Title>Verify Email</Title>
            <InfoText>We sent a code to <strong>{email}</strong></InfoText>

            <StyledInput
              type="text"
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              
            />
            <TimerText>
              {secondsLeft > 0
                ? `Code expires in ${formatTime(secondsLeft)}`
                : 'Code expired. You can resend it'}
            </TimerText>
            <StyledButton type="submit">
              {secondsLeft === 0 ? (resending ? 'Resending...' : 'Resend Code') : 'Verify'}
            </StyledButton>

            

            {error && <ErrorText>{error}</ErrorText>}
            {success && <SuccessText>{success}</SuccessText>}
          </form>
        </VerifyWrapper>
      </Center>
    </Layout>
  );
}
