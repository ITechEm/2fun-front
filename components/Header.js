
'use client';
import Link from "next/link";
import styled from "styled-components";
import { useContext, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { CartContext } from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";
import { usePathname } from 'next/navigation';
import SearchIcon from "@/components/icons/SearchIcon";
import XIcon from "@/components/icons/XIcon";

const StyledHeader = styled.header`
  background-color: #f9f9f9;
  position: sticky;
  top: 0;
  z-index: 10;
  color: black;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); /* Optional, adjust for mobile if needed */
  min-height: 60px;
  padding: 1px ;
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
  padding: 0 20px;
  max-width: 100%;
  width: 100%;
`;

const Logo = styled(Link)`
  text-decoration: none;

  img {
    width: 120px;
    height: 60px;
    object-fit: contain;
  }
  @media (max-width: 768px) {
  margin-left: -20px;
  }
`;

const StyledNav = styled.nav`
  display: ${props => (props.mobileNavActive ? 'block' : 'none')};
  gap: 15px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 70px 20px 20px;
  background-color: #f9f9f9;
  transition: opacity 0.5s ease, transform 0.5s ease;
  transform: translateY(${props => (props.mobileNavActive ? '0' : '-100%')});
  opacity: ${props => (props.mobileNavActive ? '1' : '0')};

  @media screen and (min-width: 768px) {
    display: flex;
    position: static;
    padding: 0;
    transform: none;
    opacity: 1;
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
    padding: 0 10 px;
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
  position: relative;
  transition: opacity 0.3s ease;

  ${props => !props.mobileNavActive && `
    opacity: 1;
  `}

  @media screen and (min-width: 768px) {
    display: none;
  }
`;


const SideIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: 500px;

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
  @media (max-width: 768px) {
    margin-left: 0px;
    margin-top: 20px;
    
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
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const { cartProducts } = useContext(CartContext);
  const { data: session, status } = useSession();
  const userName = session?.user?.name?.split(' ')[0] || session?.user?.email;
  const pathname = usePathname();

  const handleNavToggle = () => {
    setMobileNavActive(prevState => !prevState);
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
            <NavButton onClick={handleNavToggle} aria-label="Toggle navigation menu" mobileNavActive={mobileNavActive}>
              {mobileNavActive ? <XIcon /> : <BarsIcon />}
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
            </StyledNav>
          </LeftGroup>
          
        </Wrapper>
      </WideCenter>
    </StyledHeader>
  );
}





