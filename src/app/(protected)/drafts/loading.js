import { getCurrentUser } from "@/services/getCurrentUser";
import { createClient } from "@/supabase/server";
import Link from "next/link";

export default function DraftsLoading()
{
    return (
        <div className="w-screen min-h-screen bg-dark-blue-black grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-3 sm:p-12">
            <StoryCardSkeleton/>
            <StoryCardSkeleton/>
            <StoryCardSkeleton/>
        </div>
    );
}
function StoryCardSkeleton()
{
    return (
        <div className="w-full bg-deep-space-blue outline outline-white/10 relative aspect-video animate-pulse rounded">
            
        </div>
    )
}