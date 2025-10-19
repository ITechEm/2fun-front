import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  background-color: #1f1f1f;
  text-align: left;
  color: #fff;
  margin-top: auto;
`;

const FooterContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const FooterSection = styled.div`
  width: 18%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    width: 100%;
    text-align: left;
    margin-left: 40px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
  
`;

const Ul = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const Button = styled.button`
  background-color: transparent;
  color: #fff;
  border: none;
  font-size: 16px;
  font-weight: normal;
 
  cursor: pointer;
  text-decoration: none;
  text-align: left;
  padding: 6px;
  transition: color 0.3s ease;
  
  &:hover {
    color: #6a5acd;
  }
`;

const EmailInput = styled.input`
  padding: 10px;
  width: 80%;
  margin-bottom: 10px;
  background-color: #333;
  color: white;
  border: none;
`;

const SubscribeButton = styled.button`
  background-color: #6a5acd;
  color: white;
  padding: 12px 20px;
  border: none;
  cursor: pointer;
  margin-top: 5px;
`;

const OnlineSupportButton = styled.button`
  background-color: #6a5acd;
  color: white;
  padding: 12px 20px;
  border: none;
  cursor: pointer;
  margin-left: -5px;
  margin-top: 10px;
  border-radius: 20px;
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: -10px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  img {
    width: 35px;
    height: auto;
  }
  @media (max-width: 768px) {
    margin-top: 30px;
  }
`;

const Toast = styled.div`
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${(props) => (props.isSuccess ? '#28a745' : '#dc3545')};
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

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
    <FooterWrapper>
      <FooterContainer>
        {/* Categories Section */}
        <FooterSection>
          <SectionTitle>CATEGORIES</SectionTitle>
          <Ul>
            <li><Button onClick={handleReturnsClick}>Wood</Button></li>
            <li><Button onClick={handleReturnsClick}>Clothes</Button></li>
            <li><Button onClick={handleReturnsClick}>Rent</Button></li>
            <li><Button onClick={handleReturnsClick}>3D Print</Button></li>
          </Ul>
        </FooterSection>

        {/* Help Section */}
        <FooterSection>
          <SectionTitle>HELP</SectionTitle>
          <Ul>
            <li><Button onClick={handleReturnsClick}>Track Order</Button></li>
            <li><Button onClick={handleReturnsClick}>Returns</Button></li>
            <li><Button onClick={handleReturnsClick}>FAQs</Button></li>
          </Ul>
        </FooterSection>

        {/* Get in Touch Section */}
        <FooterSection>
          <SectionTitle>GET IN TOUCH</SectionTitle>
          <p>Any questions? Let us know...</p>
          <OnlineSupportButton onClick={handleOSClick}>Online Support</OnlineSupportButton>
        </FooterSection>

        {/* Newsletter Section */}
        <FooterSection>
          <SectionTitle>NEWSLETTER</SectionTitle>
          <EmailInput
            type="email"
            placeholder="newsletter@2fun.shops.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <SubscribeButton onClick={handleSubscription}>SUBSCRIBE</SubscribeButton>
          {popupVisible && <Toast isSuccess={isSuccess}>{popupMessage}</Toast>}
        </FooterSection>
      </FooterContainer>

      <FooterBottom>
      <div>
        {/* Other payment icons */}
        <img src="paypal.png" alt="PayPal" style={{ width: "40px", marginRight: "10px" }} />
        <img src="visa.png" alt="Visa" style={{ width: "40px", marginRight: "10px" }} />
        <img src="mastercard.png" alt="MasterCard" style={{ width: "40px", marginRight: "10px" }} />
      </div>
      
      {/* Stripe Logo and Powered by Text */}
      <div style={{ display: "flex"}}>
       
         <a 
          href="https://stripe.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: "#ffffffff", textDecoration: "none" }}
        >
          Secured by Stripe
        </a>
      </div>
    </FooterBottom>

      <FooterBottom>
        <div style={{ textAlign: 'center', color: '#ccc' }}>
          Copyright &copy; 2023 All rights reserved.{' '}
          <a href="/privacy-policy" target="_blank" style={{ color: '#ccc' }}>Privacy Policy</a> |{' '}
          <a href="/terms-conditions" target="_blank" style={{ color: '#ccc' }}>Terms & Conditions</a>
        </div>
      </FooterBottom>
    </FooterWrapper>
  );
};

export default Footer;


// import React, { useState } from 'react';
// import { useRouter } from 'next/router';

// const styles = {
//   footer: {
//     backgroundColor: '#1f1f1f',
//     textAlign: 'left',
//     color: '#fff',
//     marginTop: 'auto',
//   },
//   footerContainer: {
//     display: 'flex',
//     justifyContent: 'center',
//     flexWrap: 'wrap', 
//   },
//   footerSection: {
//     width: '18%',
//     boxSizing: 'border-box',
//   },
//   h3: {
//     fontSize: '18px',
//     fontWeight: 'bold',
//     marginTop: '20px',
    
