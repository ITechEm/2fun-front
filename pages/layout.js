import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;  /* Include padding and borders in width/height calculations */
  }

  html, body {
    width: 100%;  /* Ensure full width */
    height: 100%;  /* Ensure full height */
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;        
  width: 100%;  /* Ensure full width */
`;

const Main = styled.main`
  flex: 1;
  width: 100%;  /* Ensure full width */
  padding: 0 20px;  /* Optional padding for responsiveness */
  box-sizing: border-box;  /* Prevent overflow */
`;

const Layout = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <Header />
        <Main>{children}</Main>
        <Footer />
      </Wrapper>
    </>
  );
};

export default Layout;