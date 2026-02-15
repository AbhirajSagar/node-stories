import { getCurrentUser } from "@/services/getCurrentUser";
import { createClient } from "@/supabase/server";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
            <div className="w-full min-h-screen h-max bg-dark-blue-black lg:p-10">
                <h2 className="w-full h-18 text-white/50 text-xl font-semibold justify-center sm:justify-start sm:text-3xl  px-3 sm:text-left items-end flex">Drafts</h2>
                <div className="grid gap-2 w-full grid-cols-1 p-3 min-[350px]:grid-cols-2 min-[576px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {data.length > 0 ? data.map(async (story,idx) => <StoryCard key={idx} story={story} />) : <NoDrafts/>}
                </div>
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

function NoDrafts()
{
    return (
        <div className="col-span-full h-84 flex justify-center flex-col items-center">
            <FontAwesomeIcon icon={faCircleQuestion} className="w-24 h-24 text-white/50 mb-5 outline rounded-full outline-offset-5 outline-dashed"/>
            <h2 className="font-semibold text-white/50 mt-5">You have no drafts</h2>
            <Link href='/create' className="w-42 text-sm mx-auto text-center mt-3 bg-shadow-grey py-2 rounded outline outline-white/10 text-white/50">Create New Story</Link>
        </div>
    )
}

export function StoryCard({story})
{
    const {name, description, created_at, flow, storyid} = story;
    let {thumbnailUrl} = story;
    
    if(!thumbnailUrl) thumbnailUrl = extractThumbnail(flow)
    const date = new Date(created_at)
    const dateLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    return (
        <Link href={`/editor/${storyid}`} className="w-full overflow-hidden bg-deep-space-blue outline outline-white/10 relative aspect-9/16 rounded">
            {thumbnailUrl ? <img src={thumbnailUrl} alt={name} className="w-full h-full hover:scale-110 transition-transform duration-300 ease-in-out object-cover rounded"/> : <div className="w-full h-full flex justify-center items-start p-5 text-white/50"><p>No Thumbnail Assigned</p></div>}
            <div className="w-full bg-shadow-grey absolute bottom-0 left-0 right-0 p-3">
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