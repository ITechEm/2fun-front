import { Resend } from "resend"
import { VerificationCode } from "@/models/VerificationCode";
import { mongooseConnect } from "@/lib/mongoose";
import bcrypt from "bcryptjs";
import { User } from "@/models/User";

const resend = new Resend(process.env.RESEND_API_KEY);


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  await mongooseConnect();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingCode = await VerificationCode.findOne({ email });

  if (existingCode) {
    if (Date.now() - existingCode.createdAt.getTime() < 10 * 60 * 1000) {
      return res.status(400).json({
        error: "Verification code has already been sent recently.",
      });
    }
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "An account with this email already exists." });
  }

  await VerificationCode.findOneAndUpdate(
    { email },
    {
      email,
      name,
      password: hashedPassword,
      code,
      createdAt: new Date(),
      expiresAt: Date.now() + 10 * 60 * 1000,
    },
    { upsert: true, new: true }
  );

  const year = new Date().getFullYear();
  const emailTemplate = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px; text-align: center;">
    <img src="https://2funshops.com/logo.png" alt="Logo" style="width: 150px; margin-bottom: 20px;" />
    <h2 style="color: #333;">Hello ${name}, please verify your email address!</h2>
    <p style="font-size: 16px; color: #555;">
      Thank you for beginning a 2fun.shops account registration.
    </p></br>
    <p style="font-size: 16px; color: #555;">
     We want to make sure it's really you.
    </p>
    <h2 style="color: #000000ff;">Verification code</h2>
    <div style="background-color: #e0e0e0; display: inline-block; padding: 20px 30px; margin: 20px 0; border-radius: 8px;">
      <span style="font-size: 28px; letter-spacing: 4px; font-weight: bold;">${code}</span>
    </div>
    <p>If you don't want to create the account, you can ignore this email.</p>
    <div style="width:100%; max-width:600px; border-top:1px solid #cccccc; margin:20px auto;"></div>
    <p style="font-size: 12px; color: #aaa; margin-top: 30px;">©2023-${year} All rights reserved — 2funshops.com</p>
  </div>
`;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_2FUN,
      to: email,
      subject: `Verify your 2fun.shops Account`,
      html:emailTemplate,
  });
    return res.status(200).json({ message: "Verification email sent successfully."});
  } catch (err) {
    console.error("Email send error:", err?.response?.data || err);
    return res.status(500).json({ error: "Failed to send verification email." });
  }
}