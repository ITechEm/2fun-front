import Layout from "./layout";
import Center from "@/components/Center";
import { signOut, useSession } from "next-auth/react";
import Button from "@/components/Button";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import { RevealWrapper } from "next-reveal";
import { useEffect } from "react";
import { useRouter } from "next/router";

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  max-width: 400px;
  margin: 40px auto;
`;

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // Redirect to login if not logged in
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null; // or a loading spinner, since redirect happens above
  }

  return (
    <>
      <Layout>
      <Center>
        <ColsWrapper>
          <RevealWrapper delay={100}>
            <WhiteBox>
              <h2>Account Details</h2>
              <p style={{ margin: "20px 0" }}>
                You are logged in as <strong>{session.user?.email}</strong>.
              </p>
              <Button primary onClick={() => signOut({ callbackUrl: "/" , redirect: true})}>
                Logout
              </Button>
            </WhiteBox>
          </RevealWrapper>
        </ColsWrapper>
      </Center>
      </Layout>
    </>
  );
}


// import Header from "@/components/Header";
// import Center from "@/components/Center";
// import { signIn, signOut, useSession } from "next-auth/react";
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

// export default function AccountPage() {
//   const { data: session } = useSession();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLogin, setIsLogin] = useState(true);
//   const [formError, setFormError] = useState('');
//   const router = useRouter();

//   async function handleLoginOrRegister() {
//     setFormError('');

//     if (isLogin) {
//       const res = await signIn('credentials', {
//         email,
//         password,
//         redirect: false,
//       });
//       if (!res.error) {
//         router.push('/'); // redirect after successful login
//       } else {
//         setFormError(res.error);
//       }
//     } else {
//       try {
//         await axios.post('/api/register', { name, email, password });
//         // after registration, redirect to login page
//         router.push('/account'); 
//       } catch (err) {
//         setFormError(err.response?.data?.error || 'Error registering');
//       }
//     }
//   }

//   return (
//     <>
//       <Header />
//       <Center>
//         <ColsWrapper>
//           <RevealWrapper delay={100}>
//             <WhiteBox>
//               <h2>{session ? 'Welcome!' : (isLogin ? 'Login' : 'Register')}</h2>

//               {session ? (
//                 <>
//                   <p style={{ margin: '20px 0' }}>
//                     You are logged in as <strong>{session.user?.email}</strong>.
//                   </p>
//                   <Button primary onClick={() => signOut()}>Logout</Button>
//                 </>
//               ) : (
//                 <>
                  
//                   <Input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={ev => setEmail(ev.target.value)}
//                   />
//                   <Input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={ev => setPassword(ev.target.value)}
//                   />
//                   {formError && (
//                     <p style={{ color: 'red', marginTop: 10 }}>{formError}</p>
//                   )}
//                   <Button primary block onClick={handleLoginOrRegister}>
//                     {isLogin ? 'Login' : 'Register'}
//                   </Button>
//                   <p style={{ marginTop: 10 }}>
//                     {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
//                     <button
//                       onClick={() => setIsLogin(!isLogin)}
//                       style={{
//                         textDecoration: 'underline',
//                         background: 'none',
//                         border: 0,
//                         color: 'blue',
//                         cursor: 'pointer',
//                       }}
//                     >
//                       {isLogin ? 'Register here' : 'Login here'}
//                     </button>
//                   </p>
//                 </>
//               )}
//             </WhiteBox>
//           </RevealWrapper>
//         </ColsWrapper>
//       </Center>
//     </>
//   );
// }



// import Header from "@/components/Header";
// import Title from "@/components/Title";
// import Center from "@/components/Center";
// import {signIn, signOut, useSession} from "next-auth/react";
// import Button from "@/components/Button";
// import styled from "styled-components";
// import WhiteBox from "@/components/WhiteBox";
// import {RevealWrapper} from "next-reveal";
// import Input from "@/components/Input";
// import {useEffect, useState} from "react";
// import axios from "axios";
// import Spinner from "@/components/Spinner";
// import ProductBox from "@/components/ProductBox";
// import Tabs from "@/components/Tabs";
// import SingleOrder from "@/components/SingleOrder";

// const ColsWrapper = styled.div`
//   display:grid;
//   grid-template-columns: 1.2fr .8fr;
//   gap: 40px;
//   margin: 40px 0;
//   p{
//     margin:5px;
//   }
// `;

