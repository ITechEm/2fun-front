import { mongooseConnect } from "@/lib/mongoose";
import { VerificationCode } from "@/models/VerificationCode";
import { User } from "@/models/User";

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

    await User.create({
      email: record.email,
      password: record.password,
      name: record.name,
      clientNumber,
    });
    await VerificationCode.deleteOne({ email });

    return res.status(200).json({ message: "Account verified successfully." });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}