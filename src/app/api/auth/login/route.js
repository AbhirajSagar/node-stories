import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createClient } from "@/supabase/server";
import { cookies } from "next/headers";

export async function POST(req)
{
    try
    {
        if(!process.env.JWT_SECRET)
            throw new Error("JWT_SECRET not set");

        const { email, password } = await req.json();

        if(!email) return Response.json({ error: "Email is required" }, { status: 400 });
        if(!password) return Response.json({ error: "Password is required" }, { status: 400 });

        const supabase = await createClient();

        const { data: userData } = await supabase
            .from('users')
            .select('userid, email, name, password')
            .eq('email', email)
            .maybeSingle();

        if(!userData)
            return Response.json({ message: `No user found with email ${email}` }, { status: 400 });

        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if(!isPasswordValid)
            return Response.json({ message: "Invalid password" }, { status: 401 });

        const tokenPayLoad =
        {
            userid: userData.userid,
            email: userData.email,
            name: userData.name
        };

        const authToken = jwt.sign(tokenPayLoad, process.env.JWT_SECRET, { expiresIn: '7d' });

        const cookieStore = await cookies();
        cookieStore.set({
            name: "sessionId",
            value: authToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/"
        });

        return Response.json(
            { message: "Logged in successfully", userid: userData.userid },
            { status: 200 }
        );
    }
    catch(error)
    {
        console.error("Login error:", error);
        return Response.json({ error: "Login failed" }, { status: 500 });
    }
}