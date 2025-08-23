import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Address } from "@/models/Address";
import { User } from "@/models/User";

export default async function handle(req, res) {
  await mongooseConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Not authenticated' });

  const userEmail = session.user.email;

  if (req.method === 'PUT') {
    const address = await Address.findOne({ userEmail });
    if (address) {
      const updated = await Address.findByIdAndUpdate(address._id, req.body, { new: true });
      return res.json(updated);
    } else {
      const created = await Address.create({ userEmail, ...req.body });
      return res.json(created);
    }
  }

  if (req.method === 'GET') {
    const address = await Address.findOne({ userEmail });

    if (address) {
      const user = await User.findOne({ email: userEmail });
      return res.json({
        ...address._doc,
        email: userEmail,
        clientNumber: user?.clientNumber || '',
      });
    } else {
      const user = await User.findOne({ email: userEmail });

      return res.json({
        name: user?.name || '',
        email: userEmail,
        phone: '',
        streetAddress: '',
        city: '',
        postalCode: '',
        country: '',
        clientNumber: user?.clientNumber || '',
      });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}