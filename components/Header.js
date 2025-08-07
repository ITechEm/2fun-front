'use client';
import Link from "next/link";
import styled from "styled-components";
import { useContext, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { CartContext } from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";
import { usePathname } from 'next/navigation';
import SearchIcon from "@/components/icons/SearchIcon";

const StyledHeader = styled.header`
  background-color: #f9f9f9;
  position: sticky;
  top: 0;
  z-index: 10;
  color: black;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  min-height: 60px;
`;

const WideCenter = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: px 0;
  max-width: 100%;
  width: 100%;

  @media (max-width: 768px) {
    padding: 10px 0;
    flex-direction: column;
    gap: 20px;
  }
`;

const Logo = styled(Link)`
  text-decoration: none;

  img {
    width: 120px;
    height: 60px;
    object-fit: contain;
  }
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
  background-color: #f9f9f9;

  @media screen and (min-width: 768px) {
    display: flex;
    position: static;
    padding: 0;
  }
`;

const NavLink = styled(Link)`
  display: block;
  color: #333;
  text-decoration: none;
  font-size: 16px;
  padding: 10px 0;
  font-weight: 500;
  transition: color 0.2s ease;

  &.active {
    color: #7e74f1;
    font-weight: bold;
  }

  &:hover {
    color: #7e74f1;
  }

  @media screen and (min-width: 768px) {
    padding: 0 10px;
  }
`;

const HotLabel = styled.span`
  background-color: #ff3366;
  color: white;
  font-size: 10px;
  border-radius: 12px;
  padding: 2px 6px;
  margin-left: 2px;
  vertical-align: middle;
  position: relative;
  top: -8px;
`;

const NavButton = styled.button`
  background-color: transparent;
  width: 30px;
  height: 30px;
  border: 0;
  color: black;
  cursor: pointer;
  z-index: 20;

  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const SideIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  a, button {
    display: inline-flex;
    align-items: center;
    color: #333;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    transition: color 0.2s ease;

    &:hover {
      color: #7e74f1;
    }

    svg, img {
      width: 22px;
      height: 22px;
    }
  }
`;

const IconBadge = styled.div`
  position: relative;

  img {
    width: 22px;
    height: 22px;
  }

  span {
    position: absolute;
    top: -8px;
    right: -10px;
    background-color: #4267b2;
    color: white;
    font-size: 10px;
    border-radius: 50%;
    padding: 2px 6px;
    line-height: 1;
  }
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 100px;

  @media (max-width: 768px) {
    gap: 20px;
    width: 100%;
    justify-content: space-between;
  }
`;

function AuthLinks({ status, userName }) {
  if (status === 'authenticated') {
    return (
      <>
        <NavLink href="/profile">Hi, {userName}</NavLink>
        <button onClick={() => signOut()} title="Sign out">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
        </button>
      </>
    );
  }

  return (
    <NavLink href="/account">
      <img src="/user.svg" alt="User" />
    </NavLink>
  );
}

export default function Header({ children }) {
  const { cartProducts } = useContext(CartContext);
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const { data: session, status } = useSession();
  const userName = session?.user?.name?.split(' ')[0] || session?.user?.email;
  const pathname = usePathname();
  const Header1 = ({ children }) => {
  return (
    <header style={{ backgroundColor: '#222', color: 'white', padding: '20px' }}>
      {/* You can add logo and nav items here */}
      <h1>Website Header</h1>
      {children} {/* This will render the children passed into Header */}
    </header>
  );
};

  return (
    <StyledHeader>
      <WideCenter>
        <Wrapper>
          <LeftGroup>
            <Logo href="/">
              <img src="/logo.png" alt="Logo" />
            </Logo>

            {/* Hamburger button toggles mobile nav */}
            <NavButton onClick={() => setMobileNavActive(!mobileNavActive)} aria-label="Toggle navigation menu">
              <BarsIcon />
            </NavButton>

            <StyledNav mobileNavActive={mobileNavActive} onClick={() => setMobileNavActive(false)}>
              <NavLink href="/" className={pathname === '/' ? 'active' : ''}>Home</NavLink>
              <NavLink href="/products" className={pathname === '/products' ? 'active' : ''}>
                Shop<HotLabel>HOT</HotLabel>
              </NavLink>
              <NavLink href="/features" className={pathname === '/features' ? 'active' : ''}>Rent</NavLink>
              <NavLink href="/blog" className={pathname === '/blog' ? 'active' : ''}>Clothes</NavLink>
              <NavLink href="/about" className={pathname === '/about' ? 'active' : ''}>About</NavLink>
              <NavLink href="/contact" className={pathname === '/contact' ? 'active' : ''}>Contact</NavLink>
            </StyledNav>
          </LeftGroup>

          <SideIcons>
            <Link href={'/search'}><SearchIcon /></Link>

            <NavLink href="/cart">
              <IconBadge>
                <img src="/cart.svg" alt="Cart" />
                {cartProducts.length > 0 && <span>{cartProducts.length}</span>}
              </IconBadge>
            </NavLink>

            <AuthLinks status={status} userName={userName} />
          </SideIcons>
        </Wrapper>{children}
      </WideCenter>
    </StyledHeader>
  );
}





// 'use client';
// import Link from "next/link";
// import styled from "styled-components";
// import Center from "@/components/Center";
// import { useContext, useState } from "react";
// import { useSession, signOut } from "next-auth/react";
// import { CartContext } from "@/components/CartContext";
// import BarsIcon from "@/components/icons/Bars";
// import SearchIcon from "@/components/icons/SearchIcon";

// const StyledHeader = styled.header`
//   background-color: #222;
//   position: sticky;
//   top: 0;
//   z-index: 10;
//   color: white;
// `;

// const Logo = styled(Link)`
//   color: #fff;
//   text-decoration: none;
//   font-weight: bold;
//   font-size: 24px;
// `;

// const Wrapper = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 20px 0;
// `;

// const StyledNav = styled.nav`
//   display: ${props => props.mobileNavActive ? 'block' : 'none'};
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
//   color: #aaa;
//   text-decoration: none;
//   min-width: 30px;
//   padding: 10px 0;

//   @media screen and (min-width: 768px) {
//     padding: 0 10px;
//   }
// `;

// const NavButton = styled.button`
//   background-color: transparent;
//   width: 30px;
//   height: 30px;
//   border: 0;
//   color: white;
//   cursor: pointer;
//   z-index: 3;

//   @media screen and (min-width: 768px) {
//     display: none;
//   }
// `;

// const SideIcons = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 15px;

//   a, button {
//     display: inline-flex;
//     align-items: center;
//     color: white;
//     background: none;
//     border: none;
//     cursor: pointer;
//     font-size: 14px;

//     svg {
//       width: 20px;
//       height: 20px;
//     }
//   }
// `;

// function AuthLinks({ status, userName }) {
//   if (status === 'authenticated') {
//     return (
//       <>
//         <NavLink href="/profile">Hello, {userName}</NavLink>
//         <button onClick={() => signOut()}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
//   <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
// </svg>
// </button>
//       </>
//     );
//   }

//   return (
//     <Link href="/account">
//       <img src="/user.svg" alt="User" style={{ width: '25px', height: '25px' }} />
//     </Link>
//   );
// }

// export default function Header() {
//   const { cartProducts } = useContext(CartContext);
//   const [mobileNavActive, setMobileNavActive] = useState(false);
//   const { data: session, status } = useSession();
//   const userName = session?.user?.name?.split(' ')[0] || session?.user?.email;

//   return (
//     <StyledHeader>
//       <Center>
//         <Wrapper>
//           <Logo href="/"><img src="/logo.png" alt="Logo" style={{ width: '100px', height: '45px' }} /></Logo>
//           <StyledNav mobileNavActive={mobileNavActive}>
//             <NavLink href="/">Home</NavLink>
//             <NavLink href="/products">All products</NavLink>
//             <NavLink href="/categories">Categories</NavLink>
            
            
//           </StyledNav>
//           <SideIcons>
//             <AuthLinks status={status} userName={userName} />
//             {/* <Link href="/search">
//               <SearchIcon />
//             </Link> */}
//             <NavLink href="/cart">
//             <img src="/cart.svg" alt="Cart" style={{ width: '25px', height: '25px' }} />
//              ({cartProducts.length})</NavLink>
//           </SideIcons>
//         </Wrapper>
//       </Center>
//     </StyledHeader>
//   );
// }



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