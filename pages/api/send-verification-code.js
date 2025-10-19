import { Resend } from 'resend';
import sendVerificationCode from 'pages/sendVerificationCode.js';
import { VerificationCode } from "@/models/VerificationCode";
import { mongooseConnect } from "@/lib/mongoose";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  await mongooseConnect();

  // Generate a new 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash the password securely
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if the user already exists in the database
  const existingUser = await VerificationCode.findOne({ email });

  if (existingUser) {
    // Check if the code is expired (10 minutes expiry)
    if (Date.now() - existingUser.createdAt.getTime() < 10 * 60 * 1000) {
      return res.status(400).json({ error: 'Verification code has already been sent recently.' });
    }
  }

  // Update or create the verification code entry
  await VerificationCode.findOneAndUpdate(
    { email },
    { email, name, password: hashedPassword, code, createdAt: new Date(), expiresAt: Date.now() + 10 * 60 * 1000 }, // expiry time set to 10 minutes
    { upsert: true, new: true }
  );

  try {
  await resend.emails.send({
    from: '2fun.shops <support@2funshops.com>',
    to: email,
    subject: 'Test Email',
    html: `<p>This is a test email.</p>`,
  });
  return res.status(200).json({ message: 'Test email sent successfully.' });
} catch (err) {
  console.error('Test email error:', err);
  return res.status(500).json({ error: 'Failed to send test email.' });
}
}


// import { Resend } from 'resend';
// import { VerificationCode } from "@/models/VerificationCode";
// import { mongooseConnect } from "@/lib/mongoose";
// import bcrypt from 'bcrypt';

// const resend = new Resend(process.env.RESEND_API_KEY);

// export default async function handler(req, res) {
//   if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

//   const { email, name, password } = req.body;

//   if (!email || !name || !password) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   await mongooseConnect();

//   const code = Math.floor(100000 + Math.random() * 900000).toString();

//   // Hash the password before saving
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // Save to DB
//   await VerificationCode.findOneAndUpdate(
//     { email },
//     { email, name, password: hashedPassword, code, createdAt: new Date() },
//     { upsert: true }
//   );

//   try {
//     await resend.emails.send({
//       from: 'Your App <onboarding@yourdomain.resend.dev>',
//       to: email,
//       subject: 'Your verification code',
//       html: `<p>Hello ${name},</p><p>Your verification code is: <strong>${code}</strong></p>`,
//     });

//     return res.status(200).json({ message: 'Verification code sent.' });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Failed to send email.' });
//   }
// }
