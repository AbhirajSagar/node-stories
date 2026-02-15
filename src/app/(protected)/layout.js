import { getCurrentUser } from "@/services/getCurrentUser";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({children})
{
    const user = await getCurrentUser();
    if(!user) redirect("/auth");

    return children;
}