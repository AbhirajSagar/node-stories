import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createClient } from "@/supabase/server";
import { cookies } from "next/headers";

export async function POST(req)
{
    try
    {
        if(!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");

        const { name, email, password, dob} = await req.json();

        if(!name) return Response.json({ error: "Name is required" }, { status: 400 });
        if(!email) return Response.json({ error: "Email is required" }, { status: 400 });
        if(!password) return Response.json({ error: "Password is required" }, { status: 400 });
        if(password.length < 6) return Response.json({ error: "Password too short" }, { status: 400 });
        if(!dob) return Response.json({ error: "Date of Birth is required" }, { status: 400 });

        const supabase = await createClient();

        const { data: userData } = await supabase.from('users').select('userid').eq('email', email).maybeSingle();
        if(userData) return Response.json({message: `User already exists with email ${email}`}, {status: 400});

        const hashedPassword = await bcrypt.hash(password, 10);

        const {data: newUser, error: insertionError } = await supabase
            .from('users')
            .insert([{name, email, password: hashedPassword, verified: false, dob}])
            .select('userid')
            .single();

        if(insertionError || !newUser) return Response.json({error: "User already exists or failed to create"}, {status: 400});

        const tokenPayLoad = { userid : newUser.userid, email, name };
        const authToken = jwt.sign(tokenPayLoad, process.env.JWT_SECRET, {expiresIn: '7d'});

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

        return Response.json({message: "User created successfully", userid: newUser.userid}, {status: 201});
    }
    catch(error)
    {
        console.error("Signup error:", error);
        return Response.json({ error: "Signup failed" }, { status: 500 });
    }
}