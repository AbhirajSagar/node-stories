import User from "../../../../models/User";
import connectDB from "../../../../database/connectDB";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(req) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        if (!email || !password) {
            const missing = [];
            if (!email) missing.push("email");
            if (!password) missing.push("password");

            return new Response(
                JSON.stringify({ message: `Missing ${missing.join(", ")}` }),
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (!user)
            return new Response(
                JSON.stringify({
                    message: "No user exists with the email " + email,
                }),
                { status: 400 }
            );

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return new Response(
                JSON.stringify({ message: "Invalid password" }),
                { status: 400 }
            );

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_DURATION }
        );

        const cookie = serialize("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: parseInt(process.env.JWT_DURATION),
        });

        return new Response(
            JSON.stringify({ message: "User logged in successfully" }),
            { status: 200, headers: { "Set-Cookie": cookie } }
        );
    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({
                message: "Internal server error: " + err.message,
            }),
            { status: 500 }
        );
    }
}
