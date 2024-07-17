import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from '@models/user';
import { connectDB } from '@utils/database';

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        })
    ],
    callbacks: {
        async session({ session }) {
            try {
                await connectDB();
                const sessionUser = await User.findOne({ email: session.user.email });
                if (sessionUser) {
                    session.user.id = sessionUser._id.toString();
                }
                return session;
            } catch (error) {
                console.error("Session callback error:", error);
                throw error; // Throw error to indicate session callback failure
            }
        },
        async signIn({ account, profile, user, credentials }){
            try {
                await connectDB();
                const userExists = await User.findOne({ email: profile.email });
                if (!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.name.replace(" ", "").toLowerCase(),
                        image: profile.picture
                    });
                }
                return true;
            } catch (error) {
                console.log("Sign-in callback error:", error);
                return false; // Return false on error to handle it appropriately
            }
        }
    }
});

export { handler as GET, handler as POST };
