import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import crypto from "crypto";
import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  await mongooseConnect();

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ message: "No user found, redirecting to the Login page" });
  }

  const now = new Date();

  if (user.lastResetRequest && now - user.lastResetRequest < 5 * 60 * 1000) {
    const remainingSeconds = Math.ceil((5 * 60 * 1000 - (now - user.lastResetRequest)) / 1000);
    return res.status(429).json({
      error: `You can request another password reset in 5 min (${remainingSeconds}-seconds remaining)`,
    });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 3600 * 1000);

  user.resetToken = token;
  user.resetTokenExpiry = expiry;
  user.lastResetRequest = now;
  await user.save();

  const resend = new Resend(process.env.RESEND_API_KEY);
  const year = new Date().getFullYear();
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const emailTemplate = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px; text-align: center;">
    <img src="https://2funshops.com/logo.png" alt="Logo" style="width: 150px; margin-bottom: 20px;" />
    <h2 style="color: #333;">Hi, we received a request to reset your password!</h2>
    <p style="font-size: 15px; color: #555;">Click the button below to reset your password.</p>
    <a href="${resetLink}"
       style="display:inline-block; padding:15px 25px; background:#1f1f1f; color:white; border-radius:12px; text-decoration:none; font-size:16px; font-weight:bold;">
       Reset Password
    </a>
    <p style="margin-top: 20px; font-size: 13px;">If you didn’t request this, please ignore this email.</p>
    <div style="width:100%; max-width:600px; border-top:1px solid #cccccc; margin:20px auto;"></div>
    <p style="font-size: 12px; color: #aaa; margin-top: 10px;">©2023-${year} All rights reserved — 2funshops.com</p>
  </div>
`;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_2FUN,
      to: email,
      subject: "Your 2fun.shops reset password link",
      html: emailTemplate,
    });

    return res.json({ message: "We sent you an email with a reset password link." });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ error: "Failed to send reset email." });
  }
}