//   },
//   ul: {
//     listStyleType: 'none',
//     padding: 0,
//   },
//   li: {
//     marginBottom: '10px',
//   },
//   p: {
//     marginBottom: '15px',
//   },
//   socialIcons: {
//     marginTop: '10px',
//   },
//   socialLink: {
//     marginRight: '15px',
//     color: '#fff',
//     textDecoration: 'none',
//   },
//   emailInput: {
//     padding: '10px',
//     width: '80%',
//     marginBottom: '10px',
//     backgroundColor: '#333',
//     color: 'white',
//     border: 'none',
//   },
//   button: {
//     backgroundColor: '#6a5acd',
//     color: 'white',
//     padding: '12px 20px',
//     border: 'none',
//     cursor: 'pointer',
//   },
//   buttonHelp: {
//     display: 'flex',
//     backgroundColor: 'transparent',
//     fontFamily: 'Poppins',
//     color: '#fff',
//     padding: '6px',
//     border: 'none',
//     cursor: 'pointer',
//     textAlign: 'left',
//     fontSize: '16px',
//     textDecoration: 'none',
//     fontWeight: 'normal',
//     transition: 'color 0.3s ease',
//   },
//   OnlineSupport: {
//     backgroundColor: '#6a5acd',
//     color: 'white',
//     padding: '12px 20px',
//     border: 'none',
//     cursor: 'pointer',
//     marginLeft: '-5px',
//     borderRadius: '20px',
//   },
//   buttonHover: {
//     backgroundColor: '#5a4cb1',
//   },
//   footerBottom: {
//     display: 'flex',
//     justifyContent: 'center',
//     marginTop: '-10px',
//     gap: '10px',
//     flexWrap: 'wrap',
//     marginBottom:'20px'
//   },
//   toastSuccess: {
//     position: 'fixed',
//     top: '50px',
//     left: '50%',
//     transform: 'translateX(-50%)',
//     backgroundColor: '#28a745',
//     color: '#fff',
//     padding: '10px 20px',
//     borderRadius: '5px',
//     zIndex: 1000,
//     fontSize: '16px',
//     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
//   },
//   toastError: {
//     position: 'fixed',
//     top: '50px',
//     left: '50%',
//     transform: 'translateX(-50%)',
//     backgroundColor: '#dc3545',
//     color: '#fff',
//     padding: '10px 20px',
//     borderRadius: '10px',
//     zIndex: 1000,
//     fontSize: '16px',
//     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
//   },
// };

// const Footer = () => {
//   const [email, setEmail] = useState('');
//   const [popupMessage, setPopupMessage] = useState('');
//   const [popupVisible, setPopupVisible] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const router = useRouter();
  
//   const handleSubscription = () => {
//     if (email) {
//       setPopupMessage(`Thank you for subscribing with ${email}!`);
//       setIsSuccess(true);
//       setPopupVisible(true);
//       setTimeout(() => {
//         setPopupVisible(false);
//       }, 3000);
//       setEmail('');
//     } else {
//       setPopupMessage('Please enter a valid email address!');
//       setIsSuccess(false);
//       setPopupVisible(true);
//       setTimeout(() => {
//         setPopupVisible(false);
//       }, 3000);
//     }
//   };

//   const handleReturnsClick = () => {
//     router.push('/returns'); 
//   };

//   const handleOSClick = () => {
//     router.push('https://www.instagram.com/'); 
//   };

  

//   return (
//     <footer style={styles.footer}>
//       <div style={styles.footerContainer}>
//         {/* Categories Section */}
//         <div style={styles.footerSection}>
//           <h3 style={styles.h3}>CATEGORIES</h3>
//           <ul style={styles.ul}>
//             <button onClick={handleReturnsClick} style={{ ...styles.buttonHelp, ':hover': styles.buttonHoverH }} >Wood</button>
//             <button onClick={handleReturnsClick} style={{ ...styles.buttonHelp, ':hover': styles.buttonHoverH }} >Chlotes</button>
//             <button onClick={handleReturnsClick} style={{ ...styles.buttonHelp, ':hover': styles.buttonHoverH }} >Rent</button>
//             <button onClick={handleReturnsClick} style={{ ...styles.buttonHelp, ':hover': styles.buttonHoverH }} >3D Print</button>
//           </ul>
//         </div>

//         {/* Help Section */}
//         <div style={styles.footerSection}>
//           <h3 style={styles.h3}>HELP</h3>
//           <ul style={styles.ul}>
//             <button onClick={handleReturnsClick} style={{ ...styles.buttonHelp, ':hover': styles.buttonHoverH }} >Track Order</button>
//             <button onClick={handleReturnsClick} style={{ ...styles.buttonHelp, ':hover': styles.buttonHoverH }} >Returns</button>
//             <button onClick={handleReturnsClick} style={{ ...styles.buttonHelp, ':hover': styles.buttonHoverH }} >FAQs</button>
//           </ul>
//         </div>

//         {/* Get in Touch Section */}
//         <div style={styles.footerSection}>
//           <h3 style={styles.h3}>GET IN TOUCH</h3>
//           <p style={styles.p}>Any questions? Let us know...</p>
          
//           <button onClick={handleOSClick} style={styles.OnlineSupport}>Online Support</button>
//         </div>

//         {/* Newsletter Section */}
//         <div style={styles.footerSection}>
//           <h3 style={styles.h3}>NEWSLETTER</h3>
//           <input 
//             type="email" 
//             placeholder="newsletter@2fun.shops.com" 
//             value={email}
//             onChange={(e) => setEmail(e.target.value)} 
//             style={styles.emailInput}
//           />
//           <button onClick={handleSubscription} style={styles.button}>SUBSCRIBE</button>
//            {popupVisible && (
//         <div style={isSuccess ? styles.toastSuccess : styles.toastError}>
//           {popupMessage}
//         </div>
//       )}
//         </div>
//       </div>
      
//       <div style={styles.footerBottom}>
//         <img src="paypal.png" alt="PayPal" />
//         <img src="visa.png" alt="Visa" />
//         <img src="mastercard.png" alt="MasterCard"/>
//       </div>

//       <div style={styles.footerBottom}>
//         <div style={{textAlign: 'center', color: '#ccc'}}>
//           Copyright &copy; 2025 All rights reserved <a href="privacy-policy" target="_blank">Privacy policy</a> <a href="terms-conditions" target="_blank">Terms & conditions</a>
          
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;