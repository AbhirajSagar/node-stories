import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getCurrentUser()
{
    try
    {
        if(!process.env.JWT_SECRET)
            throw new Error("JWT_SECRET not set");

        const cookieStore = await cookies();
        const token = cookieStore.get("sessionId")?.value;

        if(!token) return null;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
    catch
    {
        return null;
    }
}