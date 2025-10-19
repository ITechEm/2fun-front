const express = require('express');
const bodyParser = require('body-parser');
const { Resend } = require('resend');

// Initialize the Resend client with your API key
const resend = new Resend(process.env.RESEND_API_KEY); // Make sure to set your API key in your environment

const app = express();

// Use body-parser to parse incoming JSON
app.use(bodyParser.json());

// Route to receive the order data from the front-end
app.post('/order', async (req, res) => {
  const { orderNumber, userEmail, line_items } = req.body;

  // Create the HTML email content
  const html = `
    <h2>🛒 New Order Received</h2>
    <p><strong>Order Number:</strong> ${orderNumber}</p>
    <p><strong>Email:</strong> ${userEmail}</p>
    <p><strong>Items:</strong> ${line_items.length}</p>
    <p>Check your admin panel for full details.</p>
  `;

  try {
    // Send email using Resend API
    const result = await resend.emails.send({
      from: '2funshops.com <support@2funshops.com>', // Make sure this is a valid sender email
      to: '2fun.shops@gmail.com', // Replace with your email where you want to receive the order notifications
      subject: `New Order: ${orderNumber}`,
      html,
    });

    console.log("✅ Email sent successfully:", result);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});

// Start the server on a specific port (e.g., 3000)
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});