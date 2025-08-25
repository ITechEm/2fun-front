import { Resend } from 'resend';
import { VerificationCode } from "@/models/VerificationCode";
import { mongooseConnect } from "@/lib/mongoose";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  await mongooseConnect();

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedPassword = await bcrypt.hash(password, 10);

  await VerificationCode.findOneAndUpdate(
    { email },
    { email, name, password: hashedPassword, code, createdAt: new Date() },
    { upsert: true, new: true }
  );

  try {
    await resend.emails.send({
      from: 'Your App <onboarding@yourdomain.resend.dev>',
      to: email,
      subject: 'Your verification code',
      html: `<p>Hello ${name},</p><p>Your verification code is: <strong>${code}</strong></p>`,
    });

    return res.status(200).json({ message: 'Verification code sent.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send email.' });
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
