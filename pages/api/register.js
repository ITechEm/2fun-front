import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    await mongooseConnect();
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const user = await User.create({ name, email, password });
    const safeUser = user.toObject();
    delete safeUser.password;
    res.status(201).json(safeUser);
    res.status(201).json(user);
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}