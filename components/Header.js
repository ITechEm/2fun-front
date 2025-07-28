'use client';
import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import { useContext, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { CartContext } from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";
import SearchIcon from "@/components/icons/SearchIcon";

const StyledHeader = styled.header`
  background-color: #222;
  position: sticky;
  top: 0;
  z-index: 10;
  color: white;
`;

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  font-size: 24px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
`;

const StyledNav = styled.nav`
  display: ${props => props.mobileNavActive ? 'block' : 'none'};
  gap: 15px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 70px 20px 20px;
  background-color: #222;

  @media screen and (min-width: 768px) {
    display: flex;
    position: static;
    padding: 0;
  }
`;

const NavLink = styled(Link)`
  display: block;
  color: #aaa;
  text-decoration: none;
  min-width: 30px;
  padding: 10px 0;

  @media screen and (min-width: 768px) {
    padding: 0 10px;
  }
`;

const NavButton = styled.button`
  background-color: transparent;
  width: 30px;
  height: 30px;
  border: 0;
  color: white;
  cursor: pointer;
  z-index: 3;

  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const SideIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  a, button {
    display: inline-flex;
    align-items: center;
    color: white;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

function AuthLinks({ status, userName }) {
  if (status === 'authenticated') {
    return (
      <>
        <NavLink href="/profile">Hello, {userName}</NavLink>
        <button onClick={() => signOut()}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
</svg>
</button>
      </>
    );
  }

  return (
    <Link href="/account">
      <img src="/user.svg" alt="User" style={{ width: '25px', height: '25px' }} />
    </Link>
  );
}

export default function Header() {
  const { cartProducts } = useContext(CartContext);
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const { data: session, status } = useSession();
  const userName = session?.user?.name?.split(' ')[0] || session?.user?.email;

  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href="/"><img src="/logo.png" alt="Logo" style={{ width: '100px', height: '45px' }} /></Logo>
          <StyledNav mobileNavActive={mobileNavActive}>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">All products</NavLink>
            <NavLink href="/categories">Categories</NavLink>
            
            
          </StyledNav>
          <SideIcons>
            <AuthLinks status={status} userName={userName} />
            {/* <Link href="/search">
              <SearchIcon />
            </Link> */}
            <NavLink href="/cart">
            <img src="/cart.svg" alt="Cart" style={{ width: '25px', height: '25px' }} />
             ({cartProducts.length})</NavLink>
          </SideIcons>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}



// import Link from "next/link";
// import styled from "styled-components";
// import Center from "@/components/Center";
// import {useContext, useState} from "react";
// import { useSession, signOut } from "next-auth/react";
// import {CartContext} from "@/components/CartContext";
// import BarsIcon from "@/components/icons/Bars";
// import SearchIcon from "@/components/icons/SearchIcon";

// const StyledHeader = styled.header`
//   background-color: #222;
//   position:sticky;
//   top:0;
//   z-index:10;
// `;
// const Logo = styled(Link)`
//   color:#fff;
//   text-decoration:none;
//   position: relative;
//   z-index: 3;
// `;
// const Wrapper = styled.div`
//   display: flex;
//   justify-content: space-between;
//   padding: 20px 0;
// `;
// const StyledNav = styled.nav`
//   ${props => props.mobileNavActive ? `
//     display: block;
//   ` : `
//     display: none;
//   `}
//   gap: 15px;
//   position: fixed;
//   top: 0;
//   bottom: 0;
//   left: 0;
//   right: 0;
//   padding: 70px 20px 20px;
//   background-color: #222;
//   @media screen and (min-width: 768px) {
//     display: flex;
//     position: static;
//     padding: 0;
//   }
// `;
// const NavLink = styled(Link)`
//   display: block;
//   color:#aaa;
//   text-decoration:none;
//   min-width:30px;
//   padding: 10px 0;
//   svg{
//     height:20px;
//   }
//   @media screen and (min-width: 768px) {
//     padding:0;
//   }
// `;
// const NavButton = styled.button`
//   background-color: transparent;
//   width: 30px;
//   height: 30px;
//   border:0;
//   color: white;
//   cursor: pointer;
//   position: relative;
//   z-index: 3;
//   @media screen and (min-width: 768px) {
//     display: none;
//   }
// `;
// const SideIcons = styled.div`
//   display: flex;
//   align-items: center;
//   a{
//     display:inline-block;
//     min-width:20px;
//     color:white;
//     svg{
//       width:14px;
//       height:14px;
//     }
//   }
// `;

// export default function Header() {
//   const { cartProducts } = useContext(CartContext);
//   const [mobileNavActive, setMobileNavActive] = useState(false);
//   const { data: session } = useSession();

//   // AuthLinks handles account/login/logout display
//   function AuthLinks() {
//     if (session) {
//       return (
//         <>
//           <NavLink href="/account">
//           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
//   <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
// </svg>

//           </NavLink>
//           <button
//             onClick={() => signOut()}
//             style={{
//               background: "none",
//               border: "none",
//               color: "inherit",
//               cursor: "pointer",
//               fontSize: "inherit",
//               padding: 0,
//             }}
//           >
//             Logout
//           </button>
//         </>
//       );
//     }

//     return <NavLink href="/account"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
//   <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
// </svg>
// </NavLink>;
//   }

//   return (
//     <StyledHeader>
//       <Center>
//         <Wrapper>
//           <Logo href="/">Ecommerce</Logo>
//           <StyledNav mobileNavActive={mobileNavActive}>
//             <NavLink href="/">Home</NavLink>
//             <NavLink href="/products">All products</NavLink>
//             <NavLink href="/categories">Categories</NavLink>

//             {/* Hide this Account link when user is logged in */}
//             {!session && <NavLink href="/account">Account</NavLink>}

//             <NavLink href="/cart">Cart ({cartProducts.length})</NavLink>
//           </StyledNav>
//           <SideIcons>
//             <AuthLinks />
//             <Link href="/search"><SearchIcon /></Link>
//             <NavButton onClick={() => setMobileNavActive(prev => !prev)}>
//               <BarsIcon />
//             </NavButton>
//           </SideIcons>
//         </Wrapper>
//       </Center>
//     </StyledHeader>
//   );
// }

// export default function Header() {
//   const {cartProducts} = useContext(CartContext);
//   const [mobileNavActive,setMobileNavActive] = useState(false);
//   return (
//     <StyledHeader>
//       <Center>
//         <Wrapper>
//           <Logo href={'/'}>Ecommerce</Logo>
//           <StyledNav mobileNavActive={mobileNavActive}>
//             <NavLink href={'/'}>Home</NavLink>
//             <NavLink href={'/products'}>All products</NavLink>
//             <NavLink href={'/categories'}>Categories</NavLink>
//             <NavLink href={'/account'}>Account</NavLink>
//             <NavLink href={'/cart'}>Cart ({cartProducts.length})</NavLink>
//           </StyledNav>
//           <SideIcons>
//             <StyledNav mobileNavActive={mobileNavActive}>
//   <NavLink href="/account">Account</NavLink> {/* This one should be conditional */}
//   ...
// </StyledNav>
//             <Link href={'/search'}><SearchIcon /></Link>
//             <NavButton onClick={() => setMobileNavActive(prev => !prev)}>
//               <BarsIcon />
//             </NavButton>
//           </SideIcons>
//         </Wrapper>
//       </Center>
//     </StyledHeader>
//   );
// }