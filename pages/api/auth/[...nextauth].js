import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import NextAuth from 'next-auth';

export const authOptions = {
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await mongooseConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error('No user found');
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error('Invalid password');
        return { id: user._id, email: user.email, name: user.name };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/account",
  }
};

export default (req, res) => NextAuth(req, res, authOptions);


// import NextAuth from 'next-auth'
// import GoogleProvider from 'next-auth/providers/google'
// import {MongoDBAdapter} from "@next-auth/mongodb-adapter";
// import clientPromise from "@/lib/mongodb";

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_FRONT_ID,
//       clientSecret: process.env.GOOGLE_FRONT_SECRET,
//     }),
//   ],
//   adapter: MongoDBAdapter(clientPromise),
// };

// export default NextAuth(authOptions);
