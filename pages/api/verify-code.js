import { mongooseConnect } from "@/lib/mongoose";
import { VerificationCode } from "@/models/VerificationCode";
import { User } from "@/models/User";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateClientNumber() {
  const now = new Date();
  const timePart = now.toTimeString().slice(0, 8).replace(/:/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${randomPart}${timePart}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Missing email or code" });
  }

  try {
    await mongooseConnect();
    const record = await VerificationCode.findOne({ email });

    if (!record) {
      return res.status(400).json({ error: "Verification record not found" });
    }

    if (record.code !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const clientNumber = generateClientNumber();

    const user = await User.create({
      email: record.email,
      password: record.password,
      name: record.name,
      clientNumber,
    });

    await VerificationCode.deleteOne({ email });

    const year = new Date().getFullYear();
    const emailTemplate = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px; text-align: center;">
      <img src="https://2funshops.com/logo.png" alt="Logo" style="width: 150px; margin-bottom: 20px;" />
      <h1 style="color: #333;">Welcome to 2fun.shops, ${record.name}! 👋</h1> 
      <h2 style="margin-bottom: 30px; color:#555;">We're delighted to have you in our community.</h2>

      <div style="text-align: left; max-width: 600px; margin: 0 auto; font-size: 16px; color: #555;">
        <h2 style="font-size: 22px; color: #333; margin-top: 20px;">Here’s a quick guide to getting started:</h2>

        <p style="margin: 16px 0;">
          <strong style="color:#333;">1. Update Your Shipping Address</strong><br />
          Go to your <a style="color:#067df7; text-decoration:none;">Profile</a> and add your shipping address manually.<br />
          📌 We can’t process your order without a shipping address, so make sure it’s complete!
        </p>

        <p style="margin: 16px 0;">
          <strong style="color:#333;">2. Place an Order</strong><br />
          ▸ Explore our collection and find the items that catch your eye.<br />
          ▸ Add your favorite items to the cart.<br />
          ▸ Submit your order so we can review it!
        </p>

        <p style="margin: 16px 0;">
          <strong style="color:#333;">3. Personalization</strong><br />
          Once we receive your order, one of our team members will reach out via email, or you can send your 
          <a style="color:#067df7; text-decoration:none;">Order Number</a>
          to discuss any customizations or special requests.<br />
          Don’t worry — we’ll guide you step by step to make sure your order is perfect.
        </p>

        <p style="margin: 16px 0;">
          <strong style="color:#333;">4. Secure Payment</strong><br />
          After we’ve reviewed your order together, you can complete your payment safely through our secure checkout.<br />
          Once your payment is confirmed, we’ll update you on your 
          <a style="color:#067df7; text-decoration:none;">Order Status</a> so you’re always in the loop.
        </p>
      </div>

      <h3 style="margin-top: 10px; color:#333;">✨ We’re excited to help make your 2fun.shops experience amazing!</h3>

      <a href="https://2funshops.com"
        style="display:inline-block; margin-top: 20px; padding: 12px 25px; background:#1f1f1f; color:white; border-radius:8px; text-decoration:none; font-size:16px;">
        Go to 2fun.shops
      </a>

      <p style="font-size:14px; line-height:26px; color:#555; text-align:left; max-width:600px; margin: 0 auto; margin-top: 30px;">
        Put the love in handmade,<br />the 2fun.shops Team! 💛
      </p>

      <div style="max-width:600px; margin:30px auto; border-top:1px solid #cccccc;"></div>

      <p style="font-size: 12px; color: #aaa; margin-top: 30px;">©2023-${year} All rights reserved — 2funshops.com</p>
    </div>
    `;
    await resend.emails.send({
      from: process.env.RESEND_FROM_2FUN,
      to: record.email,
      subject: "Your 2fun.shops guide: Update, Personalize, and Shop!",
      html: emailTemplate,
    });

    console.log("Welcome email sent to", record.email);

    return res.status(200).json({ message: "Account verified and welcome email sent successfully.", user });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}