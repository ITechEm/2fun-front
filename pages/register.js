import Layout from "./layout2";
import Center from "@/components/Center";
import Button from "@/components/Button";
import styled, { keyframes } from "styled-components";
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

const StyledInput = styled(Input)`
  border-radius: 12px;
  padding: 12px;
  font-size: 16px;
  margin-bottom: 15px;
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

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
  e.preventDefault();

  if (!name || !email || !password) {
    setFormError('Toate câmpurile sunt obligatorii.');
    return;
  }

  if (password.length < 6 || password.length > 12) {
    setFormError('Parola trebuie să fie între 6 și 12 caractere.');
    return;
  }

  setFormError('');

  try {
    
    await axios.post('/api/send-verification-code', { name, email, password });

   
    router.push(`/verify?email=${encodeURIComponent(email)}`);
  } catch (error) {
    setFormError(error.response?.data?.error || 'Error sending verification email');
  }
};

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
            <form onSubmit={handleRegister} style={{ width: '100%' }}>
              <Title>Register</Title>

              <StyledInput
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <StyledInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

              <StyledButton type="submit" block>Create Account</StyledButton>

              <SmallText>
               Do you already have an account?{' '}
                <LinkButton onClick={() => router.push('/login')}>
                  Login
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






// import Header from "@/components/Header";
// import Center from "@/components/Center";
// import Button from "@/components/Button";
// import styled from "styled-components";
// import WhiteBox from "@/components/WhiteBox";
// import { RevealWrapper } from "next-reveal";
// import Input from "@/components/Input";
// import { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/router";

// const ColsWrapper = styled.div`
//   display: grid;
//   grid-template-columns: 1fr;
//   max-width: 400px;
//   margin: 40px auto;
// `;

// export default function RegisterPage() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [formError, setFormError] = useState('');
//   const router = useRouter();

//   async function handleRegister() {
//     setFormError('');
//     try {
//       await axios.post('/api/register', { name, email, password });
//       // After registration, redirect to login page
//       router.push('/login');
//     } catch (err) {
//       setFormError(err.response?.data?.error || 'Error registering');
//     }
//   }

//   return (
//     <>
//       <Header />
//       <Center>
//         <ColsWrapper>
//           <RevealWrapper delay={100}>
//             <WhiteBox>
//               <h2>Register</h2>
//               <Input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={ev => setEmail(ev.target.value)}
//               />
//               <Input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={ev => setPassword(ev.target.value)}
//               />
//               {formError && (
//                 <p style={{ color: 'red', marginTop: 10 }}>{formError}</p>
//               )}
//               <Button primary block onClick={handleRegister}>Register</Button>
//               <p style={{ marginTop: 10 }}>
//                 Already have an account?{" "}
//                 <button
//                   onClick={() => router.push('/login')}
//                   style={{
//                     textDecoration: 'underline',
//                     background: 'none',
//                     border: 0,
//                     color: 'blue',
//                     cursor: 'pointer',
//                   }}
//                 >
//                   Login here
//                 </button>
//               </p>
//             </WhiteBox>
//           </RevealWrapper>
//         </ColsWrapper>
//       </Center>
//     </>
//   );
// }
