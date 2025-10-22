import { Resend } from 'resend';
import generateVerificationEmail from 'pages/sendVerificationCode.js';
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

  console.log('📨 Request to send verification to:', email);

  await mongooseConnect();

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await VerificationCode.findOne({ email });

  if (existingUser) {
    if (existingUser.createdAt && Date.now() - new Date(existingUser.createdAt).getTime() < 10 * 60 * 1000) {
      return res.status(400).json({ error: 'Verification code has already been sent recently.' });
    }
  }

  await VerificationCode.findOneAndUpdate(
    { email },
    {
      email,
      name,
      password: hashedPassword,
      code,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
    { upsert: true, new: true }
  );

  const htmlContent = generateVerificationEmail(name, code);

  try {
    const response = await resend.emails.send({
      from: 'VerificationCode@2funshops.com',
      to: email,
      subject: 'Your verification code',
      html: `<p>Hello ${name},</p><p>Your verification code is: <strong>${code}</strong></p>`,
    });

    console.log('📧 Resend send response:', response);

    return res.status(200).json({ message: 'Verification email sent successfully.' });
  } catch (err) {
    console.error('❌ Resend error:', err);
    return res.status(500).json({ error: 'Failed to send verification email.' });
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


// import { Resend } from 'resend';
// import { render } from '@react-email/render';
// import {
//   Html,
//   Head,
//   Body,
//   Container,
//   Img,
//   Text,
//   Heading,
//   Section,
//   Link,
// } from '@react-email/components';
// import { VerificationCode } from '@/models/VerificationCode';
// import { mongooseConnect } from '@/lib/mongoose';
// import bcrypt from 'bcryptjs';

// const resend = new Resend(process.env.RESEND_API_KEY);

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const { email, name, password } = req.body;

//   if (!email || !name || !password) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   console.log('📨 Sending verification email to:', email);

//   await mongooseConnect();

//   // Generate new verification code
//   const code = Math.floor(100000 + Math.random() * 900000).toString();
//   const hashedPassword = await bcrypt.hash(password, 10);

//   const existingUser = await VerificationCode.findOne({ email });

//   if (existingUser) {
//     const diff = Date.now() - new Date(existingUser.createdAt).getTime();
//     if (diff < 10 * 60 * 1000) {
//       return res
//         .status(400)
//         .json({ error: 'Verification code has already been sent recently.' });
//     }
//   }

//   await VerificationCode.findOneAndUpdate(
//     { email },
//     {
//       email,
//       name,
//       password: hashedPassword,
//       code,
//       createdAt: new Date(),
//       expiresAt: new Date(Date.now() + 10 * 60 * 1000),
//     },
//     { upsert: true, new: true }
//   );

//   // ✅ Build the React email content
//   const emailHtml = render(
//     <Html>
//       <Head />
//       <Body style={main}>
//         <Container style={container}>
//           <Img
//             src="https://2funshops.com/logo.png"
//             width="212"
//             height="88"
//             alt="2FunShops"
//             style={logo}
//           />
//           <Text style={tertiary}>Verify your email</Text>
//           <Heading style={secondary}>
//             Enter the following code to finish your registration:
//           </Heading>
//           <Section style={codeContainer}>
//             <Text style={codeStyle}>{code}</Text>
//           </Section>
//           <Text style={paragraph}>Not expecting this email?</Text>
//           <Text style={paragraph}>
//             Contact{' '}
//             <Link href="mailto:contact@2funshops.com" style={link}>
//               contact@2funshops.com
//             </Link>{' '}
//             if you did not request this code.
//           </Text>
//         </Container>
//         <Text style={footer}>Please do not reply to this email!</Text>
//       </Body>
//     </Html>
//   );

//   try {
//     // ✅ Send email via Resend
//     const response = await resend.emails.send({
//       from: 'no-reply@2funshops.com',
//       to: email,
//       subject: 'Your verification code',
//       html: emailHtml, // ✅ rendered HTML string
//     });

//     console.log('📧 Resend response:', response);
//     return res.status(200).json({ message: 'Verification email sent successfully.' });
//   } catch (err) {
//     console.error('❌ Resend error:', err);
//     return res.status(500).json({ error: 'Failed to send verification email.' });
//   }
// }

// const main = {
//   backgroundColor: '#ffffff',
//   fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
// };

// const container = {
//   backgroundColor: '#ffffff',
//   border: '1px solid #eee',
//   borderRadius: '5px',
//   boxShadow: '0 5px 10px rgba(20,50,70,.2)',
//   marginTop: '20px',
//   maxWidth: '360px',
//   margin: '0 auto',
//   padding: '68px 0 130px',
// };

// const logo = {
//   margin: '0 auto',
// };

// const tertiary = {
//   color: '#0a85ea',
//   fontSize: '11px',
//   fontWeight: 700,
//   fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
//   textAlign: 'center',
//   margin: '16px 8px 8px 8px',
//   textTransform: 'uppercase',
// };

// const secondary = {
//   color: '#000',
//   fontSize: '20px',
//   fontWeight: 500,
//   textAlign: 'center',
//   margin: '0',
// };

// const codeContainer = {
//   background: 'rgba(0,0,0,.05)',
//   borderRadius: '4px',
//   margin: '16px auto 14px',
//   width: '280px',
// };

// const codeStyle = {
//   color: '#000',
//   fontSize: '32px',
//   fontWeight: 700,
//   letterSpacing: '6px',
//   textAlign: 'center',
//   margin: '0 auto',
// };

// const paragraph = {
//   color: '#444',
//   fontSize: '15px',
//   textAlign: 'center',
//   margin: '0',
//   padding: '0 40px',
// };

// const link = {
//   color: '#444',
//   textDecoration: 'underline',
// };

// const footer = {
//   color: '#000',
//   fontSize: '12px',
//   fontWeight: 800,
//   textAlign: 'center',
//   marginTop: '20px',
//   textTransform: 'uppercase',
// };