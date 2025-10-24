import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { mongooseConnect } from "@/lib/mongoose";
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await mongooseConnect();
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      console.log('No session or user email found.');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const email = session.user.email;
    console.log('Attempting to delete user:', email);

    const result = await User.deleteOne({ email });
    console.log('Delete result:', result);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'Account deleted successfully' });

  } catch (error) {
    console.error('delete-account error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}