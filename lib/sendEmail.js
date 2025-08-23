import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewOrderEmail({ to, order }) {
  const html = `
    <h2>🛒 New Order Received</h2>
    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
    <p><strong>Email:</strong> ${order.userEmail}</p>
    <p><strong>Items:</strong> ${order.line_items.length}</p>
    <p>Check your admin panel for full details.</p>
  `;

  try {
    const result = await resend.emails.send({
      from: '2fun.shop.com',
      to,
      subject: `New Order: ${order.orderNumber}`,
      html,
    });

    console.log("✅ Resend email sent:", result);
    return result;
  } catch (error) {
    console.error("❌ Resend email failed:", error);
    throw error;
  }
}
