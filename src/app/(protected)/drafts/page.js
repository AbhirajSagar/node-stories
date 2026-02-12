import { getCurrentUser } from "@/services/getCurrentUser";
import { createClient } from "@/supabase/server";
import Link from "next/link";

export default async function Drafts()
{
    try
    {
        const {userid} = await getCurrentUser();
        if(!userid) throw new Error('Unauthorized');

        const supabase = await createClient();
        if(!supabase) throw new Error('Failed to connect to database');
        
        const { data, error } = await supabase
            .from('stories')
            .select('*')
            .eq('userid', userid)
            .eq('published', false);
        
        console.log(data);
        
        if(error) throw error;
        

        return (
            <div className="w-screen min-h-screen bg-dark-blue-black grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-3 sm:p-12">
                {data.map(async (story,idx) => <StoryCard key={idx} story={story} />)}
            </div>
        );
    }
    catch(err)
    {
        console.log(err);
        return (
            <div>
                {String(err)}
            </div>
        )
    }
}
function StoryCard({story})
{
    const {name, description, created_at, flow, storyid} = story;
    let {thumbnailUrl} = story;
    
    if(!thumbnailUrl) thumbnailUrl = extractThumbnail(flow)
    const date = new Date(created_at)
    const dateLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    return (
        <Link href={`/editor/${storyid}`} className="w-full bg-deep-space-blue outline outline-white/10 relative aspect-video rounded">
            {thumbnailUrl ? <img src={thumbnailUrl} alt={name} className="w-full h-full object-cover rounded"/> : <div className="w-full h-full flex justify-center items-start p-5 text-white/50"><p>No Thumbnail Assigned</p></div>}
            <div className="absolute bottom-0 left-0 right-0 p-3 rounded">
                <h3 className="text-white font-bold text-lg">{name}</h3>
                <p className="text-gray-400 text-xs">
                    {dateLabel}
                </p>
            </div>
        </Link>
    )
}

function extractThumbnail(flow)
{
    const flowData = flow.flow;
    if(!flowData) return;

    const nodes = flowData.nodes;
    if(!nodes) return;

    for(const node of nodes)
        if(node.type === 'image')
            return node.data.key;
}