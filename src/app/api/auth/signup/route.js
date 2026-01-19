import User from "../../../../models/User";
import connectDB from "../../../../database/connectDB";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(req) {
    try {
        await connectDB();
        const { name, email, password, dob } = await req.json();

        if (!name || !email || !password || !dob) {
            const missing = [];
            if (!name) missing.push("name");
            if (!email) missing.push("email");
            if (!password) missing.push("password");
            if (!dob) missing.push("dob");

            return new Response(
                JSON.stringify({ message: `Missing ${missing.join(", ")}` }),
                { status: 400 }
            );
        }

        const alreadyExisting = await User.findOne({ email });
        if (alreadyExisting)
            return new Response(
                JSON.stringify({
                    message: "User already exists with the email " + email,
                }),
                { status: 400 }
            );

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, dob });
        await user.save();

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_DURATION }
        );
        const cookie = serialize("authToken", token, {
            httpOnly: true,
            secure: process.env.APP_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 3600,
        });

        return new Response(
            JSON.stringify({ message: "User created successfully" }),
            { status: 201, headers: { "Set-Cookie": cookie } }
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
