import React, { useState } from 'react';
import { useRouter } from 'next/router';

const styles = {
  footer: {
    backgroundColor: '#1f1f1f',
    textAlign: 'left',
    color: '#fff',
    marginTop: 'auto',
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap', 
  },
  footerSection: {
    width: '18%',
    boxSizing: 'border-box',
  },
  h3: {
    fontSize: '18px',
    fontWeight: 'bold',
    
  },
  ul: {
    listStyleType: 'none',
    padding: 0,
  },
  li: {
    marginBottom: '10px',
  },
  p: {
    marginBottom: '15px',
  },
  socialIcons: {
    marginTop: '10px',
  },
  socialLink: {
    marginRight: '15px',
    color: '#fff',
    textDecoration: 'none',
  },
  emailInput: {
    padding: '10px',
    width: '80%',
    marginBottom: '10px',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
  },
  button: {
    backgroundColor: '#6a5acd',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    cursor: 'pointer',
  },
  buttonHelp: {
    display: 'flex',
    backgroundColor: 'transparent',
    fontFamily: 'Poppins',
    color: '#fff',
    padding: '6px',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '16px',
    textDecoration: 'none',
    fontWeight: 'normal',
    transition: 'color 0.3s ease',
  },
  OnlineSupport: {
    backgroundColor: '#6a5acd',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '-5px',
    borderRadius: '20px',
  },
  buttonHover: {
    backgroundColor: '#5a4cb1',
  },
  footerBottom: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '-10px',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom:'20px'
  },
  toastSuccess: {
    position: 'fixed',
    top: '50px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '5px',
    zIndex: 1000,
    fontSize: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  toastError: {
    position: 'fixed',
    top: '50px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#dc3545',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '10px',
    zIndex: 1000,
    fontSize: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  
  const handleSubscription = () => {
    if (email) {
      setPopupMessage(`Thank you for subscribing with ${email}!`);
      setIsSuccess(true);
      setPopupVisible(true);
      setTimeout(() => {
        setPopupVisible(false);
      }, 3000);
      setEmail('');
    } else {
      setPopupMessage('Please enter a valid email address!');
      setIsSuccess(false);
      setPopupVisible(true);
      setTimeout(() => {
        setPopupVisible(false);
      }, 3000);
    }
  };

  const handleReturnsClick = () => {
    router.push('/returns'); 
  };

  const handleOSClick = () => {
    router.push('https://www.instagram.com/'); 
  };

  

  return (
    <footer style={styles.footer}>
      <div style={styles.footerContainer}>
        {/* Categories Section */}
        <div style={styles.footerSection}>
          <h3 style={styles.h3}>CATEGORIES</h3>
          <ul style={styles.ul}>
            <button onClick={handleReturnsClick} style={{ ...styles.buttonHelp, ':hover': styles.buttonHoverH }} >Wood</button>
            <button onClick={handleReturnsClick} style={{ ...styles.buttonHelp, ':hover': styles.buttonHoverH }} >Chlotes</button>
            <button onClick={handleReturnsClick} style={{ ...styles.buttonHelp, ':hover': styles.buttonHoverH }} >Rent</button>
            <button onClick={handleReturnsClick} style={{ ...styles.buttonHelp, ':hover': styles.buttonHoverH }} >3D Print</button>
          </ul>
        </div>

        {/* Help Section */}
        <div style={styles.footerSection}>
          <h3 style={styles.h3}>HELP</h3>
          <ul style={styles.ul}>
            <button onClick={handleReturnsClick} style={{ ...styles.buttonHelp, ':hover': styles.buttonHoverH }} >Track Order</button>
            <button onClick={handleReturnsClick} style={{ ...styles.buttonHelp, ':hover': styles.buttonHoverH }} >Returns</button>
            <button onClick={handleReturnsClick} style={{ ...styles.buttonHelp, ':hover': styles.buttonHoverH }} >FAQs</button>
          </ul>
        </div>

        {/* Get in Touch Section */}
        <div style={styles.footerSection}>
          <h3 style={styles.h3}>GET IN TOUCH</h3>
          <p style={styles.p}>Any questions? Let us know...</p>
          
          <button onClick={handleOSClick} style={styles.OnlineSupport}>Online Support</button>
        </div>

        {/* Newsletter Section */}
        <div style={styles.footerSection}>
          <h3 style={styles.h3}>NEWSLETTER</h3>
          <input 
            type="email" 
            placeholder="newsletter@2fun.shops.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            style={styles.emailInput}
          />
          <button onClick={handleSubscription} style={styles.button}>SUBSCRIBE</button>
           {popupVisible && (
        <div style={isSuccess ? styles.toastSuccess : styles.toastError}>
          {popupMessage}
        </div>
      )}
        </div>
      </div>
      
      <div style={styles.footerBottom}>
        <img src="paypal.png" alt="PayPal" />
        <img src="visa.png" alt="Visa" />
        <img src="mastercard.png" alt="MasterCard"/>
      </div>

      <div style={styles.footerBottom}>
        <div style={{textAlign: 'center', color: '#ccc'}}>
          Copyright &copy; 2025 All rights reserved <a href="privacy-policy" target="_blank">Privacy policy</a> <a href="terms-conditions" target="_blank">Terms & conditions</a>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;