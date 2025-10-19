const nodemailer = require('nodemailer');

export async function sendNewOrderEmail({ to, order }) {
  // SES SMTP Config
  const transporter = nodemailer.createTransport({
    host: 'email-smtp.us-east-1.amazonaws.com', // SES SMTP endpoint, adjust region if needed
    port: 587, // You can also use 465 for SSL
    auth: {
      user: process.env.SES_SMTP_USERNAME, // SMTP username from SES
      pass: process.env.SES_SMTP_PASSWORD, // SMTP password from SES
    },
  });

  // Email content
  const mailOptions = {
    from: 'support@2funshops.com', // Verified email in SES
    to: to, // Recipient email address
    subject: `New Order: ${order.orderNumber}`,
    html: `
      <h2>New Order Received 🛒</h2>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>Email:</strong> ${order.userEmail}</p>
      <p><strong>Items:</strong> ${order.line_items.length} items</p>
      <p>Check your admin panel for full details.</p>
    `,
  };

  try {
    // Send the email via SES SMTP
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}
