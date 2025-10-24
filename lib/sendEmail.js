import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail({ to, order }) {
  const year = new Date().getFullYear();

  const itemsHtml = order.line_items.map(item => `
    <li style="margin-bottom:10px;">
      <strong>${item.name}</strong> - Quantity: ${item.quantity} - Price: $${item.price}
    </li>
  `).join("");

  const emailHtml = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px; text-align: center;">
    <img src="https://2funshops.com/logo.png" alt="Logo" style="width:150px; margin-bottom:20px;" />
    <h1 style="color: #333;">Thank you for your order, ${order.name}! 🎉</h1>
    <h2 style="color: #555; margin-bottom: 20px;">Your order has been received and is being processed.</h2>

    <div style="text-align:left; max-width:600px; margin:0 auto; font-size:16px; color:#555;">
      <h3>Order Number: ${order.orderNumber}</h3>
      <p><strong>Shipping Address:</strong><br/>
        ${order.name}<br/>
        ${order.streetAddress}<br/>
        ${order.city}, ${order.postalCode}, ${order.country}
      </p>

      <h3>Order Details:</h3>
      <ul>
        ${itemsHtml}
      </ul>

      <p><strong>Shipping Fee:</strong> $${order.shippingFee}</p>
      <p><strong>Total:</strong> $${order.line_items.reduce((sum, i) => sum + i.price * i.quantity, 0) + order.shippingFee}</p>
    </div>

    <p style="margin-top:20px;">We will notify you once your order is approved and shipped.</p>
    <a href="https://2funshops.com" style="display:inline-block; margin-top:20px; padding:12px 25px; background:#1f1f1f; color:white; border-radius:8px; text-decoration:none; font-size:16px;">
      Visit 2funshops
    </a>

    <p style="font-size:12px; color:#aaa; margin-top:20px;">©${year} 2funshops.com — All rights reserved</p>
  </div>
  `;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_O, // your verified email
      to, // ✅ use the argument
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: emailHtml,
    });

    console.log(`✅ Order confirmation sent to ${to}`);
  } catch (err) {
    console.error("Failed to send order confirmation email:", err?.response?.data || err);
  }
}


// const nodemailer = require('nodemailer');

// export async function sendNewOrderEmail({ to, order }) {
//   // SES SMTP Config
//   const transporter = nodemailer.createTransport({
//     host: 'email-smtp.us-east-1.amazonaws.com', // SES SMTP endpoint, adjust region if needed
//     port: 587, // You can also use 465 for SSL
//     auth: {
//       user: process.env.SES_SMTP_USERNAME, // SMTP username from SES
//       pass: process.env.SES_SMTP_PASSWORD, // SMTP password from SES
//     },
//   });

//   // Email content
//   const mailOptions = {
//     from: 'support@2funshops.com', // Verified email in SES
//     to: to, // Recipient email address
//     subject: `New Order: ${order.orderNumber}`,
//     html: `
//       <h2>New Order Received 🛒</h2>
//       <p><strong>Order Number:</strong> ${order.orderNumber}</p>
//       <p><strong>Email:</strong> ${order.userEmail}</p>
//       <p><strong>Items:</strong> ${order.line_items.length} items</p>
//       <p>Check your admin panel for full details.</p>
//     `,
//   };

//   try {
//     // Send the email via SES SMTP
//     const info = await transporter.sendMail(mailOptions);
//     console.log('✅ Email sent successfully:', info);
//   } catch (error) {
//     console.error('❌ Error sending email:', error);
//     throw error;
//   }
// }
