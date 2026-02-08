import { getCurrentUser } from "@/services/getCurrentUser";

export default async function ProtectedLayout({children})
{
    const user = await getCurrentUser();
    if(!user) return redirect("/auth");
    console.log(user);

    return children;
}