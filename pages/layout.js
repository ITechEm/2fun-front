
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer'; 

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',        
  },
  main: {
    flex: 1,                  
  },
};
const Layout = ({ children }) => {
  return (
    <div style={styles.wrapper}>
      <Header /> 
      <main>{children}</main> 
      <Footer /> 
    </div>
  );
};

export default Layout;
