import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');

    const result = await users.updateOne(
      { email: session.user.email },
      {
        $unset: {
          phone: "",
          streetAddress: "",
          city: "",
          postalCode: "",
          country: ""
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: 'No changes made. Fields may already be empty.' });
    }

    res.status(200).json({ message: 'Address fields deleted successfully' });
  } catch (error) {
    console.error('Failed to delete address:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

