import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Order } from "@/models/Order";
import { Resend } from "resend";
import { Product } from "@/models/Product"; // <-- if needed to fetch product data

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  await mongooseConnect();
  const { user } = await getServerSession(req, res, authOptions);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  if (req.method !== "POST") {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { name, email, city, phone, postalCode, streetAddress, country, cartProducts } = req.body;

    if (!cartProducts?.length) {
      return res.status(400).json({ message: "No products in cart" });
    }

    // --- Fetch product info to build line_items ---
    const uniqueIds = [...new Set(cartProducts)];
    const productDocs = await Product.find({ _id: uniqueIds });

    const line_items = productDocs.map(prod => ({
      name: prod.title,
      quantity: cartProducts.filter(id => id === prod._id.toString()).length,
      price: prod.price,
    }));
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `ORDER-${randomNum}`;

    const newOrder = await Order.create({
      userEmail: user.email,
      orderNumber,
      status: "Pending",
      line_items,
      name,
      email,
      city,
      postalCode,
      country,
      streetAddress,
      phone,
      createdAt: new Date(),
    });

    const year = new Date().getFullYear();
    const itemsHtml = line_items.map((item, index) => `
  <li
    style="
      margin-bottom:10px;
      list-style:none;
      ${index < line_items.length - 1 ? 'border-bottom:1px solid #eee;' : ''}
      padding:5px 0;
    "
  >
    <table style="width:100%; border-collapse:collapse;">
      <tr>
        <td style="width:60%; text-align:left; font-weight:bold; color:#333;">${item.name}</td>
        <td style="width:20%; text-align:center; color:#555;">Qty: ${item.quantity}</td>
        <td style="width:20%; text-align:right; color:#333;">€${item.price}</td>
      </tr>
    </table>
  </li>
`).join('');

    const emailHtml = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px; text-align: center;">
  <img src="https://2funshops.com/logo.png" alt="Logo" style="width:150px; margin-bottom:20px;" />
  
  <h2 style="color:#333;">Thanks for your order, ${name}! 🎉</h2>
  <div style="max-width:600px; margin:30px auto;">
    <div style="position: relative; height: 6px; background: #ddd; border-radius: 3px;">
      <div style="position: absolute; height: 6px; background: #4caf50; width: 25%; border-radius: 3px;"></div>
    </div>
    <div style="display:flex; justify-content:space-between; font-size:13px; color:#777; margin-top:18px;">
    <div style="width:25%; text-align:center;">Ordered</div>
    <div style="width:25%; text-align:center;">In review</div>
    <div style="width:25%; text-align:center;">Out for delivery</div>
    <div style="width:25%; text-align:center;">Delivered</div>
  </div>
  </div>
  <div style="background:#fff; max-width:600px; margin:0 auto; text-align:left; border:1px solid #eee; border-radius:8px; padding:20px;">
    <h4 style="color:#333; text-align:center;">Your order has been received and is being reviewed.</h4>

    <p style="color:#333; margin-bottom:10px;"><strong>Order Number:</strong> <span style="color:#777;">${orderNumber}</span></p>
    <p style="color:#333; font-weight: bold">${name} – ${city}</p>

    <p style="color:#333; margin-bottom:10px;"><strong>Items:</strong></p>
    <div style="color:#777; margin-bottom: 20px">${itemsHtml}</div>

    <div style="max-width:600px; margin:10px auto; border-top:1px solid #cccccc;"></div>

    <div style="font-size:14px; color:#333; font-weight:bold; margin-top:10px;">
  <table style="width:100%; border-collapse:collapse;">
    <tr>
      <td style="text-align:left;">Total:</td>
      <td style="text-align:right;">€${line_items.reduce((sum, i) => sum + i.price * i.quantity, 0)}</td>
    </tr>
  </table>
</div>

    <div style="max-width:600px; margin:10px auto; border-top:1px solid #cccccc;"></div>

    <div style="text-align:center; margin-top:20px;">
      <p style="margin-top:20px;">We’ll email you once your order is approved.</p>
      <a href="https://2funshops.com/orders" style="display:inline-block; margin-top:10px; padding:12px 25px; background:#1f1f1f; color:white; border-radius:8px; text-decoration:none; font-size:16px;">
        View Your Orders
      </a>
      <p style="font-size: 12px; color: #aaa; margin-top: 30px;">©2023-${year} All rights reserved — <a href="https://2funshops.com" style="color:#777; text-decoration:none;">2funshops.com</a></p>
    </div>
  </div>
</div>`;

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_2FUN,
        to: [email, process.env.ORDER_REVIEW],
        subject: `Order Confirmation — ${orderNumber}`,
        html: emailHtml,
      });
      console.log(`Order confirmation sent to ${email}`);
    } catch (err) {
      console.error("Email send error:", err?.response?.data || err);
    }

    return res.status(201).json({ orderNumber });
  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(500).json({ message: "Error creating order", error: error.message });
  }
}