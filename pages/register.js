import Header from "@/components/Header";
import Center from "@/components/Center";
import Button from "@/components/Button";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import { RevealWrapper } from "next-reveal";
import Input from "@/components/Input";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  max-width: 400px;
  margin: 40px auto;
`;

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [formError, setFormError] = useState('');
  const router = useRouter();

  async function handleRegister() {
    setFormError('');
    try {
      await axios.post('/api/register', {
        name,
        email,
        password,
        
      });
      router.push('/login');
    } catch (err) {
      setFormError(err.response?.data?.error || 'Error registering');
    }
  }

  return (
    <>
      <Header />
      <Center>
        <ColsWrapper>
          <RevealWrapper delay={100}>
            <WhiteBox>
              <h2>Register</h2>
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                maxLength={12}
              />
              
              {formError && (
                <p style={{ color: 'red', marginTop: 10 }}>{formError}</p>
              )}
              <Button primary block onClick={handleRegister}>
                Register
              </Button>
              <p style={{ marginTop: 10 }}>
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/login')}
                  style={{
                    textDecoration: 'underline',
                    background: 'none',
                    border: 0,
                    color: 'blue',
                    cursor: 'pointer',
                  }}
                >
                  Login here
                </button>
              </p>
            </WhiteBox>
          </RevealWrapper>
        </ColsWrapper>
      </Center>
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