// const CityHolder = styled.div`
//   display:flex;
//   gap: 5px;
// `;

// const WishedProductsGrid = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: 40px;
// `;

// export default function AccountPage() {
//   const {data:session} = useSession();
//   const [name,setName] = useState('');
//   const [email,setEmail] = useState('');
//   const [city,setCity] = useState('');
//   const [postalCode,setPostalCode] = useState('');
//   const [streetAddress,setStreetAddress] = useState('');
//   const [country,setCountry] = useState('');
//   const [addressLoaded,setAddressLoaded] = useState(true);
//   const [wishlistLoaded,setWishlistLoaded] = useState(true);
//   const [orderLoaded,setOrderLoaded] = useState(true);
//   const [wishedProducts,setWishedProducts] = useState([]);
//   const [activeTab, setActiveTab] = useState('Orders');
//   const [orders, setOrders] = useState([]);

  
// const [password, setPassword] = useState('');
// const [isLogin, setIsLogin] = useState(true); // <-- This is the missing one
// const [formError, setFormError] = useState('');


//   async function logout() {
//     await signOut({
//       callbackUrl: process.env.NEXT_PUBLIC_URL,
//     });
//   }
//   async function login() {
//     await signIn('google');
//   }
//   function saveAddress() {
//     const data = {name,email,city,streetAddress,postalCode,country};
//     axios.put('/api/address', data);
//   }
//   useEffect(() => {
//     if (!session) {
//       return;
//     }
//     setAddressLoaded(false);
//     setWishlistLoaded(false);
//     setOrderLoaded(false);
//     axios.get('/api/address').then(response => {
//       setName(response.data.name);
//       setEmail(response.data.email);
//       setCity(response.data.city);
//       setPostalCode(response.data.postalCode);
//       setStreetAddress(response.data.streetAddress);
//       setCountry(response.data.country);
//       setAddressLoaded(true);
//     });
//     axios.get('/api/wishlist').then(response => {
//       setWishedProducts(response.data.map(wp => wp.product));
//       setWishlistLoaded(true);
//     });
//     axios.get('/api/orders').then(response => {
//       setOrders(response.data);
//       setOrderLoaded(true);
//     });
//   }, [session]);
//   function productRemovedFromWishlist(idToRemove) {
//     setWishedProducts(products => {
//       return [...products.filter(p => p._id.toString() !== idToRemove)];
//     });
//   }
//   return (
//     <>
//       <Header />
//       <Center>
//         <ColsWrapper>
//           <div>
//             <RevealWrapper delay={0}>
//               <WhiteBox>
//                 <Tabs
//                   tabs={['Orders','Wishlist']}
//                   active={activeTab}
//                   onChange={setActiveTab}
//                 />
//                 {activeTab === 'Orders' && (
//                   <>
//                     {!orderLoaded && (
//                       <Spinner fullWidth={true} />
//                     )}
//                     {orderLoaded && (
//                       <div>
//                         {orders.length === 0 && (
//                           <p>Login to see your orders</p>
//                         )}
//                         {orders.length > 0 && orders.map(o => (
//                           <SingleOrder {...o} />
//                         ))}
//                       </div>
//                     )}
//                   </>
//                 )}
//                 {activeTab === 'Wishlist' && (
//                   <>
//                     {!wishlistLoaded && (
//                       <Spinner fullWidth={true} />
//                     )}
//                     {wishlistLoaded && (
//                       <>
//                         <WishedProductsGrid>
//                           {wishedProducts.length > 0 && wishedProducts.map(wp => (
//                             <ProductBox key={wp._id} {...wp} wished={true} onRemoveFromWishlist={productRemovedFromWishlist} />
//                           ))}
//                         </WishedProductsGrid>
//                         {wishedProducts.length === 0 && (
//                           <>
//                             {session && (
//                               <p>Your wishlist is empty</p>
//                             )}
//                             {!session && (
//                               <p>Login to add products to your wishlist</p>
//                             )}
//                           </>
//                         )}
//                       </>
//                     )}
//                   </>
//                 )}
//               </WhiteBox>
//             </RevealWrapper>
//           </div>
//           <div>
//             <RevealWrapper delay={100}>
//               <WhiteBox>
//                 <h2>{session ? 'Account details' : 'Login'}</h2>
//                 {!addressLoaded && (
//                   <Spinner fullWidth={true} />
//                 )}
//                 {addressLoaded && session && (
//                   <>
//                     <Input type="text"
//                            placeholder="Name"
//                            value={name}
//                            name="name"
//                            onChange={ev => setName(ev.target.value)} />
//                     <Input type="text"
//                            placeholder="Email"
//                            value={email}
//                            name="email"
//                            onChange={ev => setEmail(ev.target.value)}/>
//                     <CityHolder>
//                       <Input type="text"
//                              placeholder="City"
//                              value={city}
//                              name="city"
//                              onChange={ev => setCity(ev.target.value)}/>
//                       <Input type="text"
//                              placeholder="Postal Code"
//                              value={postalCode}
//                              name="postalCode"
//                              onChange={ev => setPostalCode(ev.target.value)}/>
//                     </CityHolder>
//                     <Input type="text"
//                            placeholder="Street Address"
//                            value={streetAddress}
//                            name="streetAddress"
//                            onChange={ev => setStreetAddress(ev.target.value)}/>
//                     <Input type="text"
//                            placeholder="Country"
//                            value={country}
//                            name="country"
//                            onChange={ev => setCountry(ev.target.value)}/>
//                     <Button black block
//                             onClick={saveAddress}>
//                       Save
//                     </Button>
//                     <hr/>
//                   </>
//                 )}
//                 {session && (
//                   <Button primary onClick={logout}>Logout</Button>
//                 )}
//                 {!session && (
//   <>
//     <Input type="text" placeholder="Name"
//            value={name} onChange={ev => setName(ev.target.value)}
//            style={{ display: isLogin ? 'none' : 'block' }} />
//     <Input type="email" placeholder="Email"
//            value={email} onChange={ev => setEmail(ev.target.value)} />
//     <Input type="password" placeholder="Password"
//            value={password} onChange={ev => setPassword(ev.target.value)} />
//     {formError && <p style={{ color: 'red' }}>{formError}</p>}
//     <Button primary
//             onClick={async () => {
//               setFormError('');
//               if (isLogin) {
//                 const res = await signIn('credentials', {
//                   email,
//                   password,
//                   redirect: false,
//                 });
//                 if (res.error) {
//                   setFormError(res.error);
//                 }
//               } else {
//                 try {
//                   await axios.post('/api/register', { name, email, password });
//                   await signIn('credentials', {
//                     email,
//                     password,
//                     redirect: false,
//                   });
//                 } catch (err) {
//                   setFormError(err.response?.data?.error || 'Error registering');
//                 }
//               }
//             }}>
//       {isLogin ? 'Login' : 'Register'}
//     </Button>
//     {/* <Button onClick={login}>Login with Google</Button> */}
//     <p style={{ marginTop: 10 }}>
//       {isLogin ? 'No account yet?' : 'Already have an account?'}{" "}
//       <button onClick={() => setIsLogin(!isLogin)} style={{ textDecoration: 'underline', background: 'none', border: 0, color: 'blue', cursor: 'pointer' }}>
//         {isLogin ? 'Register here' : 'Login here'}
//       </button>
//     </p>
//   </>
// )}

//               </WhiteBox>
//             </RevealWrapper>
//           </div>
//         </ColsWrapper>
//       </Center>
//     </>
//   );
// }