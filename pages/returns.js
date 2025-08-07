import React from 'react';
import Layout from "@/pages/layout";

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center',
    maxWidth: '800px', 
    margin: 'auto', 
    padding: '20px',
    backgroundColor: '#fff', 
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginTop:'50px',
    marginBottom:'50px'
  },
  heading: {
    fontSize: '36px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  paragraph: {
    fontSize: '18px',
    lineHeight: '1.6',
    marginBottom: '20px',
    color: '#555',
    textAlign: 'center',
  },
};


const Returns = () => {
  return (
  <Layout>
   <div style={styles.container}>
      <h1 style={styles.heading}>Returns Policy</h1>
      <p style={styles.paragraph}>
        At 2fun.shops, we take great pride in creating personalized products tailored to your unique preferences. Each item is made to order specifically for you, which makes it one-of-a-kind. Because of this, we are unable to accept returns or exchanges for any personalized products.
      </p>
      <p style={styles.paragraph}>
        We understand that purchasing a personalized item is a special decision, and we encourage you to carefully review your order details before finalizing your purchase. Our team is committed to ensuring that your order meets your expectations, and we are here to assist with any questions or concerns prior to purchase.
      </p>
      <p style={styles.paragraph}>
        If you have any questions regarding your order or our policies, please don’t hesitate to get in touch with us. We are always happy to help.
      </p>
      <p style={styles.paragraph}>
        Thank you for understanding, and we hope you enjoy your unique, personalized item!
      </p>
    </div>
  </Layout>
     
  );
};
export default Returns;