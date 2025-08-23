import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

function generateClientNumber() {
  const now = new Date();
  // const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timePart = now.toTimeString().slice(0, 8).replace(/:/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${randomPart}${timePart}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { name, email, password } = req.body;
    await mongooseConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const clientNumber = generateClientNumber();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      clientNumber,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ error: error.message });
  }
}